// components/BookingSummary.tsx
import React from 'react';

interface BookingSummaryProps {
    discountApplied: number | null | undefined;
    totalAmount: number | string | null | undefined;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ discountApplied, totalAmount }) => {
    const accent = 'text-white';
    const textPrimary = 'text-white';
    const textSecondary = 'text-yellow-300';

    return (
        <div className="mt-4 p-3 rounded-md bg-purple-800 flex justify-between items-center">
            <div>
                {typeof discountApplied === 'number' && discountApplied > 0 ? (
                    <p className={`${textSecondary} text-sm`}>
                        Discount Applied: <span className={textPrimary}>{discountApplied}%</span>
                    </p>
                ) : (
                    <p className={`${textSecondary} text-sm`}>
                        Discount Applied: <span className={textPrimary}>None</span>
                    </p>
                )}
            </div>
            <div>
                <p className={`${textSecondary} text-lg`}>
                    Total Amount: <span className={`${accent} font-bold text-xl`}>
                        {typeof totalAmount === 'number' ? `₱${totalAmount.toFixed(2)}` : totalAmount}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default BookingSummary;