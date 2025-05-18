// src/StoryComponents/BookingHistory/page.tsx
'use server';

import React from 'react';
import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
import { BookingRecord } from '@/_components/BookingHistory/types/bookingRecordType';
import BookingHistoryClient from '@/_components/BookingHistory/BookingHistoryClient';
import { redirect } from 'next/navigation'; // Import the redirect function
import { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient type

const ITEMS_PER_PAGE = 5; // You can adjust this number

async function getBookingHistory(page: number, supabase: SupabaseClient): Promise<{ bookings: BookingRecord[] | null; error: Error | null; totalCount: number | null }> {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    try {
        // Get the total count of bookings for the user
        const { count, error: countError } = await supabase
            .from('booking')
            .select('*', { count: 'exact' });

        if (countError) {
            console.error('Error fetching total booking count:', countError);
            return { bookings: null, error: countError, totalCount: null };
        }

        const { data, error } = await supabase
            .from('booking')
            .select(`
                booking_uuid,
                date_booked,
                service_date_start,
                service_date_end,
                status,
                owner_details,
                special_requests,
                total_amount,
                discount_applied
            `)
            .order('date_booked', { ascending: false })
            .range(startIndex, endIndex);

        if (error) {
            console.error('Error fetching booking history (page ${page}):', error);
            return { bookings: null, error, totalCount: null };
        }

        if (data) {
            const bookingRecords = data.map(booking => ({
                bookingId: booking.booking_uuid,
                dateBooked: booking.date_booked,
                checkInDate: booking.service_date_start,
                checkOutDate: booking.service_date_end,
                status: booking.status,
                notes: booking.special_requests,
                ownerDetails: booking.owner_details,
                totalPrice: booking.total_amount,
                discountApplied: booking.discount_applied,
            })) as BookingRecord[];
            return { bookings: bookingRecords, error: null, totalCount: count };
        }

        return { bookings: null, error: null, totalCount: count };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('An unexpected error occurred:', error.message);
            return { bookings: null, error: new Error('Failed to fetch booking history'), totalCount: null };
        } else {
            console.error('An unexpected error occurred:', error);
            return { bookings: null, error: new Error('Failed to fetch booking history'), totalCount: null };
        }
    }
}

export default async function BookingHistoryPage() {
    const supabase = await createServerSideClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        redirect('/login');
    }

    const { bookings: initialBookings, error: initialError, totalCount } = await getBookingHistory(1, supabase);

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