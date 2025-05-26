'use server';

import React from 'react';
import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';
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
                    pet_type,
                    grooming_id,
                    boarding_id_extension,
                    GroomingPet (
                        id,
                        service_variant
                    ),
                    BoardingPet (
                        id,
                        boarding_type
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
                pets: booking.Pet ? booking.Pet.map(pet => ({
                    pet_uuid: pet.pet_uuid,
                    name: pet.name,
                    pet_type: pet.pet_type,
                    grooming_id: pet.grooming_id ?? null,
                    groom_service: Array.isArray(pet.GroomingPet) && pet.GroomingPet.length > 0
                        ? { id: (pet.GroomingPet[0] as { id: string; service_variant: string }).id, service_variant: (pet.GroomingPet[0] as { id: string; service_variant: string }).service_variant }
                        : (pet.GroomingPet && !Array.isArray(pet.GroomingPet) && typeof pet.GroomingPet === 'object'
                            ? { id: (pet.GroomingPet as { id: string; service_variant: string }).id, service_variant: (pet.GroomingPet as { id: string; service_variant: string }).service_variant }
                            : null),
                    boarding_id_extension: pet.grooming_id ?? null,
                    boarding_pet: Array.isArray(pet.BoardingPet) && pet.BoardingPet.length > 0
                        ? { id: (pet.BoardingPet[0] as { id: string; boarding_type: string }).id, boarding_type: (pet.BoardingPet[0] as { id: string; boarding_type: string }).boarding_type }
                        : (pet.BoardingPet && !Array.isArray(pet.BoardingPet) && typeof pet.BoardingPet === 'object'
                            ? { id: (pet.BoardingPet as { id: string; boarding_type: string }).id, boarding_type: (pet.BoardingPet as { id: string; boarding_type: string }).boarding_type }
                            : null),
                })) : [],
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