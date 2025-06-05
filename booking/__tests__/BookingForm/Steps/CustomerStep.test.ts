import { describe, test, expect } from 'vitest';
import { validateCustomerDetails } from '../../../src/_components/Booking Form/utils/validation';
import { mockOwner } from '../utils/mockData';
import type { OwnerDetails } from '../../../src/_components/Booking Form/types';

describe('Customer Step Validation', () => {
    test('validates empty fields', () => {
        const emptyOwner: OwnerDetails = {
            name: '',
            email: '',
            contact_number: '',
            address: ''
        };
        const result = validateCustomerDetails(emptyOwner);
        expect(Object.keys(result)).toHaveLength(4);
    });

    test('validates name format', () => {
        const result = validateCustomerDetails({
            ...mockOwner,
            name: 'a' // Too short
        });
        expect(result.name).toContain('at least');
    });

    test('validates email format', () => {
        const result = validateCustomerDetails({
            ...mockOwner,
            email: 'invalid-email'
        });
        expect(result.email).toContain('valid email');
    });

    test('validates Philippine phone number', () => {
        const result = validateCustomerDetails({
            ...mockOwner,
            contact_number: '12345'
        });
        expect(result.contact_number).toContain('Philippine mobile number');
    });

    test('accepts valid data', () => {
        const result = validateCustomerDetails(mockOwner);
        expect(Object.keys(result)).toHaveLength(0);
    });

    test('validates name with special characters', () => {
        const result = validateCustomerDetails({
            ...mockOwner,
            name: 'John.Doe-Smith' // Valid special characters
        });
        expect(Object.keys(result)).toHaveLength(0);

        const invalidResult = validateCustomerDetails({
            ...mockOwner,
            name: 'John@Doe#Smith' // Invalid special characters
        });
        expect(invalidResult.name).toBeDefined();
    });

    test('validates name length constraints', () => {
        const result = validateCustomerDetails({
            ...mockOwner,
            name: 'A'.repeat(26) // Exceeds max length
        });
        expect(result.name).toContain('25 characters');
    });

    test('validates full name requirement', () => {
        const result = validateCustomerDetails({
            ...mockOwner,
            name: 'John' // Missing last name
        });
        expect(result.name).toContain('full name');
    });

    test('validates phone number format', () => {
        const testCases = [
            { number: '091234567890', expected: true }, // Too long
            { number: '08123456789', expected: true },  // Wrong prefix
            { number: '09123456abc', expected: true },  // Non-numeric
            { number: '09123456789', expected: false }  // Valid
        ];

        testCases.forEach(({ number, expected }) => {
            const result = validateCustomerDetails({
                ...mockOwner,
                contact_number: number
            });
            expect(!!result.contact_number).toBe(expected);
        });
    });

    test('validates address minimum length', () => {
        const result = validateCustomerDetails({
            ...mockOwner,
            address: '123 St' // Too short
        });
        expect(result.address).toContain('complete address');
    });

    test('validates email with different domains', () => {
        const validEmails = [
            'test@example.com',
            'test.name@subdomain.example.co.uk',
            'test+label@example.com'
        ];

        validEmails.forEach(email => {
            const result = validateCustomerDetails({
                ...mockOwner,
                email
            });
            expect(result.email).toBeUndefined();
        });
    });

    test('trims whitespace from inputs', () => {
        const result = validateCustomerDetails({
            ...mockOwner,
            name: '  John Doe  ',
            email: ' test@example.com ',
            address: '  123 Test St  '
        });
        expect(Object.keys(result)).toHaveLength(0);
    });
});
