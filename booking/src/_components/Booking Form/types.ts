export type ServiceType = 'grooming' | 'overnight';
export type PetType = 'dog' | 'cat';
export type DogSize = 'teacup' | 'small' | 'medium' | 'large' | 'xlarge';
export type PetSize = DogSize;
export type GroomingVariant = 'basic' | 'deluxe';
export type OvernightVariant = 'small' | 'medium' | 'large';
export type BookingStatus = 'pending' | 'approved' | 'canceled' | 'completed';

export interface Pet {
  id: number;
  name: string;
  age: string;
  type: PetType;
  breed: string;
  vaccinated: string;
  size: PetSize;
  vitaminsOrMedications: string;
  allergies: string;
  mealTime: string;
  specialRequests: string;
  serviceType: ServiceType;
  serviceVariant: string;
  serviceDate: Date | null;
  serviceTime: string;
  completed: boolean;
}

export interface OwnerDetails {
  name: string;
  address: string;
  contactNumber: string;
}

export interface Booking {
  id: string;
  dateBooked: Date;
  serviceDate: Date;
  serviceTime: string;
  status: BookingStatus;
  ownerDetails: OwnerDetails;
  pet: Pet;
  specialRequests: string;
  totalAmount: number;
}

export const pricing = {
  grooming: {
    dog: {
      basic: { teacup: 250, small: 300, medium: 400, large: 500, xlarge: 600 },
      deluxe: { teacup: 350, small: 400, medium: 500, large: 600, xlarge: 750 }
    },
    cat: {
      cat: 450
    }
  },
  overnight: {
    dog: {
      small: 450,
      medium: 600,
      large: 800,
      xlarge: 900
    },
    cat: {
      cat: 450
    }
  }
} as const;