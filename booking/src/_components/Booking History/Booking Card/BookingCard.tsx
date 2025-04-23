import React from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Booking } from '../../Booking History/types'; 
import { formatDate, getServiceDisplay } from '../../Booking History/utils';
import StatusBadge from './StatusBadge';
import BookingDetails from './BookingDetails';

interface BookingCardProps {
  booking: Booking;
  isExpanded: boolean;
  onToggle: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, isExpanded, onToggle }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-[600px]' : 'max-h-20'
      }`}
    >
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <StatusBadge status={booking.status} />
          <div>
            <p className="font-medium text-gray-900">
              {formatDate(booking.serviceDate)} - {booking.pet.name} ({getServiceDisplay(booking.pet)})
            </p>
            <p className="text-sm text-gray-500">
              Booked on {formatDate(booking.dateBooked)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isExpanded ? (
            <FiChevronUp className="text-gray-500" />
          ) : (
            <FiChevronDown className="text-gray-500" />
          )}
        </div>
      </div>
      
      {isExpanded && <BookingDetails booking={booking} />}
    </div>
  );
};

export default BookingCard;