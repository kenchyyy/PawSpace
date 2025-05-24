// hooks/useBookingDataCalculations.ts
import { format } from 'date-fns';
import { BookingRecord } from '../types/bookingRecordType';

// Helper functions (can be in utils/date.ts)
const toDate = (dateValue: Date | string | undefined | null): Date | null => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    const parsedDate = new Date(dateValue);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const daysBetween = (d1: Date, d2: Date) => {
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
};

export const useBookingDataCalculations = (booking: BookingRecord) => {
    const now = new Date();

    const rawBookedDate = toDate(booking.date_booked);
    const rawServiceStart = toDate(booking.service_date_start);
    const rawServiceEnd = toDate(booking.service_date_end);

    const publishDate = rawBookedDate ? format(rawBookedDate, 'MMMM dd, yyyy') : 'N/A';

    const boardingPeriod = (() => {
        const checkInDate = rawServiceStart;
        const checkOutDate = rawServiceEnd;
        const checkInTime = booking.pets?.[0]?.boarding_pet?.check_in_time;
        const checkOutTime = booking.pets?.[0]?.boarding_pet?.check_out_time;

        if (checkInDate && checkOutDate) {
            let formattedCheckInTime = '';
            if (checkInTime) {
                try {
                    formattedCheckInTime = format(new Date(`2000-01-01T${checkInTime}`), 'h:mm a');
                } catch {
                    formattedCheckInTime = checkInTime; // Fallback
                }
            }

            let formattedCheckOutTime = '';
            if (checkOutTime) {
                try {
                    formattedCheckOutTime = format(new Date(`2000-01-01T${checkOutTime}`), 'h:mm a');
                } catch {
                    formattedCheckOutTime = checkOutTime; // Fallback
                }
            }

            const formattedCheckInDate = format(checkInDate, 'MMM dd, yyyy');
            const formattedCheckOutDate = format(checkOutDate, 'MMM dd, yyyy');

            return `${formattedCheckInDate} ${formattedCheckInTime} - ${formattedCheckOutDate} ${formattedCheckOutTime}`;
        }
        return null;
    })();

    const formattedGroomServiceDateTime = (() => {
        const serviceDate = rawServiceStart; // Assuming groom service date is same as start date
        const serviceTime = booking.pets?.[0]?.groom_service?.service_time;

        if (serviceDate && serviceTime) {
            try {
                const formattedDate = format(serviceDate, 'MMM dd, yyyy');
                const formattedTime = format(new Date(`2000-01-01T${serviceTime}`), 'h:mm a');
                return `${formattedDate} - ${formattedTime}`;
            } catch {
                return `${format(serviceDate, 'MMM dd, yyyy')} - ${serviceTime}`;
            }
        }
        return null;
    })();

    const isPending = booking.status === 'pending';
    const isPastBooking = rawServiceStart ? daysBetween(rawServiceStart, now) < 0 : false;
    const isCheckInLessThan3Days = rawServiceStart ? daysBetween(rawServiceStart, now) < 3 : false;
    const disableCancel = isPending && (isPastBooking || isCheckInLessThan3Days);

    const isBeforeOrDuringStay = rawServiceEnd ? now <= rawServiceEnd : false;
    const isAfterStay = rawServiceEnd ? now > rawServiceEnd : false;

    const statusDotColor =
        booking.status === 'pending' ? 'bg-amber-500' :
        booking.status === 'confirmed' ? 'bg-green-500' :
        booking.status === 'completed' ? 'bg-blue-500' :
        booking.status === 'cancelled' ? 'bg-red-500' :
        booking.status === 'ongoing' ? 'bg-orange-400' :
        'bg-gray-400';

    let serviceType = '';
    if (booking.pets && booking.pets.length > 0) {
        const hasGroom = booking.pets.some(pet => pet.groom_service);
        const boardingPets = booking.pets.filter(pet => pet.boarding_pet);
        const hasBoard = boardingPets.length > 0;

        let boardingTypeLabel = '';
        if (hasBoard) {
            const boardingType = boardingPets[0].boarding_pet?.boarding_type?.toLowerCase() || '';
            if (boardingType === 'overnight') {
                boardingTypeLabel = 'Overnight Boarding';
            } else if (boardingType === 'day') {
                boardingTypeLabel = 'Day Boarding';
            } else {
                boardingTypeLabel = 'Boarding';
            }
        }

        if (hasGroom && hasBoard) {
            serviceType = `Grooming & ${boardingTypeLabel}`;
        } else if (hasGroom) {
            serviceType = 'Grooming';
        } else if (hasBoard) {
            serviceType = boardingTypeLabel;
        } else {
            serviceType = 'Other';
        }
    }

    const interactionIndicatorClass = (isBeforeOrDuring: boolean, isAfter: boolean) => {
        if (isBeforeOrDuring) {
            return 'border-l-4 border-green-500';
        } else if (isAfter) {
            return 'border-l-4 border-gray-500';
        }
        return '';
    };

    return {
        publishDate,
        boardingPeriod,
        isPending,
        isPastBooking,
        isCheckInLessThan3Days,
        disableCancel,
        isBeforeOrDuringStay,
        isAfterStay,
        statusDotColor,
        serviceType,
        formattedGroomServiceDateTime,
        interactionIndicatorClass,
    };
};