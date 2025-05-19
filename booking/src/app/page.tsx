// src/StoryComponents/BookingHistory/page.tsx
'use server';

import React from 'react';
import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType'; // Assuming bookingRecordType.ts now contains both interfaces
import BookingHistoryClient from '@/_components/BookingHistory/BookingHistoryClient';
import { redirect } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';

const ITEMS_PER_PAGE = 5;

async function getBookingHistory(page: number, supabase: SupabaseClient): Promise<{ bookings: BookingRecord[] | null; error: Error | null; totalCount: number | null }> {
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE - 1;

  try {
    // Get the total count of bookings
    const { count, error: countError } = await supabase
      .from('Booking')
      .select('*', { count: 'exact' });

    if (countError) {
      console.error('Error fetching total booking count:', countError);
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
          email,
          auth_id
        )
      `)
      .order('date_booked', { ascending: false })
      .range(startIndex, endIndex);
    
    console.log("Supabase Data (page):", JSON.stringify(data, null, 2)); // Add this
    console.log("Supabase Error (page):", error);                 // Add this

    if (error) {
      console.error(`Error fetching booking history (page ${page}):`, error);
      return { bookings: null, error, totalCount: null };
    }

    if (data) {
      const bookingRecords = data.map(booking => ({
        booking_uuid: booking.booking_uuid,
        date_booked: booking.date_booked,
        service_date_start: booking.service_date_start,
        service_date_end: booking.service_date_end,
        status: booking.status,
        special_requests: booking.special_requests || '', 
        discount_applied: booking.discount_applied || 0,
        owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner as OwnerDetails,
      })) as BookingRecord[];
      return { bookings: bookingRecords, error: null, totalCount: count };
    }

    return { bookings: null, error: null, totalCount: count };
  } catch (error: unknown) {
    console.error('An unexpected error occurred:', error);
    return { bookings: null, error: new Error('Failed to fetch booking history'), totalCount: null };
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