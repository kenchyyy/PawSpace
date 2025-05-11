import React from 'react';
import { BookingRecord } from './types/bookingRecordType';
import PendingBookingRow from './BookingStatus/PendingBookingRow';
import CompletedBookingRow from './BookingStatus/CompletedBookingRow';
import CancelledBookingRow from './BookingStatus/CancelledBookingRow';
import AcceptedBookingRow from './BookingStatus/AcceptedBookingRow';
import TransferredBookingRow from './BookingStatus/TransferredBookingRow';

interface BookingHistoryTableProps {
    bookings: BookingRecord[] | null | undefined;
    loading: boolean;
    error: Error | null;
    onAcceptBooking?: (bookingId: string) => void;
    onCancelBooking?: (bookingId: string) => void;
    onCheckInBooking?: (bookingId: string) => void;
    onViewTransferDetails?: (bookingId: string) => void;
    onViewCancellationReason?: (bookingId: string) => void;
}

const BookingHistoryTable: React.FC<BookingHistoryTableProps> = ({
    bookings,
    loading,
    error,
    onAcceptBooking,
    onCancelBooking,
    onCheckInBooking,
    onViewTransferDetails,
    onViewCancellationReason,
    }) => {
    if (loading) {
        return <div>Loading booking history...</div>;
    }

    if (error) {
        return <div>Error loading booking history: {error.message}</div>;
    }

    if (!bookings || bookings.length === 0) {
        return <div>No booking history available.</div>;
    }

    return (
        <table>
            <thead>
                <tr>
                <th>Booking ID</th>
                <th>Service Type</th>
                <th>Pet Name</th>
                <th>Check-in Date</th>
                <th>Check-out Date</th>
                <th>Status</th>
                <th>Total Price</th>
                <th>Discount</th>
                <th>Booked On</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map((booking) => {
                switch (booking.status) {
                    case 'Pending':
                    return (
                        <PendingBookingRow
                        key={booking.bookingId}
                        booking={booking}
                        onAccept={onAcceptBooking || (() => {})}
                        onCancel={onCancelBooking || (() => {})}
                        />
                    );
                    case 'Accepted':
                    return (
                        <AcceptedBookingRow
                        key={booking.bookingId}
                        booking={booking}
                        onCheckIn={onCheckInBooking}
                        onTransfer={() => {
                            console.log(`Transfer initiated for booking ${booking.bookingId}`);
                        }}
                        />
                    );
                    case 'Completed':
                    return <CompletedBookingRow key={booking.bookingId} booking={booking} />;
                    case 'Cancelled':
                    return (
                        <CancelledBookingRow
                        key={booking.bookingId}
                        booking={booking}
                        onViewCancellationReason={onViewCancellationReason}
                        />
                    );
                    case 'Transferred':
                    return (
                        <TransferredBookingRow
                        key={booking.bookingId}
                        booking={booking}
                        onViewTransferDetails={onViewTransferDetails}
                        />
                    );
                    default:
                    return <tr key={booking.bookingId}><td>Unknown Status</td></tr>;
                }
                })}
            </tbody>
        </table>
    );
};

export default BookingHistoryTable;