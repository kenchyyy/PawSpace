import { createBooking } from '../../src/_components/Booking Form/bookingService';
import { supabase } from '../../src/lib/supabase/client';
import { mockOwner, mockBoardingPet, mockGroomingPet } from '../utils/mockData';

describe('Booking API Integration', () => {
    beforeAll(() => {
        // Setup test environment
    });

    test('creates boarding booking with all features', async () => {
        const result = await createBooking(mockOwner, [
            {
                ...mockBoardingPet,
                meal_instructions: {
                    breakfast: { time: '08:00', food: 'Kibble', notes: 'Warm water' },
                    lunch: { time: '13:00', food: 'Wet food', notes: '' },
                    dinner: { time: '19:00', food: 'Kibble', notes: '' }
                }
            }
        ], [450]);

        expect(result.success).toBe(true);
        expect(result.bookingId).toBeDefined();

        // Verify database state
        const { data } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', result.bookingId)
            .single();

        expect(data).toBeDefined();
        expect(data.status).toBe('pending');
        expect(data.meal_instructions).toBeDefined();
    });

    test('handles concurrent bookings correctly', async () => {
        const bookingPromises = [
            createBooking(mockOwner, [mockBoardingPet], [450]),
            createBooking(mockOwner, [mockBoardingPet], [450])
        ];

        const results = await Promise.all(bookingPromises);
        const successfulBookings = results.filter(r => r.success);
        expect(successfulBookings).toHaveLength(1);
    });

    afterAll(async () => {
        // Cleanup test data
        await supabase
            .from('bookings')
            .delete()
            .neq('id', '0');
    });
});
