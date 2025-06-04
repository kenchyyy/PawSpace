import { parseDate, calculateNights, isSameDay } from '../../../../src/_components/Booking Form/types';

describe('Date Utilities', () => {
    test('parseDate handles invalid formats', () => {
        expect(parseDate('invalid-date')).toBeNull();
    });

    test('calculateNights handles edge cases', () => {
        expect(calculateNights(null, null)).toBe(0);
    });
});
