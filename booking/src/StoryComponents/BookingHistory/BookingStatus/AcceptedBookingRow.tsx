import React from 'react';
import { AcceptedBookingRowProps } from '../types/bookingRowsTypes';
import { format } from 'date-fns';

const AcceptedBookingRow: React.FC<AcceptedBookingRowProps> = ({ booking, onCheckIn, onTransfer }) => {
    const formattedCheckIn = booking.checkInDate instanceof Date ? format(booking.checkInDate, 'yyyy-MM-dd') : booking.checkInDate;
    const formattedCheckOut = booking.checkOutDate instanceof Date ? format(booking.checkOutDate, 'yyyy-MM-dd') : booking.checkOutDate;
    const formattedBookedDate = booking.dateBooked instanceof Date ? format(booking.dateBooked, 'yyyy-MM-dd') : booking.dateBooked;

    return (
        <tr>
        <td>{booking.bookingId}</td>
        <td>{booking.serviceType}</td>
        <td>{booking.petName}</td>
        <td>{formattedCheckIn}</td>
        <td>{formattedCheckOut}</td>
        <td>{booking.status}</td>
        <td>₱{typeof booking.totalPrice === 'number' ? booking.totalPrice.toFixed(2) : booking.totalPrice}</td>
        <td>{booking.discountApplied ? 'Yes' : 'No'}</td>
        <td>{formattedBookedDate}</td>
        <td>
            {onCheckIn && <button onClick={() => onCheckIn(booking.bookingId)}>Check-in</button>}
            {onTransfer && <button onClick={() => onTransfer(booking.bookingId)}>Transfer</button>}
        </td>
        </tr>
    );
};

export default AcceptedBookingRow;