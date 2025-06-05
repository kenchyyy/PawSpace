// types.ts
import { ReactNode } from 'react';

export type PetType = 'dog' | 'cat';
export type RoomSize = 'small' | 'medium' | 'large' | 'cat_small' | 'cat_large' | '';
export type BoardingType = 'day' | 'overnight';
export type ServiceType = 'grooming' | 'boarding';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PetSize = 'teacup' | 'small' | 'medium' | 'large' | 'xlarge';
export type VaccinationStatus = 'yes' | 'no' | 'unknown' | '';
export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type DogGroomingVariant = 'basic' | 'deluxe';
export type CatGroomingVariant = 'cat';
export type GroomingVariant = DogGroomingVariant | CatGroomingVariant;


export interface OwnerDetails {
    id?: string;
    name: string;
    email: string;
    address: string;
    contact_number: string;
    auth_id?: string;
    created_at?: string;
}

export type MealInstruction = {
    time: string;
    food: string;
    notes: string;
};

export type MealInstructions = {
    breakfast: MealInstruction;
    lunch: MealInstruction;
    dinner: MealInstruction;
};

export interface BasePet {
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

export interface BoardingPet extends BasePet {
    service_type: 'boarding';
    room_size: RoomSize;
    boarding_type: BoardingType;
    check_in_date: Date | null;
    check_in_time: string;
    check_out_date: Date | null;
    check_out_time: string;
    meal_instructions: MealInstructions;
    special_feeding_request: string;
}

export interface GroomingPet extends BasePet {
    service_type: 'grooming';
    service_variant: GroomingVariant;
    service_date: Date | null;
    service_time: string;
}

export type Pet = BoardingPet | GroomingPet;

export function isBoardingPet(pet: Pet): pet is BoardingPet {
    return pet.service_type === 'boarding';
}

export function isGroomingPet(pet: Pet): pet is GroomingPet {
    return pet.service_type === 'grooming';
}

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
        day: Record<RoomSize, number>;
        overnight: Record<RoomSize, number>;
    };
    grooming: {
        cat: { cat: number };
        dog: {
            basic: Record<PetSize, number>;
            deluxe: Record<PetSize, number>;
        };
    };
}

export const pricing: Pricing = {
    boarding: {
        day: {
            '': 0,
            small: 65,
            medium: 75,
            large: 110,
            cat_small: 65,
            cat_large: 65,
        },
        overnight: {
            '': 0,
            small: 450,
            medium: 600,
            large: 800,
            cat_small: 450,
            cat_large: 600,
        },
    },
    grooming: {
        cat: {
            cat: 450,
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
    if (date instanceof Date) {
        return isNaN(date.getTime()) ? null : date;
    }
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) return parsed;

    const parts = date.split(/[-/]/);
    if (parts.length === 3) {
        const [day, month, year] = parts;
        const reorderedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const reorderedParsed = new Date(reorderedDate);
        if (!isNaN(reorderedParsed.getTime())) return reorderedParsed;
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
    bookingIds?: string[];
}

export type ScheduleChangeType = 'checkIn' | 'checkOut' | 'service' | 'boardingType';

export type ScheduleChangeHandler = (
    type:
        | 'boardingType'
        | 'checkIn'
        | 'checkOut'
        | 'checkInTime'
        | 'checkOutTime' 
        | 'service' 
        | 'serviceTime', 
    value: Date | string | null,
    time?: string 
) => void;

export interface BaseBookingFormProps {
    onConfirmBooking: (
        ownerDetails: OwnerDetails,
        pets: Pet[],
        totalAmounts: number[],
        discountsApplied?: number[]
    ) => Promise<BookingResult>;
    onClose: () => void;
    serviceType: ServiceType;
    isSubmitting?: boolean;
    unavailableDates: Date[]; 
    unavailableTimes: string[]; 
    dateHighlight?: (date: Date) => boolean;
    dateDefaultMessage?: string;
    children?: (props: {
        pet: Pet;
        onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
        onScheduleChange: ScheduleChangeHandler;
        errors: Record<string, string>;
        serviceType: ServiceType;
        onAddPet: () => void;
        onRemovePet: (index: number) => void;
        currentPetIndex: number;
        dateHighlight?: (date: Date) => boolean;
        dateDefaultMessage?: string;
        unavailableDates: Date[]; 
        unavailableTimes: string[]; 
    }) => ReactNode;

}

export interface PetStepProps {
    pets: Pet[];
    currentPetIndex: number;
    serviceType: ServiceType;
    onAddPet: () => void;
    onEditPet: (index: number) => void;
    onRemovePet: (index: number) => void;
    onBack: () => void;
    onNext: () => void;
    isSubmitting?: boolean;
    errors?: Record<string, string>;
    onPetChange: (updatedPet: Pet) => void;
    onScheduleChange: ScheduleChangeHandler;
    dateHighlight?: (date: Date) => boolean;
    dateDefaultMessage?: string;
    unavailableDates: Date[];
    unavailableTimes: string[];
    children?: (props: {
        pet: Pet;
        onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
        onScheduleChange: ScheduleChangeHandler;
        errors: Record<string, string>;
        serviceType: ServiceType;
        onAddPet: () => void;
        onRemovePet: (index: number) => void;
        currentPetIndex: number;
        dateHighlight?: (date: Date) => boolean;
        dateDefaultMessage?: string;
        unavailableDates: Date[];
        unavailableTimes: string[];
    }) => ReactNode;
}

export interface BasePetDetailsProps {
    pet: Pet;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    onScheduleChange: ScheduleChangeHandler;
    errors: Record<string, string>;
    serviceType: ServiceType;
    dateHighlight?: (date: Date) => boolean;
    dateDefaultMessage?: string;
    unavailableDates: Date[]; 
    unavailableTimes: string[]; 
}

export interface ReviewStepProps {
    ownerDetails: OwnerDetails;
    pets: Pet[];
    serviceType: ServiceType;
    confirmedInfo: boolean;
    onConfirmChange: (checked: boolean) => void;
    onBack: () => void;
    onConfirm: () => Promise<void>;
    isSubmitting: boolean;
    errors: Record<string, string>;
}




