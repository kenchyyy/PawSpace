// app/api/customer/history/load-more/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

const ITEMS_PER_PAGE = 5; // Should match the client-side value

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page');
        const pageNumber = page ? parseInt(page, 10) : 1;
        const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE - 1;

        const supabase = createRouteHandlerClient({ cookies });

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
            console.error('Error fetching booking history (page ${pageNumber}):', error);
            return NextResponse.json({ error: 'Failed to fetch more bookings' }, { status: 500 });
        }

        return NextResponse.json({ bookings: data.map(booking => ({
            bookingId: booking.booking_uuid,
            dateBooked: booking.date_booked,
            checkInDate: booking.service_date_start,
            checkOutDate: booking.service_date_end,
            status: booking.status,
            notes: booking.special_requests,
            ownerDetails: booking.owner_details,
            totalPrice: booking.total_amount,
            discountApplied: booking.discount_applied,
            // approvalStatus: booking.approval_status, -- this might needed to be added and add this to the selection if needed (approval_status)
        })) }, { status: 200 });
    } catch (error: unknown) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}