// components/admin/BookingDetails.tsx
import React from 'react';
import Link from 'next/link';

interface BookingDetailsProps {
  bookingId: string; // We'll receive this, but won't fetch data yet
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ bookingId }) => {
  // Static placeholder data
  const detailedBooking = {
    booking_uid: bookingId,
    owner: { uid: 'owner-1', name: 'John Doe', contact_number: '123-456-7890', email: 'john.doe@example.com', address: '123 Main St' },
    pet: { pet_uid: 'pet-1', name: 'Buddy', breed: 'Golden Retriever', special_notes: 'Needs extra attention during feeding' },
    service: { grooming_id: 'groom-1', service_type: 'Full Grooming', details: 'Includes bath, haircut, and nail trim' },
    date_booked: '2025-05-22T10:00:00.000Z',
    time_slot: '10:00 AM',
    status: 'confirmed',
  };

  if (!detailedBooking) {
    return <div>No booking details to display.</div>;
  }

  return (
    <div className="border p-4 rounded-md shadow-md bg-gradient-to-br from-blue-50 to-indigo-100">
      <h2 className="text-xl font-semibold mb-4">Booking ID: {detailedBooking.booking_uid}</h2>

      <div className="mb-2">
        <h3 className="font-semibold">Owner Information</h3>
        {detailedBooking.owner ? (
          <>
            <p>
              Name: <Link href={`/admin/owners/${detailedBooking.owner.uid}`} className="text-blue-500 hover:underline">
                {detailedBooking.owner.name}
              </Link>
            </p>
            {detailedBooking.owner.contact_number && <p>Contact: {detailedBooking.owner.contact_number}</p>}
            {detailedBooking.owner.email && <p>Email: {detailedBooking.owner.email}</p>}
            {detailedBooking.owner.address && <p>Address: {detailedBooking.owner.address}</p>}
          </>
        ) : (
          <p>Owner details not available.</p>
        )}
      </div>

      <div className="mb-2">
        <h3 className="font-semibold">Pet Information</h3>
        {detailedBooking.pet ? (
          <>
            <p>Name: {detailedBooking.pet.name}</p>
            {detailedBooking.pet.breed && <p>Breed: {detailedBooking.pet.breed}</p>}
            {detailedBooking.pet.special_notes && <p>Special Notes: {detailedBooking.pet.special_notes}</p>}
          </>
        ) : (
          <p>Pet details not available.</p>
        )}
      </div>

      <div className="mb-2">
        <h3 className="font-semibold">Service Information</h3>
        {detailedBooking.service ? (
          <>
            {detailedBooking.service.service_type && <p>Type: {detailedBooking.service.service_type}</p>}
            {detailedBooking.service.details && <p>Details: {detailedBooking.service.details}</p>}
          </>
        ) : (
          <p>Service details not available.</p>
        )}
      </div>

      <div className="mb-2">
        <h3 className="font-semibold">Booking Timing</h3>
        {detailedBooking.date_booked && <p>Date: {new Date(detailedBooking.date_booked).toLocaleDateString()}</p>}
        {detailedBooking.time_slot && <p>Time Slot: {detailedBooking.time_slot}</p>}
      </div>

      <div>
        <h3 className="font-semibold">Booking Status</h3>
        {detailedBooking.status && <p>Status: {detailedBooking.status}</p>}
      </div>
    </div>
  );
};

export default BookingDetails;