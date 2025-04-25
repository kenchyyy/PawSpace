import React, { useState } from 'react';
import { FiX, FiCalendar, FiClock } from 'react-icons/fi';
import CalendarComponent from '../../Booking Form/Calendar';
import { Booking } from '../types';
import { availableTimes, parseDateString } from '../utils';

interface TransferModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onTransfer: (date: Date, time: string) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ 
  isOpen, 
  booking, 
  onClose, 
  onTransfer 
}) => {
  const [date, setDate] = useState<Date | null>(
    booking ? parseDateString(booking.serviceDate) : null
  );
  const [time, setTime] = useState(booking?.serviceTime || '');

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      onTransfer(date, time);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
      
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium text-gray-900">Reschedule Booking</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
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
                <CalendarComponent 
                  selectedDate={date}
                  onDateChange={setDate}
                />
              </div>
              
              {/* Time selection */}
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
              
              {/* Action buttons */}
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

export default TransferModal;