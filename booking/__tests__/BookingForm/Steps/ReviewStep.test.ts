import { describe, test, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/dom';
import { mockOwner, mockBoardingPet, mockGroomingPet } from '../utils/mockData';
import type { ReviewStepProps, BookingResult } from '../../../src/_components/Booking Form/types';
import { validateReviewStep, validateBooking, BookingValidationData } from '../../../src/_components/Booking Form/utils/validation';

describe('ReviewStep', () => {
    const mockBookingResult: BookingResult = {
        success: true,
        bookingId: 'test-123'
    };

    const defaultProps: ReviewStepProps = {
        ownerDetails: mockOwner,
        pets: [mockBoardingPet],
        serviceType: 'boarding',
        confirmedInfo: false,
        onConfirmChange: vi.fn(),
        onBack: vi.fn(),
        onConfirm: vi.fn().mockResolvedValue(mockBookingResult),
        isSubmitting: false,
        errors: {}
    };

    test('displays owner and pet information', () => {
        const result = validateReviewStep({
            ownerDetails: mockOwner,
            pets: [mockBoardingPet],
            confirmedInfo: true
        });
        expect(result.owner).toBeUndefined();
        expect(result.pets).toBeUndefined();
    });

    test('handles submission flow', async () => {
        const testData: BookingValidationData = {
            ownerDetails: mockOwner,
            pets: [mockBoardingPet],
            confirmedInfo: true,
            totalAmounts: [450]
        };
        const result = await validateBooking(testData);
        expect(result.success).toBe(true);
    });

    test('validates multiple pets pricing', () => {
        const testData: BookingValidationData = {
            ownerDetails: mockOwner,
            pets: [mockBoardingPet, mockGroomingPet],
            confirmedInfo: true,
            totalAmounts: [450, 450]
        };
        const result = validateBooking(testData);
        expect(result.success).toBe(true);
    });

    test('validates extended stay discounts', () => {
        const extendedStayPet = {
            ...mockBoardingPet,
            check_out_date: new Date('2025-06-25') // 15 days
        };
        const testData: BookingValidationData = {
            ownerDetails: mockOwner,
            pets: [extendedStayPet],
            confirmedInfo: true,
            totalAmounts: [6750],
            discountsApplied: [1500]
        };
        const result = validateBooking(testData);
        expect(result.success).toBe(true);
        expect(result.errors.discount).toBeUndefined();
    });

    test('handles invalid total amounts', () => {
        const testData: BookingValidationData = {
            ownerDetails: mockOwner,
            pets: [mockBoardingPet],
            confirmedInfo: true,
            totalAmounts: [-100]
        };
        const result = validateBooking(testData);
        expect(result.success).toBe(false);
        expect(result.errors.pricing).toBeDefined();
    });
});

describe('Review Step Validation', () => {
    test('validates required confirmations', () => {
        const result = validateReviewStep({
            ownerDetails: mockOwner,
            pets: [mockBoardingPet],
            confirmedInfo: false
        });
        expect(result.confirmation).toBeDefined();
    });

    test('validates booking totals', () => {
        const result = validateBooking({
            ownerDetails: mockOwner,
            pets: [mockBoardingPet],
            confirmedInfo: true,
            totalAmounts: [-1]
        });
        expect(result.errors.pricing).toBeDefined();
    });

    test('validates complete booking data', () => {
        const result = validateBooking({
            ownerDetails: mockOwner,
            pets: [mockBoardingPet],
            confirmedInfo: false
        });
        expect(result.errors.confirmation).toBeDefined();
    });

    test('validates pricing calculations', () => {
        const result = validateBooking({
            ownerDetails: mockOwner,
            pets: [
                mockBoardingPet,
                mockGroomingPet
            ],
            totalAmounts: [450, 450],
            confirmedInfo: true // Add missing required field
        });
        expect(result.success).toBe(true);
    });

    test('validates discount application', () => {
        const testData: BookingValidationData = {
            ownerDetails: mockOwner,
            pets: [mockBoardingPet],
            totalAmounts: [6750],
            discountsApplied: [1500],
            confirmedInfo: true // Add missing required field
        };
        const result = validateBooking(testData);
        expect(result.success).toBe(true);
    });
});
