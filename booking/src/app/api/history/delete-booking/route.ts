// app/api/history/delete-booking/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(request: NextRequest) {
    const bookingId = request.nextUrl.searchParams.get('bookingId');

    if (!bookingId || typeof bookingId !== 'string') {
        return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
        const { error } = await supabase
            .from('booking')
            .delete()
            .eq('booking_uuid', bookingId);

        if (error) {
            console.error('Error deleting booking:', error);
            return NextResponse.json({ message: 'Failed to delete booking' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
    } catch (error: unknown) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}