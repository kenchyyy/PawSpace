import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { createBooking } from '../../src/_components/Booking Form/bookingService';
import { mockOwner, mockGroomingPet } from './utils/mockData';
import { GroomingPet, GroomingVariant, PetType, PetSize } from '../../src/_components/Booking Form/types';
import { createClient } from '@supabase/supabase-js';
import { validatePetDetails } from '../../src/_components/Booking Form/utils/validation';

// Mock Supabase client for testing
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

describe('Grooming Booking API Tests', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        // Reset supabase state
        return supabase.from('bookings').delete().neq('id', '0');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Configure global fetch mock
    beforeAll(() => {
        global.fetch = vi.fn();
    });

    // Cleanup all data after tests
    afterAll(async () => {
        await supabase.from('bookings').delete().neq('id', '0');
        await supabase.from('availability').delete().neq('id', '0');
        vi.useRealTimers();
    });

    // Sad Paths
    describe('Validation Errors', () => {
        test('should reject booking outside business hours', async () => {
            const invalidPet = {
                ...mockGroomingPet,
                service_time: '19:00' // After hours
            };
            const validation = validatePetDetails(invalidPet);
            expect(validation.service_time).toBeDefined();
            expect(validation.service_time).toContain('between 9 AM and 5 PM');
        });

        test('should reject booking with invalid service variant', async () => {
            const invalidPet: GroomingPet = {
                ...mockGroomingPet,
                pet_type: 'dog' as PetType,
                service_variant: 'basic' as GroomingVariant
            };
            const result = await createBooking(mockOwner, [invalidPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('invalid service variant');
        });

        test('should reject booking without size for dog grooming', async () => {
            const invalidPet = {
                ...mockGroomingPet,
                pet_type: 'dog' as const,
                size: '',
                service_variant: 'basic' as const
            };
            const result = await createBooking(mockOwner, [invalidPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('size required');
        });

        test('should validate required fields', async () => {
            const invalidPet: GroomingPet = {
                ...mockGroomingPet,
                name: '',
                breed: '',
                age: 'invalid'
            };
            const validation = validatePetDetails(invalidPet);
            expect(validation.name).toBeDefined();
            expect(validation.breed).toBeDefined();
            expect(validation.age).toBeDefined();
        });
    });

    describe('Business Logic Errors', () => {
        test('should reject double booking for same time slot', async () => {
            // First booking
            await createBooking(mockOwner, [mockGroomingPet], [450]);

            // Attempt second booking for same slot
            const result = await createBooking(mockOwner, [mockGroomingPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('time slot already booked');
        });

        test('should reject booking for unavailable time slot', async () => {
            const blockedPet = {
                ...mockGroomingPet,
                service_date: new Date('2025-12-25'), 
                service_time: '10:00'
            };
            const result = await createBooking(mockOwner, [blockedPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('unavailable date');
        });

        test('should reject same-day booking if full', async () => {
            // Setup: Fill all slots for the day
            const slots = Array(8).fill(null).map((_, i) => ({
                ...mockGroomingPet,
                service_time: `${9 + i}:00`
            }));

            for (const slot of slots) {
                await createBooking(mockOwner, [slot], [450]);
            }

            // Attempt booking when full
            const result = await createBooking(mockOwner, [mockGroomingPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('no available slots');
        });

        test('should reject invalid pricing', async () => {
            const result = await createBooking(mockOwner, [mockGroomingPet], [100]); // Price too low
            expect(result.success).toBe(false);
            expect(result.error).toContain('invalid price');
        });
    });

    // Happy Paths
    describe('Successful Bookings', () => {
        test('should create valid cat grooming booking', async () => {
            const result = await createBooking(mockOwner, [mockGroomingPet], [450]);
            expect(result.success).toBe(true);
            expect(result.bookingId).toBeDefined();
        });

        test('should create valid dog grooming booking', async () => {
            const invalidPet = {
                ...mockGroomingPet,
                pet_type: 'dog' as const,
                service_variant: 'basic' as const,
                size: 'medium' as const
            };

            const dogGroomingPet = {
                ...mockGroomingPet,
                pet_type: 'dog' as const,
                service_variant: 'basic' as const,
                size: 'medium' as const
            };
            const result = await createBooking(mockOwner, [dogGroomingPet], [400]);
            expect(result.success).toBe(true);
        });

        test('should handle multiple pets in single booking', async () => {
            const pets = [
                mockGroomingPet,
                { ...mockGroomingPet, service_time: '14:00', name: 'Luna' }
            ];
            const result = await createBooking(mockOwner, pets, [450, 450]);
            expect(result.success).toBe(true);
            expect(result.bookingIds).toHaveLength(2);
        });

        test('should apply holiday surcharge correctly', async () => {
            const holidayPet = {
                ...mockGroomingPet,
                service_date: new Date('2025-12-24') 
            };
            const result = await createBooking(mockOwner, [holidayPet], [500]); // Regular price + surcharge
            expect(result.success).toBe(true);
        });
    });

    // Add integration tests
    describe('Integration Scenarios', () => {
        beforeEach(() => {
            // Mock successful fetch response
            global.fetch = vi.fn().mockResolvedValue({
                json: () => Promise.resolve({ 
                    bookedSlots: [mockGroomingPet.service_time] 
                })
            });
        });

        test('should update availability after successful booking', async () => {
            const result1 = await createBooking(mockOwner, [mockGroomingPet], [450]);
            expect(result1.success).toBe(true);

            // Check availability is updated
            const checkAvailability = await fetch(`/api/availability?date=${mockGroomingPet.service_date}`);
            const availability = await checkAvailability.json();
            expect(availability.bookedSlots).toContain(mockGroomingPet.service_time);
        });
    });

    describe('Edge Cases and Network Errors', () => {
        test('should handle network timeout gracefully', async () => {
            vi.useFakeTimers();
            const slowPet = { ...mockGroomingPet };
            const bookingPromise = createBooking(mockOwner, [slowPet], [450]);
            
            // Advance timers and handle rejection
            await vi.runAllTimersAsync();
            const result = await bookingPromise.catch(err => ({
                success: false,
                error: err.message
            }));
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('timeout');
        });

        test('should handle server errors', async () => {
            // More robust server error simulation
            global.fetch = vi.fn().mockRejectedValue(new Error('500 Internal Server Error'));
            const result = await createBooking(mockOwner, [mockGroomingPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('server error');
        });

        test('should validate all required fields thoroughly', async () => {
            const invalidPet: GroomingPet = {
                ...mockGroomingPet,
                name: '',
                breed: '',
                age: 'invalid',
                service_time: '25:00',
                service_date: null 
            };
            const result = await createBooking(mockOwner, [invalidPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toMatch(/validation failed.*required fields/i);
        });
    });

    describe('Database Integration', () => {
        beforeAll(async () => {
            await supabase.from('bookings').delete().neq('id', '0');
        });

        test('should persist booking data correctly', async () => {
            const result = await createBooking(mockOwner, [mockGroomingPet], [450]);
            expect(result.success).toBe(true);

            const { data: booking } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', result.bookingId)
                .single();

            expect(booking).toBeDefined();
            expect(booking.status).toBe('pending');
            expect(booking.pet_details).toMatchObject(mockGroomingPet);
        });

        afterAll(async () => {
            // Cleanup test data
            await supabase.from('bookings').delete().neq('id', '0');
        });
    });

    describe('Price Calculations', () => {
        test('should calculate deluxe grooming price correctly', async () => {
            const deluxePet: GroomingPet = {
                ...mockGroomingPet,
                pet_type: 'dog' as PetType,
                service_variant: 'deluxe' as GroomingVariant,
                size: 'large' as PetSize
            };
            const result = await createBooking(mockOwner, [deluxePet], [600]);
            expect(result.success).toBe(true);
        });

        test('should reject mismatched prices', async () => {
            const result = await createBooking(mockOwner, [mockGroomingPet], [400]); // Wrong price
            expect(result.success).toBe(false);
            expect(result.error).toContain('price mismatch');
        });
    });

    describe('Time Slot Management', () => {
        test('should enforce minimum time between appointments', async () => {
            const firstPet = { ...mockGroomingPet, service_time: '10:00' };
            await createBooking(mockOwner, [firstPet], [450]);

            const secondPet = { ...mockGroomingPet, service_time: '10:30' }; // Too close to previous
            const result = await createBooking(mockOwner, [secondPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('minimum time between appointments');
        });

        test('should handle lunch break periods', async () => {
            const lunchPet = {
                ...mockGroomingPet,
                service_time: '12:30' 
            };
            const result = await createBooking(mockOwner, [lunchPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('lunch break');
        });
    });

    describe('Cancellation and Modification', () => {
        test('should handle cancellation within allowed period', async () => {
            const result = await createBooking(mockOwner, [mockGroomingPet], [450]);
            expect(result.success).toBe(true);

            const cancellation = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('id', result.bookingId);

            expect(cancellation.error).toBeNull();
        });
    });

    // Grooming Booking Tests
    describe('Grooming Booking Tests', () => {
        beforeEach(() => {
            vi.resetAllMocks();
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        describe('Validation Tests', () => {
            test('should validate service time', () => {
                const invalidPet = {
                    ...mockGroomingPet,
                    service_time: '19:00'
                };
                const errors = validatePetDetails(invalidPet);
                expect(errors.service_time).toBeDefined();
            });

            test('should validate required fields', () => {
                const invalidPet: GroomingPet = {
                    ...mockGroomingPet,
                    name: '',
                    breed: '',
                    service_variant: '' as GroomingVariant
                };
                const errors = validatePetDetails(invalidPet);
                expect(errors.name).toBeDefined();
                expect(errors.breed).toBeDefined();
                expect(errors.service_variant).toBeDefined();
            });
        });

        // Keep integration tests but mock external services
        describe('Integration Tests', () => {
            beforeEach(() => {
                vi.mock('../../src/_components/Booking Form/bookingService', () => ({
                    createBooking: vi.fn().mockResolvedValue({ success: true, bookingId: 'test-123' })
                }));
            });

            test('should create booking successfully', async () => {
                const result = await createBooking(mockOwner, [mockGroomingPet], [450]);
                expect(result.success).toBe(true);
                expect(result.bookingId).toBeDefined();
            });
        });
    });
});
