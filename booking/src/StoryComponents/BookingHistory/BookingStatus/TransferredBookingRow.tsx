import React from 'react';
import { TransferedBookingRowProps } from '../types/bookingRowsTypes';
import { format } from 'date-fns';

const TransferedBookingRow: React.FC<TransferedBookingRowProps> = ({ booking, onViewTransferDetails }) => {
    const formattedCheckIn = booking.checkInDate instanceof Date ? format(booking.checkInDate, 'yyyy-MM-dd') : booking.checkInDate;
    const formattedCheckOut = booking.checkOutDate instanceof Date ? format(booking.checkOutDate, 'yyyy-MM-dd') : booking.checkOutDate;
    const formattedBookedDate = booking.dateBooked instanceof Date ? format(booking.dateBooked, 'yyyy-MM-dd') : booking.dateBooked;
    const formattedTransferDate = booking.transferDetails?.transferDate instanceof Date ? format(booking.transferDetails.transferDate, 'yyyy-MM-dd') : booking.transferDetails?.transferDate;

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
                  {booking.transferDetails?.newLocation && <p>Transferred to: {booking.transferDetails.newLocation}</p>}
                  {formattedTransferDate && <p>On: {formattedTransferDate}</p>}
                  {booking.transferDetails?.reason && <p>Reason: {booking.transferDetails.reason}</p>}
                  {onViewTransferDetails && (
                      <button onClick={() => onViewTransferDetails(booking.bookingId)}>View Details</button>
                  )}
            </td>
        </tr>
    );
};

export default TransferedBookingRow;