export interface GroomingType {
    id: string; 
    service_variant: string;
}

export interface BoardingType {
    id: string; 
    boarding_type: string; 
    room_size: string;
    special_feeding_request: string;
}

export interface PetDetails {
    pet_uuid: string; 
    name: string;
    age: string;
    pet_type: string;
    breed: string;
    size: string;
    vaccinated: boolean;
    vitamins_or_medications: string;
    allergies: string;
    grooming_id: string | null; 
    groom_service?: GroomingType | null;
    boarding_id_extension: string | null; 
    boarding_pet?: BoardingType | null;
}

export interface OwnerDetails {
    id: string;
    name: string;
    address: string;
    contact_number: string;
    email: string;
}

export type BookingRecord = {
    booking_uuid: string;
    date_booked: Date | string;
    service_date_start: Date | string;
    service_date_end: Date | string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'ongoing';
    owner_details: OwnerDetails;
    special_requests: string | null;
    total_amount: number;
    discount_applied: number | null;
    cancellationReason: string | null;
    pets?: PetDetails[];
};