import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import { createBooking } from '../../src/_components/Booking Form/bookingService';
import { createClient } from '@supabase/supabase-js';
import { mockOwner, mockBoardingPet, mockGroomingPet } from './utils/mockData';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

describe('Booking API Integration', () => {
    beforeEach(async () => {
        await supabase.from('bookings').delete().neq('id', 0);
    });

    test('creates booking and updates availability', async () => {
        const result = await createBooking(mockOwner, [mockBoardingPet], [450]);
        expect(result.success).toBe(true);

        const { data: availability } = await supabase
            .from('availability')
            .select('*')
            .eq('date', mockBoardingPet.check_in_date);

        expect(availability?.[0].booked_slots).toContain(mockBoardingPet.check_in_time);
    });

    test('handles concurrent bookings correctly', async () => {
        const bookingPromises = [
            createBooking(mockOwner, [mockGroomingPet], [450]),
            createBooking(mockOwner, [mockGroomingPet], [450])
        ];

        const results = await Promise.all(bookingPromises);
        expect(results.filter(r => r.success)).toHaveLength(1);
    });

    test('handles booking modifications correctly', async () => {
        const result = await createBooking(mockOwner, [mockBoardingPet], [450]);
        expect(result.success).toBe(true);

        const { data: updatedBooking } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', result.bookingId)
            .select()
            .single();

        expect(updatedBooking.status).toBe('cancelled');
    });

    test('validates data integrity', async () => {
        const result = await createBooking(mockOwner, [mockBoardingPet], [450]);
        expect(result.success).toBe(true);

        const { data: booking } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', result.bookingId)
            .single();

        expect(booking.owner_details).toMatchObject(mockOwner);
        expect(booking.total_amount).toBe(450);
        expect(new Date(booking.service_date_start)).toEqual(mockBoardingPet.check_in_date);
    });

    test('handles transaction rollback on failure', async () => {
        // Simulate a failed booking
        const invalidPet = { ...mockBoardingPet, check_in_date: null };
        const result = await createBooking(mockOwner, [invalidPet], [450]);
        expect(result.success).toBe(false);

        // Verify no partial data was saved
        const { count } = await supabase
            .from('bookings')
            .select('*', { count: 'exact' });
        expect(count).toBe(0);
    });

    test('maintains availability consistency', async () => {
        // Create initial booking
        const bookingResult = await createBooking(mockOwner, [mockBoardingPet], [450]);
        expect(bookingResult.success).toBe(true);

        // Verify slot is marked as unavailable
        const { data: slots } = await supabase
            .from('availability')
            .select('booked_slots')
            .eq('date', mockBoardingPet.check_in_date)
            .single();

        expect(slots).not.toBeNull();
        expect(slots?.booked_slots).toBeDefined();
        expect(slots?.booked_slots).toContain(mockBoardingPet.check_in_time);

        // Try to book same slot
        const duplicateResult = await createBooking(mockOwner, [mockBoardingPet], [450]);
        expect(duplicateResult.success).toBe(false);
    });

    afterAll(async () => {
        await supabase.from('bookings').delete().neq('id', '0');
        await supabase.from('availability').delete().neq('id', '0');
    });
});
