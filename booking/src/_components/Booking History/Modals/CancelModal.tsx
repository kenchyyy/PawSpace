import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Booking, BoardingPet, GroomingPet } from '../types';

interface CancelModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onCancel: (reason: string) => void;
}

const cancellationReasons = [
  'Change of plans',
  'Found another provider',
  'Pet is unwell',
  'Financial reasons',
  'Other'
];

const CancelModal: React.FC<CancelModalProps> = ({ isOpen, booking, onClose, onCancel }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !booking) return null;

  const getServiceDate = () => {
    if (booking.pet.service_type === 'boarding') {
      return booking.service_date_start;
    } else {
      return (booking.pet as GroomingPet).service_date;
    }
  };

  const serviceDate = getServiceDate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'Other' ? customReason : reason;
    onCancel(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium text-gray-900">Cancel Booking</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to cancel the booking for {booking.pet.name} on {serviceDate ? new Date(serviceDate).toLocaleDateString() : 'unknown date'}?
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for cancellation
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  {cancellationReasons.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              {reason === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Please specify
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;