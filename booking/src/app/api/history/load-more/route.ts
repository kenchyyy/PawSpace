// app/api/customer/history/load-more/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType'; // Adjust the import path

const ITEMS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const pageNumber = page ? parseInt(page, 10) : 1;
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    const supabase = createRouteHandlerClient({ cookies });

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

    console.log("Supabase Data (load-more):", JSON.stringify(data, null, 2)); // Add this
    console.log("Supabase Error (load-more):", error);           // Add this

    if (error) {
      console.error(`Error fetching booking history (page ${pageNumber}):`, error);
      return NextResponse.json({ error: 'Failed to fetch more bookings' }, { status: 500 });
    }


    return NextResponse.json({
      bookings: data.map(booking => ({
        booking_uuid: booking.booking_uuid,
        date_booked: booking.date_booked,
        service_date_start: booking.service_date_start,
        service_date_end: booking.service_date_end,
        status: booking.status,
        special_requests: booking.special_requests || '', 
        discount_applied: booking.discount_applied || 0,
        owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner as OwnerDetails,
      })) as BookingRecord[]
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}