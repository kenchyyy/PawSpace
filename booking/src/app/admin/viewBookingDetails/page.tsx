// pages/admin/bookings/index.tsx
import React, { useState } from 'react';
import BookingDetails from './BookingDetails';
import BookingDetailsModal from './BookingDetailsModal'; // Import the renamed modal

interface BookingListItem {
  booking_uid: string;
}

const AdminBookingsPage: React.FC = () => {
  const [selectedBookingUid, setSelectedBookingUid] = useState<string | null>(null);
  const bookings: BookingListItem[] = [
    { booking_uid: '1' },
    { booking_uid: '2' },
    { booking_uid: '3' },
  ];

  const handleBookingClick = (bookingUid: string) => {
    setSelectedBookingUid(bookingUid);
  };

  const handleCloseModal = () => {
    setSelectedBookingUid(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pawspace Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li
            key={booking.booking_uid}
            onClick={() => handleBookingClick(booking.booking_uid)}
            className={`cursor-pointer hover:bg-gray-100 p-2 border-b ${selectedBookingUid === booking.booking_uid ? 'bg-gray-200' : ''}`}
          >
            Booking ID: {booking.booking_uid}
          </li>
        ))}
      </ul>

      <BookingDetailsModal
        isOpen={!!selectedBookingUid}
        onClose={handleCloseModal}
      >
        {selectedBookingUid && <BookingDetails bookingId={selectedBookingUid} />}
      </BookingDetailsModal>
    </div>
  );
};

export default AdminBookingsPage;