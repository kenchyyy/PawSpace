import { ReactNode } from 'react';

export type PetType = 'dog' | 'cat';
export type RoomSize = 'small' | 'medium' | 'large' | 'cat_small' | 'cat_big';
export type BoardingType = 'day' | 'overnight';
export type ServiceType = 'grooming' | 'boarding';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PetSize = 'teacup' | 'small' | 'medium' | 'large' | 'xlarge';
export type VaccinationStatus = 'yes' | 'no' | 'unknown';

export type DogGroomingVariant = 'basic' | 'deluxe';
export type CatGroomingVariant = 'standard';
export type GroomingVariant = DogGroomingVariant | CatGroomingVariant;

export interface OwnerDetails {
  id?: string;
  name: string;
  email: string;
  address: string;
  contact_number: string;
  created_at?: string;
}

interface BasePet {
  id?: string;
  pet_uuid?: string;
  boarding_id_extention?: string;
  grooming_id?: string;
  name: string;
  age: string;
  pet_type: PetType;
  breed: string;
  vaccinated: VaccinationStatus;
  size: string;
  vitamins_or_medications: string;
  allergies: string;
  special_requests: string;
  completed: boolean;
  Owner_ID?: string;
  booking_uuid?: string;
  created_at?: string;
  service_type: ServiceType;
}

export type MealInstruction = { 
  time: string;
  food: string;
  notes: string;
};

export interface BoardingPet extends BasePet {
  service_type: 'boarding';
  room_size: RoomSize;
  boarding_type: BoardingType;
  check_in_date: Date | string | null;
  check_in_time: string;
  check_out_date: Date | string | null;
  check_out_time: string;
  meal_instructions: {
    breakfast: MealInstruction;
    lunch: MealInstruction;
    dinner: MealInstruction;
  };
  special_feeding_request: string;
}

export interface GroomingPet extends BasePet {
  service_type: 'grooming';
  service_variant: GroomingVariant;
  service_date: Date | string | null;
  service_time: string;
}

export type Pet = BoardingPet | GroomingPet;

export interface Booking {
  id?: string;
  booking_uuid: string;
  date_booked: Date | string;
  service_date_start: Date | string | null;
  service_date_end: Date | string | null;
  status: BookingStatus;
  owner_details: OwnerDetails;
  pet: Pet;
  special_requests: string;
  total_amount: number;
  discount_applied?: number;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Pricing {
    boarding: {
        day: { [key: string]: number }; 
        overnight: { [key: string]: number }; 
    };
    grooming: {
        cat: { standard: number };
        dog: {
            basic: { [key: string]: number }; 
            deluxe: { [key: string]: number }; 
        };
    };
}

export const pricing: Pricing = {
    boarding: {
        day: {
            small: 65,
            medium: 75,
            large: 110,
            cat_small: 65,
            cat_big: 65,
        },
        overnight: {
            small: 450,
            medium: 600,
            large: 800,
            cat_small: 450,
            cat_big: 600,
        },
    },
    grooming: {
        cat: {
            standard: 450,
        },
        dog: {
            basic: {
                teacup: 250,
                small: 300,
                medium: 400,
                large: 500,
                xlarge: 600,
            },
            deluxe: {
                teacup: 350,
                small: 400,
                medium: 500,
                large: 600,
                xlarge: 750,
            },
        },
    },
};


export function parseDate(date: Date | string | null): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) return parsed;
  
  const parts = date.split(/[-/]/);
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  
  console.error('Invalid date format:', date);
  return null;
}


export function calculateNights(checkInDate: Date | string | null, checkOutDate: Date | string | null): number {
  const parsedCheckIn = parseDate(checkInDate);
  const parsedCheckOut = parseDate(checkOutDate);
  
  if (!parsedCheckIn || !parsedCheckOut) return 0;
  
  const diffTime = Math.abs(parsedCheckOut.getTime() - parsedCheckIn.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isSameDay(date1: Date | string | null, date2: Date | string | null): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return false;
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export interface BookingResult {
    success: boolean;
    bookingId?: string;
    error?: string;
}

export interface BaseBookingFormProps {
  onConfirmBooking: (bookings: Booking[]) => Promise<BookingResult>
  onClose: () => void
  serviceType: ServiceType
  isSubmitting?: boolean
  children?: (
    pet: Pet,
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    onScheduleChange: (type: 'checkIn' | 'checkOut' | 'service', date: Date | null, time: string) => void,
    errors: Record<string, string>
  ) => ReactNode
  unavailableDates?: Date[]
  unavailableTimes?: string[]
}