// app/api/submit-feedback/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { booking_uuid, feedback_message, rating_score } = await request.json();

        if (!booking_uuid || typeof booking_uuid !== 'string') {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }
        if (!feedback_message || typeof feedback_message !== 'string' || feedback_message.trim() === '') {
            return NextResponse.json({ error: 'Feedback message is required' }, { status: 400 });
        }
        if (rating_score !== undefined && (typeof rating_score !== 'number' || rating_score < 1 || rating_score > 5)) {
            return NextResponse.json({ error: 'Rating score must be between 1 and 5' }, { status: 400 });
        }

        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        const { data: { session } } = await supabase.auth.getSession();

        const user_id = session?.user?.id; // Safely access user ID

        const { data, error } = await supabase
            .from('feedback')
            .insert({
                feedback_booking_uuid: booking_uuid,
                feedback_message: feedback_message,
                rating_score: rating_score,
                user_id: user_id, // Use the safely accessed user ID
            })
            .select('id') // Optionally select the ID of the new feedback entry
            .single();

        if (error) {
            console.error('Error submitting feedback:', error);
            return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Feedback submitted successfully!', data }, { status: 200 });

    } catch (error: unknown) {
        console.error('Error processing feedback submission:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
