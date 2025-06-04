import { NextResponse, NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { bookingId, cancelMessage } = await request.json();

  if (!bookingId || typeof bookingId !== 'string' || typeof cancelMessage !== 'string' || cancelMessage.trim() === '') {
    return NextResponse.json({ message: 'Booking ID and a cancellation message are required.' }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { error: updateError } = await supabase
      .from('Booking')
      .update({ status: 'cancelled' })
      .eq('booking_uuid', bookingId);

    if (updateError) {
      console.error('Error updating booking status:', updateError);
      return NextResponse.json({ message: 'Failed to update booking status.' }, { status: 500 });
    }
        
    const { error: insertError } = await supabase
      .from('CancelMessages')
      .insert({
        booking_uuid: bookingId,
        message: cancelMessage,
        date_submitted: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error inserting cancellation message:', insertError);
      return NextResponse.json({ message: 'Failed to save cancellation message.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Booking cancelled successfully.' }, { status: 200 });

  } catch (error: unknown) {
    console.error('An unexpected error occurred during cancellation:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}