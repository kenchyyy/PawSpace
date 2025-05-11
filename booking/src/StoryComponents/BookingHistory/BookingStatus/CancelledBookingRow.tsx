import React from 'react';
import { CancelledRowProps } from '../types/bookingRowsTypes';
import { format } from 'date-fns';

const CancelledRow: React.FC<CancelledRowProps> = ({ booking, onViewCancellationReason }) => {
    const formattedCheckIn = booking.checkInDate instanceof Date ? format(booking.checkInDate, 'yyyy-MM-dd') : booking.checkInDate;
    const formattedCheckOut = booking.checkOutDate instanceof Date ? format(booking.checkOutDate, 'yyyy-MM-dd') : booking.checkOutDate;
    const formattedBookedDate = booking.dateBooked instanceof Date ? format(booking.dateBooked, 'yyyy-MM-dd') : booking.dateBooked;

    return (
        <tr style={{ backgroundColor: '#ffe0e0' }}>
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
            {onViewCancellationReason && (
            <button onClick={() => onViewCancellationReason(booking.bookingId)}>View Reason</button>
            )}
            {booking.cancellationReason && <p style={{ fontStyle: 'italic', color: 'gray' }}>Reason: {booking.cancellationReason}</p>}
            {booking.notes && !booking.cancellationReason && <p style={{ fontStyle: 'italic', color: 'gray' }}>Notes: {booking.notes}</p>}
        </td>
        </tr>
    );
};

export default CancelledRow;