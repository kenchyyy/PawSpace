export interface OwnerDetails {
    name: string;
    address: string;
    contact_number: string;
    email: string;
}

export interface GroomService {
    service_variant: string;
    service_time?: string; 
}

export interface BoardingPet {
    boarding_type: 'overnight' | 'day';
    room_size: string;
    check_in_time?: string;
    check_out_time?: string;
    meal_instructions?: MealInstructionType[];
}

export interface MealInstructionType {
    id?: string; 
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'other';
    time: string;
    food: string;
    notes?: string;
}

export interface Pet {
    pet_uuid: string;
    name: string;
    pet_type: string;
    age: number;
    breed: string;
    size: string;
    vaccinated: boolean;
    vitamins_or_medications?: string;
    allergies?: string;
    groom_service?: GroomService; 
    boarding_pet?: BoardingPet; 
}

export interface BookingRecord {
    booking_uuid: string;
    owner_details: OwnerDetails;
    pets: Pet[];
    service_date_start: string;
    service_date_end: string;
    special_requests?: string;
    date_booked: string;
    total_amount: number;
    discount_applied?: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'ongoing';
    cancellationReason?: string; 
}