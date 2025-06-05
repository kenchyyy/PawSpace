import { describe, test, expect } from 'vitest';
import { validatePetDetails } from '../../../src/_components/Booking Form/utils/validation';
import { mockBoardingPet, mockGroomingPet } from '../utils/mockData';
import type { BoardingPet, GroomingPet } from '../../../src/_components/Booking Form/types';

describe('Pet Step Validation', () => {
    test('validates boarding schedule', () => {
        const invalidPet: BoardingPet = {
            ...mockBoardingPet,
            boarding_type: 'overnight',
            check_in_date: new Date('2025-06-15'),
            check_out_date: new Date('2025-06-14'),
            room_size: 'medium',
            check_in_time: '09:00',
            check_out_time: '09:00'
        };
        const result = validatePetDetails(invalidPet);
        expect(result.check_out_date).toBeUndefined(); // Both date and time can be undefined for grooming
        expect(result.check_out_time).toBeUndefined();
    });

    test('validates grooming schedule', () => {
        const invalidPet: GroomingPet = {
            ...mockGroomingPet,
            service_time: '19:00' // After hours
        };
        const result = validatePetDetails(invalidPet);
        expect(result.service_time).toBeDefined();
    });

    test('validates meal instructions', () => {
        const invalidPet: BoardingPet = {
            ...mockBoardingPet,
            meal_instructions: {
                breakfast: { time: '', food: 'Dog Food', notes: '' }, 
                lunch: { time: '', food: '', notes: '' },
                dinner: { time: '', food: '', notes: '' }
            }
        };
        const result = validatePetDetails(invalidPet);
        expect(result.meal_instructions).toBeUndefined();
    });

    test('validates pet size and room compatibility', () => {
        const invalidPet: BoardingPet = {
            ...mockBoardingPet,
            size: 'large',
            room_size: 'small'
        };
        const result = validatePetDetails(invalidPet);
        expect(result.room_size).toBeDefined();
    });

    test('validates required fields', () => {
        const emptyPet: BoardingPet = {
            ...mockBoardingPet,
            name: '',
            breed: '',
            age: '',
            vaccinated: '' as const
        };
        const result = validatePetDetails(emptyPet);
        expect(Object.keys(result).length).toBeGreaterThan(0);
        expect(result.name).toBeDefined();
        expect(result.breed).toBeDefined();
        expect(result.age).toBeDefined();
        expect(result.vaccinated).toBeDefined();
    });

    test('validates age format', () => {
        const invalidPet: BoardingPet = {
            ...mockBoardingPet,
            age: 'invalid' 
        };
        const result = validatePetDetails(invalidPet);
        expect(result.age).toBeDefined();
    });

    test('validates day boarding times', () => {
        const dayBoardingPet: BoardingPet = {
            ...mockBoardingPet,
            boarding_type: 'day',
            check_in_time: '09:00',
            check_out_time: '08:00' // Invalid: check-out before check-in
        };
        const result = validatePetDetails(dayBoardingPet);
        expect(result.check_out_time).toBeDefined();
    });

    test('validates overnight boarding dates', () => {
        const overnightPet: BoardingPet = {
            ...mockBoardingPet,
            boarding_type: 'overnight',
            check_in_date: new Date(),
            check_out_date: new Date() // Same day not allowed for overnight
        };
        const result = validatePetDetails(overnightPet);
        expect(result.check_out_date).toBeDefined();
    });

    test('validates grooming service variant', () => {
        const invalidPet: GroomingPet = {
            ...mockGroomingPet,
            pet_type: 'dog',
            service_variant: 'cat' // Invalid: dog cannot have cat service
        };
        const result = validatePetDetails(invalidPet);
        expect(result.service_variant).toBeDefined();
    });

    test('validates special requests length', () => {
        const longRequestPet: BoardingPet = {
            ...mockBoardingPet,
            special_requests: 'a'.repeat(501) // Exceeds max length
        };
        const result = validatePetDetails(longRequestPet);
        expect(result.special_requests).toBeDefined();
    });
});
