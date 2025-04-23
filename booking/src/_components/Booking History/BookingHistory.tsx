'use client';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX, FiCalendar, FiInfo, FiCheck, FiClock } from 'react-icons/fi';
import CalendarComponent from '../Booking Form/Calendar';
import { Booking, Pet } from '../Booking Form/types';

interface BookingHistoryProps {
  bookings: Booking[];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ bookings }) => {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [transferDate, setTransferDate] = useState<Date | null>(null);
  const [transferTime, setTransferTime] = useState('');
  const [customReason, setCustomReason] = useState('');

  const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
  const cancellationReasons = [
    "Schedule Conflict",
    "Pet Health Issue",
    "Found Another Provider",
    "Other"
  ];

  const toggleExpand = (id: string) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleTransferClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setTransferDate(new Date(booking.serviceDate));
    setTransferTime(booking.serviceTime);
    setShowTransferModal(true);
  };

  const getServiceDisplay = (pet: Pet) => {
    if (pet.serviceType === 'grooming') {
      return `Grooming (${pet.serviceVariant})`;
    } else {
      return `Overnight (${pet.serviceVariant})`;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'approved': return { text: 'Approved', color: 'bg-green-500', icon: <FiCheck /> };
      case 'pending': return { text: 'Pending', color: 'bg-yellow-500', icon: <FiClock /> };
      case 'canceled': return { text: 'Canceled', color: 'bg-red-500', icon: <FiX /> };
      case 'completed': return { text: 'Completed', color: 'bg-blue-500', icon: <FiCheck /> };
      default: return { text: 'Unknown', color: 'bg-gray-500', icon: <FiInfo /> };
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Booking History</h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You don't have any bookings yet.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div 
            key={booking.id} 
            className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-300 ${
              expandedBooking === booking.id ? 'max-h-[600px]' : 'max-h-20'
            }`}
          >
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(booking.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${getStatusDisplay(booking.status).color}`}></div>
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(booking.serviceDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })} - {booking.pet.name} ({getServiceDisplay(booking.pet)})
                  </p>
                  <p className="text-sm text-gray-500">
                    Booked on {new Date(booking.dateBooked).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {getStatusDisplay(booking.status).text}
                </span>
                {expandedBooking === booking.id ? (
                  <FiChevronUp className="text-gray-500" />
                ) : (
                  <FiChevronDown className="text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedBooking === booking.id && (
              <div className="p-4 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Service Time</p>
                    <p className="text-gray-900 font-medium">{booking.serviceTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-gray-900 font-medium">{getStatusDisplay(booking.status).text}</p>
                  </div>
                  
                  <div className="md:col-span-2 border-t pt-4 mt-2">
                    <h4 className="font-medium text-gray-900 mb-2">Owner Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-900">{booking.ownerDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="text-gray-900">{booking.ownerDetails.contactNumber}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-900">{booking.ownerDetails.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 border-t pt-4 mt-2">
                    <h4 className="font-medium text-gray-900 mb-2">Pet Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-900">{booking.pet.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="text-gray-900">{booking.pet.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Breed</p>
                        <p className="text-gray-900">{booking.pet.breed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="text-gray-900">{booking.pet.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Size</p>
                        <p className="text-gray-900">{booking.pet.size}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Vaccinated</p>
                        <p className="text-gray-900">{booking.pet.vaccinated}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service Type</p>
                        <p className="text-gray-900">{booking.pet.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service Variant</p>
                        <p className="text-gray-900">{booking.pet.serviceVariant}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Vitamins/Medications</p>
                        <p className="text-gray-900">{booking.pet.vitaminsOrMedications || 'None'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Allergies</p>
                        <p className="text-gray-900">{booking.pet.allergies || 'None'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Meal Schedule</p>
                        <p className="text-gray-900">{booking.pet.mealTime || 'None'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Special Requests</p>
                        <p className="text-gray-900">{booking.pet.specialRequests || 'None'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BookingHistory;