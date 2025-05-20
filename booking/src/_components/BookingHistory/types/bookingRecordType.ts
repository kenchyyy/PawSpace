export interface GroomingType {
    id: string; // PK of GroomingPet
    service_variant: string;
}

export interface BoardingType {
    id: string; // PK of BoardingPet
    boarding_type: string; // Changed to string
}

export interface PetDetails {
    pet_uuid: string; // PK
    name: string;
    pet_type: string;
    grooming_id: string | null; // FK to GroomingPet.id, can be null
    groom_service?: GroomingType | null;
    boarding_id_extension: string | null; // FK to BoardingPet.id, can be null
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
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'onGoing';
    owner_details: OwnerDetails;
    special_requests: string | null;
    total_amount: number;
    discount_applied: number | null;
    approvalStatus?: 'pending' | 'approved' | 'cancelled' | null;
    cancellationReason: string | null;
    pets?: PetDetails[];
};