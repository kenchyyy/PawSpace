'use server';

import React from 'react';
import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
import { BookingRecord, OwnerDetails, GroomingType, BoardingType } from '@/_components/BookingHistory/types/bookingRecordType';
import BookingHistoryClient from '@/_components/BookingHistory/BookingHistoryClient';
import { redirect } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';

const ITEMS_PER_PAGE = 5;

async function getBookingHistory(page: number, userId: string, supabase: SupabaseClient): Promise<{ bookings: BookingRecord[] | null; error: Error | null; totalCount: number | null }> {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    try {
        const { count, error: countError } = await supabase
            .from('Booking')
            .select('*', { count: 'exact' })
            .eq('owner_details', userId);

        if (countError) {
            console.error('Error fetching total booking count for user:', countError);
            return { bookings: null, error: countError, totalCount: null };
        }

        const { data, error } = await supabase
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
                        service_variant
                    ),
                    BoardingPet (
                        id,   
                        boarding_type,
                        room_size,          
                        special_feeding_request 
                    )
                )
            `)
            .eq('owner_details', userId)
            .order('date_booked', { ascending: false })
            .range(startIndex, endIndex);

        if (error) {
            console.error(`Error fetching booking history with pets for user (page ${page}):`, error);
            return { bookings: null, error, totalCount: null };
        }

        if (data) {
            const bookingRecords = data.map(booking => ({
                booking_uuid: booking.booking_uuid,
                date_booked: booking.date_booked,
                service_date_start: booking.service_date_start,
                service_date_end: booking.service_date_end,
                status: booking.status,
                special_requests: booking.special_requests ?? null,
                total_amount: booking.total_amount,
                discount_applied: booking.discount_applied ?? null,
                owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner as OwnerDetails,
                pets: booking.Pet ? booking.Pet.map(pet => {
                    const groomService = Array.isArray(pet.GroomingPet) && pet.GroomingPet.length > 0
                        ? pet.GroomingPet[0] as GroomingType
                        : (pet.GroomingPet && typeof pet.GroomingPet === 'object' && !Array.isArray(pet.GroomingPet)
                            ? pet.GroomingPet as GroomingType
                            : null);

                    const boardingPet = Array.isArray(pet.BoardingPet) && pet.BoardingPet.length > 0
                        ? pet.BoardingPet[0] as BoardingType
                        : (pet.BoardingPet && typeof pet.BoardingPet === 'object' && !Array.isArray(pet.BoardingPet)
                            ? pet.BoardingPet as BoardingType
                            : null);

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
            })) as BookingRecord[];
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

    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
        redirect('/login');
    }

    const userId = session.user.id;
    const { bookings: initialBookings, error: initialError, totalCount } = await getBookingHistory(1, userId, supabase);

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