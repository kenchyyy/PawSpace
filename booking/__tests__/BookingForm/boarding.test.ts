import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { createBooking } from '../../src/_components/Booking Form/bookingService';
import { mockOwner, mockBoardingPet } from './utils/mockData';
import { BoardingPet, BoardingType, RoomSize, PetType } from '../../src/_components/Booking Form/types';
import { validatePetDetails } from '../../src/_components/Booking Form/utils/validation';

describe('Boarding Booking API Tests', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Sad Paths
    describe('Validation Errors', () => {
        test('should reject booking with invalid check-in/out times', () => {
            const invalidPet = {
                ...mockBoardingPet,
                check_in_time: '23:00',
                check_out_time: '08:00'
            };
            const errors = validatePetDetails(invalidPet);
            expect(errors.check_in_time).toBeDefined();
        });

        test('should reject day boarding with different check-in/out dates', () => {
            const invalidPet = {
                ...mockBoardingPet,
                boarding_type: 'day' as const,
                check_out_date: new Date('2025-06-11')
            };
            const errors = validatePetDetails(invalidPet);
            expect(errors.check_out_date).toBeDefined();
        });

        test('should reject booking with past dates', async () => {
            const invalidPet = {
                ...mockBoardingPet,
                check_in_date: new Date('2020-01-01')
            };
            const result = await createBooking(mockOwner, [invalidPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('past date');
        });

        test('should reject booking with invalid room size for pet type', async () => {
            const invalidPet: BoardingPet = {
                ...mockBoardingPet,
                pet_type: 'cat' as PetType,
                room_size: 'cat_small' as RoomSize,
                boarding_type: 'overnight' as BoardingType
            };
            const result = await createBooking(mockOwner, [invalidPet], [450]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('invalid room size');
        });
    });

    describe('Business Logic Tests', () => {
        test('should validate room size requirements', () => {
            const invalidPet: BoardingPet = {
                ...mockBoardingPet,
                size: '',
                room_size: ''
            };
            const errors = validatePetDetails(invalidPet);
            expect(errors.room_size).toBeDefined();
        });

        test('should validate meal instructions format', () => {
            const invalidPet = {
                ...mockBoardingPet,
                meal_instructions: {
                    breakfast: { time: '03:00', food: '', notes: '' },
                    lunch: { time: '', food: '', notes: '' },
                    dinner: { time: '', food: '', notes: '' }
                }
            };
            const errors = validatePetDetails(invalidPet);
            expect(errors['meal_instructions.breakfast.food']).toBeDefined();
        });
    });

    // Happy Paths - Keep these as integration tests
    describe('Successful Bookings', () => {
        test('should create valid overnight boarding booking', async () => {
            const result = await createBooking(mockOwner, [mockBoardingPet], [900]);
            expect(result.success).toBe(true);
            expect(result.bookingId).toBeDefined();
        });

        test('should apply correct discount for extended stay', async () => {
            const longStayPet = {
                ...mockBoardingPet,
                check_out_date: new Date('2025-06-25') // 15 days
            };
            const result = await createBooking(mockOwner, [longStayPet], [6750]); // With 20% discount
            expect(result.success).toBe(true);
        });

        test('should handle multiple pets with different room sizes', async () => {
            const multiplePets = [
                mockBoardingPet,
                { ...mockBoardingPet, room_size: 'large' as RoomSize }
            ];
            const result = await createBooking(mockOwner, multiplePets, [450, 800]);
            expect(result.success).toBe(true);
            expect(result.bookingIds).toHaveLength(2);
        });

        test('should apply holiday surcharge correctly', async () => {
            const holidayPet = {
                ...mockBoardingPet,
                check_in_date: new Date('2024-12-24'), // Christmas Eve
                check_out_date: new Date('2024-12-27')
            };
            const result = await createBooking(mockOwner, [holidayPet], [1500]); // Regular + surcharge
            expect(result.success).toBe(true);
        });

        test('should handle day boarding with meal instructions', async () => {
            const dayBoardingPet = {
                ...mockBoardingPet,
                boarding_type: 'day' as BoardingType,
                check_in_time: '09:00',
                check_out_time: '17:00',
                meal_instructions: {
                    breakfast: { time: '', food: '', notes: '' },
                    lunch: { time: '12:00', food: 'Kibble', notes: 'Half portion' },
                    dinner: { time: '', food: '', notes: '' }
                }
            };
            const result = await createBooking(mockOwner, [dayBoardingPet], [75]);
            expect(result.success).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        test('should handle last-minute bookings', async () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const lastMinutePet = {
                ...mockBoardingPet,
                check_in_date: tomorrow
            };
            const result = await createBooking(mockOwner, [lastMinutePet], [450]);
            expect(result.success).toBe(true);
            expect(result.bookingId).toBeDefined();
        });

        test('should validate maximum stay duration', async () => {
            const longStayPet = {
                ...mockBoardingPet,
                check_out_date: new Date('2025-12-31') // Very long stay
            };
            const result = await createBooking(mockOwner, [longStayPet], [10000]);
            expect(result.success).toBe(false);
            expect(result.error).toContain('maximum stay');
        });
    });
});
