// src/app/history/page.tsx
'use server';

import React from 'react';
import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
import { BookingRecord, OwnerDetails, GroomService, BoardingPet, MealInstructionType } from '@/_components/BookingHistory/types/bookingRecordType';
import BookingHistoryClient from '@/_components/BookingHistory/BookingHistoryClient';
import { redirect } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';

const ITEMS_PER_PAGE = 5; 

async function getBookingHistory(
    page: number,
    supabase: SupabaseClient,
    userId: string | null = null // userId is optional; if null, fetches all
): Promise<{ bookings: BookingRecord[] | null; error: Error | null; totalCount: number | null }> {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    try {
        // Query for total count (conditionally filtered by userId)
        let countQuery = supabase.from('Booking').select('*', { count: 'exact' });
        if (userId) {
            countQuery = countQuery.eq('owner_details', userId);
        }
        const { count, error: countError } = await countQuery;

        if (countError) {
            console.error('Error fetching total booking count:', countError);
            return { bookings: null, error: countError, totalCount: null };
        }

        // Query for booking data (conditionally filtered by userId)
        let dataQuery = supabase
            .from('Booking')
            .select(`
                booking_uuid,
                date_booked,
                service_date_start,
                service_date_end,
                status,
                special_requests,
                total_amount,
                discount_applied,
                Owner (
                    id,
                    name,
                    address,
                    contact_number,
                    email
                ),
                Pet (
                    pet_uuid,
                    name,
                    age,
                    pet_type,
                    breed,
                    size,
                    vaccinated,
                    vitamins_or_medications,
                    allergies,
                    grooming_id,
                    boarding_id_extension,
                    GroomingPet (
                        id,
                        service_variant,
                        service_time
                    ),
                    BoardingPet (
                        id,
                        check_in_time,
                        check_out_time,
                        check_in_date,
                        boarding_type,
                        room_size,
                        special_feeding_request,
                        MealInstructions (
                            id,
                            meal_type,
                            time,
                            food,
                            notes
                        )
                    )
                )
            `);

        if (userId) {
            dataQuery = dataQuery.eq('owner_details', userId);
        }

        const { data, error } = await dataQuery
            .order('date_booked', { ascending: false })
            .range(startIndex, endIndex);

        if (error) {
            console.error(`Error fetching booking history with pets (page ${page}):`, error);
            return { bookings: null, error, totalCount: null };
        }

        if (data) {
            const bookingRecords = data.map(booking => {
                const ownerDetails: OwnerDetails | null = Array.isArray(booking.Owner) && booking.Owner.length > 0
                    ? (booking.Owner[0] as OwnerDetails)
                    : (booking.Owner && typeof booking.Owner === 'object' && !Array.isArray(booking.Owner)
                        ? (booking.Owner as OwnerDetails)
                        : null);

                return {
                    booking_uuid: booking.booking_uuid,
                    date_booked: booking.date_booked,
                    service_date_start: booking.service_date_start,
                    service_date_end: booking.service_date_end,
                    status: booking.status,
                    special_requests: booking.special_requests ?? null,
                    total_amount: booking.total_amount,
                    discount_applied: booking.discount_applied ?? null,
                    owner_details: ownerDetails as OwnerDetails, 
                    pets: booking.Pet ? booking.Pet.map(pet => {
                        const groomService = Array.isArray(pet.GroomingPet) && pet.GroomingPet.length > 0
                            ? pet.GroomingPet[0] as GroomService
                            : (pet.GroomingPet && typeof pet.GroomingPet === 'object' && !Array.isArray(pet.GroomingPet)
                                ? pet.GroomingPet as GroomService
                                : null);

                        const boardingPetRaw = Array.isArray(pet.BoardingPet) && pet.BoardingPet.length > 0
                            ? pet.BoardingPet[0]
                            : (pet.BoardingPet && typeof pet.BoardingPet === 'object' && !Array.isArray(pet.BoardingPet)
                                ? pet.BoardingPet
                                : null);

                        const boardingPet: BoardingPet | null = boardingPetRaw ? {
                            id: boardingPetRaw.id,
                            boarding_type: boardingPetRaw.boarding_type,
                            room_size: boardingPetRaw.room_size,
                            special_feeding_request: boardingPetRaw.special_feeding_request,
                            check_in_time: boardingPetRaw.check_in_time,
                            check_out_time: boardingPetRaw.check_out_time,
                            check_in_date: boardingPetRaw.check_in_date,
                            meal_instructions: Array.isArray(boardingPetRaw.MealInstructions) ? boardingPetRaw.MealInstructions as MealInstructionType[] : [],
                        } as BoardingPet : null;

                        return {
                            pet_uuid: pet.pet_uuid,
                            name: pet.name,
                            age: pet.age,
                            pet_type: pet.pet_type,
                            breed: pet.breed,
                            size: pet.size,
                            vaccinated: pet.vaccinated,
                            vitamins_or_medications: pet.vitamins_or_medications ?? null,
                            allergies: pet.allergies ?? null,
                            grooming_id: pet.grooming_id ?? null,
                            groom_service: groomService,
                            boarding_id_extension: pet.boarding_id_extension ?? null,
                            boarding_pet: boardingPet,
                        };
                    }) : [],
                };
            }) as BookingRecord[];

            return { bookings: bookingRecords, error: null, totalCount: count };
        }

        return { bookings: null, error: null, totalCount: count };
    } catch (error: unknown) {
        console.error('An unexpected error occurred:', error);
        return { bookings: null, error: new Error('Failed to fetch booking history with pets'), totalCount: null };
    }
}

export default async function BookingHistoryPage() {
    const supabase = await createServerSideClient();

    let userId: string | null = null;
    let initialError: Error | null = null;
    let totalCount: number | null = null;
    let initialBookings: BookingRecord[] | null = null;

    // Attempt to get the user session
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
        console.error("Supabase session error in BookingHistoryPage:", sessionError);
        // If there's a session error, `userId` will remain null, and `getBookingHistory` will fetch all.
        // Just uncomment the redirect below if you want to strictly enforce login for this page.
        redirect('/login');
    } else if (session?.user) {
        userId = session.user.id;
    }

    // Call getBookingHistory with or without userId based on session
    ({ bookings: initialBookings, error: initialError, totalCount } = await getBookingHistory(1, supabase, userId));

    return (
        <div>
            <BookingHistoryClient
                bookings={initialBookings}
                loading={!initialBookings && !initialError}
                error={initialError}
                totalCount={totalCount}
            />
        </div>
    );
}