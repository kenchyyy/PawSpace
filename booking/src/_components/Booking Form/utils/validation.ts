import { OwnerDetails, Pet, BoardingPet, GroomingPet, isGroomingPet, isBoardingPet } from '../types';
import { isSameDay } from 'date-fns';

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
    
    // Base validation with stricter rules
    if (!pet.name?.trim()) errors.name = 'Pet name is required';
    if (!pet.breed?.trim()) errors.breed = 'Breed is required';
    if (!pet.vaccinated) errors.vaccinated = 'Vaccination status is required';
    if (!pet.size) errors.size = 'Pet size is required';

    const ageRegex = /^([1-9][0-9]?)\s+(month|months|year|years)$/i;
    if (!pet.age || !ageRegex.test(pet.age.trim())) {
        errors.age = 'Age must be in format: "X months" or "X years"';
    }

    // Service-specific validation
    if (isGroomingPet(pet)) {
        const groomingPet = pet as GroomingPet;
        
        // Validate service time
        if (groomingPet.service_time) {
            const hour = parseInt(groomingPet.service_time.split(':')[0]);
            if (hour < 9 || hour > 17) {
                errors.service_time = 'Service time must be between 9 AM and 5 PM';
            }
            if (groomingPet.service_time === '12:30') {
                errors.service_time = 'This time slot is during lunch break';
            }
        }

        // Validate service variant and size requirements
        if (groomingPet.pet_type === 'dog' && (!groomingPet.size || !groomingPet.service_variant)) {
            errors.size = 'Size and service variant are required for dog grooming';
        }
    }

    if (isBoardingPet(pet)) {
        const boardingPet = pet as BoardingPet;
        
        // Validate check-in/out times
        if (boardingPet.boarding_type === 'day') {
            if (boardingPet.check_in_date && boardingPet.check_out_date && 
                !isSameDay(boardingPet.check_in_date, boardingPet.check_out_date)) {
                errors.check_out_date = 'Check-out must be same day for day boarding';
            }
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

export const validateBooking = (data: BookingValidationData) => {
    const errors: Record<string, string> = {};
    
    if (!data.confirmedInfo) {
        errors.confirmation = 'Please confirm the information';
    }

    if (data.totalAmounts?.some(amount => amount <= 0)) {
        errors.pricing = 'Invalid pricing';
    }

    // Check for business hours
    data.pets.forEach((pet, index) => {
        if (isGroomingPet(pet) && pet.service_time) {
            const hour = parseInt(pet.service_time.split(':')[0]);
            if (hour < 9 || hour > 17) {
                errors[`pet${index}.service_time`] = 'Outside business hours';
            }
        }
    });

    return {
        success: Object.keys(errors).length === 0,
        errors
    };
};

// Add helper function to validate business hours
export const isWithinBusinessHours = (time: string): boolean => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 9 && hour <= 17;
};

// Add helper function to validate lunch break
export const isDuringLunchBreak = (time: string): boolean => {
    return time === '12:30';
};
