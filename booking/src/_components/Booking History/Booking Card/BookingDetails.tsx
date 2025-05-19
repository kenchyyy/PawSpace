// components/BookingHistory/BookingDetails.tsx
import React from 'react';
import OwnerInfo from './OwnerInfo';
import PetDetails from './PetDetails';
import { Booking } from '../types'; 
import { getStatusDisplay, getServiceTime } from '../utils';
import PriceDetails from './PriceDetails';

interface BookingDetailsProps {
  booking: Booking;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => {
  const serviceTime = getServiceTime(booking);

  return (
    <div className="p-4 border-t border-gray-200 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Service Time</p>
          <p className="text-gray-900 font-medium">{serviceTime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-gray-900 font-medium">{getStatusDisplay(booking.status).text}</p>
        </div>
        <OwnerInfo ownerDetails={booking.owner_details} />
        <PetDetails pet={booking.pet} />
        <PriceDetails
          totalAmount={booking.total_amount}
          discountApplied={booking.discount_applied || 0}
          serviceType={booking.pet.service_type}
        />
      </div>
    </div>
  );
};

export default BookingDetails;