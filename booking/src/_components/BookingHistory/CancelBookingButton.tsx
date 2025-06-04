// components/CancelBookingButton.tsx
import React from 'react';

interface CancelBookingButtonProps {
    isSubmitting: boolean;
    isDisabled: boolean;
    onClick: (event: React.MouseEvent) => void;
    pastBooking: boolean;
    checkInLessThan3Days: boolean;
}

const CancelBookingButton: React.FC<CancelBookingButtonProps> = ({
    isSubmitting,
    isDisabled,
    onClick,
    pastBooking,
    checkInLessThan3Days,
}) => {
    return (
        <div className="mt-4 flex flex-col items-end space-y-1">
            <button
                onClick={onClick}
                disabled={isSubmitting || isDisabled}
                className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                    ${isSubmitting || isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
            >
                {isSubmitting ? 'Cancelling...' : 'Cancel Booking'}
            </button>
            {isDisabled && (
                <p className="text-red-400 text-sm italic mt-1">
                    {pastBooking
                        ? 'This booking is already past.'
                        : (checkInLessThan3Days
                            ? 'Cannot cancel booking when it is less than 3 days before the booking starts.'
                            : 'Cancellation not allowed for other reasons.'
                          )
                    }
                </p>
            )}
        </div>
    );
};

export default CancelBookingButton;