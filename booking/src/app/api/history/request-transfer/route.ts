// pages/api/request-transfer.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bookingId, transferDetails } = req.body;

    if (!bookingId) {
        return res.status(400).json({ message: 'Booking ID is required' });
    }

    if (!transferDetails || !transferDetails.reason) {
        return res.status(400).json({ message: 'Reason for transfer/reschedule is required' });
    }

    const supabase = createServerSupabaseClient({ req, res });

    try {
        const { error } = await supabase
            .from('booking')
            .update({ status: 'pending_transfer', transfer_details: transferDetails })
            .eq('booking_uuid', bookingId);

        if (error) {
            console.error('Error requesting transfer:', error);
            return res.status(500).json({ message: 'Failed to request transfer/reschedule' });
        }

        return res.status(200).json({ message: 'Transfer/Reschedule request submitted successfully. We will get back to you.' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('An unexpected error occurred:', error.message);
        } else {
            console.error('An unexpected error occurred:', error);
        }
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export default handler;