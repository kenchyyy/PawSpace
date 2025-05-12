'use client';

import React from 'react';
import BookingCard from './BookingCard';
import { BookingHistoryClientProps } from './types/bookingRecordsInterface';

const BookingHistoryClient: React.FC<BookingHistoryClientProps> = ({ bookings, loading, error }) => {

    if (loading) {
        return <div>Loading booking history...</div>;
    }

    if (error) {
        return <div>Error loading booking history: {error.message}</div>;
    }

    return (
        <div className={`bg-blue-900 flex flex-col gap-5 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
            {bookings?.map((booking) => (
                <div key={booking.bookingId}>
                    <BookingCard booking={booking} />
                </div>
            ))}
        </div>
    );
};

export default BookingHistoryClient;