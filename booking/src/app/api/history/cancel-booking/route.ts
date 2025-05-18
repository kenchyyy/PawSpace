// pages/api/cancel-booking.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bookingId, cancellationReason } = req.body;

    if (!bookingId) {
        return res.status(400).json({ message: 'Booking ID is required' });
    }

    const supabase = createServerSupabaseClient({ req, res });

    try {
        const { error } = await supabase
            .from('booking')
            .update({ status: 'cancelled', cancellation_reason: cancellationReason })
            .eq('booking_uuid', bookingId);

        if (error) {
            console.error('Error cancelling booking:', error);
            return res.status(500).json({ message: 'Failed to cancel booking' });
        }

        return res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error: unknown) {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export default handler;