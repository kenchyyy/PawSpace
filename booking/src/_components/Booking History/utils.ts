import React from 'react';
import { FiCheck, FiClock, FiX, FiInfo } from 'react-icons/fi';
import { StatusDisplay } from './types';
import { Pet } from '../Booking Form/types';


export const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
export const cancellationReasons = [
  "Schedule Conflict",
  "Pet Health Issue",
  "Found Another Provider",
  "Other"
];

export const getStatusDisplay = (status: string): StatusDisplay => {
  const icons = {
    approved: React.createElement(FiCheck, { className: "inline" }),
    pending: React.createElement(FiClock, { className: "inline" }),
    canceled: React.createElement(FiX, { className: "inline" }),
    completed: React.createElement(FiCheck, { className: "inline" }),
    default: React.createElement(FiInfo, { className: "inline" })
  };

  switch (status) {
    case 'approved': 
      return { text: 'Approved', color: 'bg-green-500', icon: icons.approved };
    case 'pending': 
      return { text: 'Pending', color: 'bg-yellow-500', icon: icons.pending };
    case 'canceled': 
      return { text: 'Canceled', color: 'bg-red-500', icon: icons.canceled };
    case 'completed': 
      return { text: 'Completed', color: 'bg-blue-500', icon: icons.completed };
    default: 
      return { text: 'Unknown', color: 'bg-gray-500', icon: icons.default };
  }
};

export const getServiceDisplay = (pet: Pet): string => {
  return pet.serviceType === 'grooming' 
    ? `Grooming (${pet.serviceVariant})` 
    : `Overnight (${pet.serviceVariant})`;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? dateString 
      : date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
  } catch {
    return dateString;
  }
};

export const parseDateString = (dateString: string): Date => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse date: ${error.message}`);
      }
      throw new Error('Failed to parse date: Unknown error');
    }
  };