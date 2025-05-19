import { Booking, BoardingPet, GroomingPet, BookingStatus } from './types';

export const formatDate = (date: Date | string | null): string => {
  if (!date) return 'Not specified';
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
};

export const getServiceDisplay = (pet: BoardingPet | GroomingPet): string => {
  if (pet.service_type === 'boarding') {
    return `${(pet as BoardingPet).boarding_type} Boarding`;
  }
  return 'Grooming Service';
};

type StatusDisplay = {
  text: string;
  color: string;
  icon?: React.ReactNode;
};

const statusMap: Record<BookingStatus, StatusDisplay> = {
  pending: { 
    text: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800' 
  },
  confirmed: { 
    text: 'Confirmed', 
    color: 'bg-blue-100 text-blue-800' 
  },
  completed: { 
    text: 'Completed', 
    color: 'bg-green-100 text-green-800' 
  },
  cancelled: { 
    text: 'Cancelled', 
    color: 'bg-red-100 text-red-800' 
  }
};

export const getStatusDisplay = (status: BookingStatus): StatusDisplay => {
  return statusMap[status];
};

export const getServiceDate = (booking: Booking): Date | string | null => {
  return booking.pet.service_type === 'boarding' 
    ? booking.service_date_start 
    : (booking.pet as GroomingPet).service_date;
};

export const getServiceTime = (booking: Booking): string => {
  return booking.pet.service_type === 'boarding'
    ? (booking.pet as BoardingPet).check_in_time
    : (booking.pet as GroomingPet).service_time;
};