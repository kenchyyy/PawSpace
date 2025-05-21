import React, { useState } from 'react';
import { FiX, FiCalendar, FiClock } from 'react-icons/fi';
import { Booking, BoardingPet, GroomingPet } from '../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface RescheduleModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onReschedule: (date: Date, time: string) => void;
}

const availableTimes = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM'
];

const RescheduleModal: React.FC<RescheduleModalProps> = ({ 
  isOpen, 
  booking, 
  onClose, 
  onReschedule 
}) => {
  const getInitialDate = (): Date | null => {
    if (!booking) return null;
    
    try {
      if (booking.pet.service_type === 'boarding') {
        return booking.service_date_start ? new Date(booking.service_date_start) : null;
      } else {
        const serviceDate = (booking.pet as GroomingPet).service_date;
        return serviceDate ? new Date(serviceDate) : null;
      }
    } catch (e) {
      console.error('Error parsing date:', e);
      return null;
    }
  };

  const getInitialTime = (): string => {
    if (!booking) return '';
    if (booking.pet.service_type === 'boarding') {
      return (booking.pet as BoardingPet).check_in_time || '';
    } else {
      return (booking.pet as GroomingPet).service_time || '';
    }
  };

  const [date, setDate] = useState<Date | null>(getInitialDate());
  const [time, setTime] = useState(getInitialTime());

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      onReschedule(date, time);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDate(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium text-gray-900">Reschedule Booking</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FiCalendar className="mr-2" /> New Date
                </label>
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FiClock className="mr-2" /> New Time
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((timeSlot) => (
                    <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!date || !time}
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;