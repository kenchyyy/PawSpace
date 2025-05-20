export interface GroomingType {
  id: string; // PK and FK of Pet table
  groom_type: string;
}

export interface BoardingType {
  id: string; // PK and FK of Pet table
  boarding_type: string;
}

export interface PetDetails {
  pet_uuid: string; // PK
  name: string;
  pet_type: string;
  grooming_id: string; // FK to GroomService.id
  groom_service?: GroomingType; // For joined data
  boarding_id_extension: string; // FK to BoardingPet.id
  boarding_pet?: BoardingType; // For joined data
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
    special_requests: string;
    total_amount: number;
    discount_applied: number;
    approvalStatus?: 'pending' | 'approved' | 'cancelled';
    cancellationReason: string;
    pets?: PetDetails[];
};