import { OwnerDetails, Pet, BoardingPet, GroomingPet } from '../types';

export const validateCustomerDetails = (owner: OwnerDetails): Record<string, string> => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^09\d{9}$/;

    if (!owner.name) errors.name = 'Name is required';
    if (!owner.email || !emailRegex.test(owner.email)) errors.email = 'Valid email is required';
    if (!owner.contact_number || !phoneRegex.test(owner.contact_number)) errors.contact_number = 'Valid Philippine mobile number is required';
    if (!owner.address) errors.address = 'Address is required';

    return errors;
};

export const validatePetDetails = (pet: Pet): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Base validation
    if (!pet.name) errors.name = 'Pet name is required';
    if (!pet.breed) errors.breed = 'Breed is required';

    // Service-specific validation
    if ('check_in_date' in pet) {
        const boardingPet = pet as BoardingPet;
        if (boardingPet.check_out_date && boardingPet.check_in_date && 
            boardingPet.check_out_date < boardingPet.check_in_date) {
            errors.check_out_date = 'Check-out must be after check-in';
        }
    }

    if ('service_time' in pet) {
        const groomingPet = pet as GroomingPet;
        const hour = parseInt(groomingPet.service_time.split(':')[0]);
        if (hour < 9 || hour > 17) {
            errors.service_time = 'Service time must be between 9 AM and 5 PM';
        }
    }

    return errors;
};

export interface BookingValidationData {
    ownerDetails: OwnerDetails;
    pets: Pet[];
    confirmedInfo?: boolean;
    totalAmounts?: number[];
    discountsApplied?: number[];
}

export const validateReviewStep = (data: BookingValidationData): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!data.confirmedInfo) {
        errors.confirmation = 'Please confirm the information';
    }

    if (data.totalAmounts?.some(amount => amount < 0)) {
        errors.total = 'Invalid total amount';
    }

    return errors;
};

export const validateBooking = (data: BookingValidationData): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!data.confirmedInfo) {
        errors.confirmation = 'Please confirm the information';
    }

    const ownerErrors = validateCustomerDetails(data.ownerDetails);
    Object.assign(errors, ownerErrors);

    data.pets.forEach((pet, index) => {
        const petErrors = validatePetDetails(pet);
        Object.entries(petErrors).forEach(([key, value]) => {
            errors[`pet${index}.${key}`] = value;
        });
    });

    return errors;
};
