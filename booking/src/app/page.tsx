'use server';

import React from 'react';
import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
import { BookingRecord } from '@/StoryComponents/BookingHistory/types/bookingRecordType';
import BookingHistoryClient from '@/StoryComponents/BookingHistory/BookingHistoryClient';

async function getBookingHistory(): Promise<{ bookings: BookingRecord[] | null; error: Error | null }> {
    const supabase = await createServerSideClient();

    try {
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
            .order('date_booked', { ascending: false });

        if (error) {
            console.error('Error fetching booking history:', error);
            return { bookings: null, error };
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
            return { bookings: bookingRecords, error: null };
        }

        return { bookings: null, error: null };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('An unexpected error occurred:', error.message);
            return { bookings: null, error: new Error('Failed to fetch booking history') };
        } else {
            console.error('An unexpected error occurred:', error);
            return { bookings: null, error: new Error('Failed to fetch booking history') };
        }
    }
}

export default async function BookingHistoryPage() {
    const { bookings, error } = await getBookingHistory();

    return (
        <div>
            <BookingHistoryClient
                bookings={bookings}
                loading={!bookings && !error}
                error={error}
            />
        </div>
    );
};

export default CustomerPage;
