export type PetType = 'dog' | 'cat';
export type DogSize = 'teacup' | 'small' | 'medium' | 'large' | 'xlarge';
export type CatSize = 'small' | 'medium' | 'large';
export type PetSize = DogSize | CatSize;
export type ServiceType = 'grooming' | 'overnight';
export type ServiceVariant = 'basic' | 'deluxe' | 'small' | 'medium' | 'large' | 'cat';

export interface Pricing {
  grooming: {
    dog: {
      basic: Record<DogSize, number>;
      deluxe: Record<DogSize, number>;
    };
    cat: {
      cat: number;
    };
  };
  overnight: {
    dog: {
      small: number;
      medium: number;
      large: number;
    };
  };
}

export const pricing: Pricing = {
  grooming: {
    dog: {
      basic: {
        teacup: 500,
        small: 600,
        medium: 700,
        large: 800,
        xlarge: 900
      },
      deluxe: {
        teacup: 700,
        small: 800,
        medium: 900,
        large: 1000,
        xlarge: 1100
      }
    },
    cat: {
      cat: 600
    }
  },
  overnight: {
    dog: {
      small: 800,
      medium: 1000,
      large: 1200
    }
  }
};

export interface OwnerDetails {
  name: string;
  address: string;
  contactNumber: string;
}

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
  serviceVariant: ServiceVariant;
  serviceDate: Date | null;
  serviceTime: string;
  completed: boolean;
}

export interface Booking {
  id: string;
  dateBooked: Date;
  serviceDate: Date;
  serviceTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  ownerDetails: OwnerDetails;
  pet: Pet;
  specialRequests: string;
  totalAmount: number;
}