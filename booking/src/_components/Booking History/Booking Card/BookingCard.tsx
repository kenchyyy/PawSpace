import React from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Booking, BoardingPet } from '../types';
import { formatDate, getServiceDisplay, getServiceDate, getServiceTime } from '../utils';
import StatusBadge from './StatusBadge';

interface BookingCardProps {
  booking: Booking;
  isExpanded: boolean;
  isAnyExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isExpanded,
  isAnyExpanded,
  onToggle,
  onEdit,
  onCancel
}) => {
  const serviceDate = getServiceDate(booking);
  const serviceTime = getServiceTime(booking);
  const isBoarding = booking.pet.service_type === 'boarding';

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 mb-4 ${
        isExpanded ? 'max-h-[800px]' : isAnyExpanded ? 'max-h-28 opacity-70' : 'max-h-28'
      }`}
    >
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4 min-w-0">
          <StatusBadge status={booking.status} />
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-900 truncate">
                {booking.pet.name}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isBoarding ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {getServiceDisplay(booking.pet)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
              <div className="flex items-center">
                <span>{formatDate(serviceDate)}</span>
              </div>
              <div className="flex items-center">
                <span>{serviceTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {isExpanded ? (
            <FiChevronUp className="text-gray-500" />
          ) : (
            <FiChevronDown className="text-gray-500" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Service Details</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="font-medium text-gray-800">
                  {getServiceDisplay(booking.pet)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-800">
                  {formatDate(serviceDate)} at {serviceTime}
                </p>
              </div>
              {isBoarding && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium text-gray-800">
                    {formatDate((booking.pet as BoardingPet)?.check_out_date || '')} at {(booking.pet as BoardingPet)?.check_out_time}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Pet Details</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{booking.pet.name}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Breed</p>
                <p className="font-medium text-gray-800">{booking.pet.breed}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Special Requests</p>
                <p className="font-medium text-gray-800">
                  {booking.pet.special_requests || 'None'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gray-100 p-3 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Payment Details</h4>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Base Amount</span>
              <span>₱{booking.total_amount.toFixed(2)}</span>
            </div>
            {booking.discount_applied && booking.discount_applied > 0 && (
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Discount Applied</span>
                <span className="text-green-600">
                  -₱{(booking.total_amount * booking.discount_applied).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-medium text-gray-900 mt-2 pt-2 border-t border-gray-200">
              <span>Total Amount</span>
              <span>
                ₱{(booking.total_amount - (booking.total_amount * (booking.discount_applied || 0))).toFixed(2)}
              </span>
            </div>
          </div>

          {booking.status === 'pending' && (
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Reschedule
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;