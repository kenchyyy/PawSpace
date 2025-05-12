'use client';
import React from 'react';
import { BookingCardProps } from './types/bookingRecordsInterface';

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const publishDate = booking.dateBooked instanceof Date ? booking.dateBooked.toLocaleDateString() : booking.dateBooked;
    const checkInDate = booking.checkInDate instanceof Date ? booking.checkInDate.toLocaleDateString() : booking.checkInDate;
    const checkOutDate = booking.checkOutDate instanceof Date ? booking.checkOutDate.toLocaleDateString() : booking.checkOutDate;

    const accent = 'text-cyan-400';
    const textPrimary = 'text-white';
    const textSecondary = 'text-gray-300';

    const statusColor = () => {
        switch (booking.status) {
            case 'pending':
                return 'text-yellow-400';
            case 'accepted':
                return 'text-green-400'; 
            case 'completed':
                return 'text-blue-300';
            case 'cancelled':
                return 'text-red-400';
            case 'transferred':
                return 'text-purple-400';
            default:
                return textSecondary;
        }
    };

    return (
        <div className={`bg-indigo-800 rounded-lg p-6 shadow-lg`}>
            <h3 className={`${accent} text-xl font-semibold mb-2`}>Booking ID: {booking.bookingId}</h3>
            <p className={`${textSecondary} text-sm mb-1`}>Booked On: <span className={textPrimary}>{publishDate}</span></p>
            <p className={`${textSecondary} text-sm mb-1`}>Check-in: <span className={textPrimary}>{checkInDate}</span></p>
            <p className={`${textSecondary} text-sm mb-1`}>Check-out: <span className={textPrimary}>{checkOutDate}</span></p>
            <p className={`${textSecondary} text-sm mb-2`}>Status: <span className={`${statusColor()} font-medium`}>{booking.status}</span></p>
            <p className={`${textSecondary} text-sm mb-1`}>Special Requests: <span className={textPrimary}>{booking.notes || 'No special requests'}</span></p>
            <p className={`${textSecondary} text-sm mb-1`}>Total Amount: <span className={`${accent} font-medium`}>{typeof booking.totalPrice === 'number' ? `₱${booking.totalPrice.toFixed(2)}` : booking.totalPrice}</span></p>
            <p className={`${textSecondary} text-sm mb-1`}>Discount Applied: <span className={textPrimary}>{booking.discountApplied ? 'Yes' : 'No'}</span></p>
            <p className={`${textSecondary} text-sm`}>Owner Details: <span className={textPrimary}>{booking.ownerDetails || 'No owner details'}</span></p>
        </div>
    );
};

export default BookingCard;