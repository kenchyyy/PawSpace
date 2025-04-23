import { Pet, OwnerDetails } from '../Booking Form/types';

export interface Booking {
  id: string;
  serviceDate: string;  
  serviceTime: string;
  dateBooked: string;  
  status: 'approved' | 'pending' | 'canceled' | 'completed';
  pet: Pet;
  ownerDetails: OwnerDetails;
  specialRequests?: string;
  totalAmount?: number;
}

export interface StatusDisplay {
  text: string;
  color: string;
  icon: React.ReactNode;
}

export interface CalendarComponentProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}