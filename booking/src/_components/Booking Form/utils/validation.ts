import { OwnerDetails, Pet, BoardingPet, GroomingPet, isGroomingPet, isBoardingPet } from '../types';
import { isSameDay } from 'date-fns';

export const validatePetDetails = (pet: Pet): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Base validation
    if (!pet.name?.trim()) errors.name = 'Pet name is required';
    if (!pet.breed?.trim()) errors.breed = 'Breed is required';
    if (!pet.vaccinated) errors.vaccinated = 'Vaccination status is required';
    if (!pet.size) errors.size = 'Size is required';
    if (!pet.age?.trim()) errors.age = 'Age is required';

    if (isBoardingPet(pet)) {
        const boardingPet = pet as BoardingPet;
        
        // Basic requirements validation
        if (!boardingPet.room_size) errors.room_size = 'Room size is required';
        if (!boardingPet.check_in_date) errors.check_in_date = 'Check-in date is required';
        if (!boardingPet.check_out_date) errors.check_out_date = 'Check-out date is required';
        if (!boardingPet.check_in_time) errors.check_in_time = 'Check-in time is required';
        if (!boardingPet.check_out_time) errors.check_out_time = 'Check-out time is required';

        // Validate room size compatibility
        if (boardingPet.size === 'large' && boardingPet.room_size === 'small') {
            errors.room_size = 'Room size must be appropriate for pet size';
        }

        // Validate boarding schedule
        if (boardingPet.check_in_date && boardingPet.check_out_date) {
            if (boardingPet.boarding_type === 'day' && !isSameDay(boardingPet.check_in_date, boardingPet.check_out_date)) {
                errors.check_out_date = 'For day boarding, check-out date must be same as check-in date';
            }
            if (boardingPet.boarding_type === 'overnight' && isSameDay(boardingPet.check_in_date, boardingPet.check_out_date)) {
                errors.check_out_date = 'For overnight boarding, check-out date must be different from check-in date';
            }
        }

        // Time validation for day boarding
        if (boardingPet.boarding_type === 'day' && boardingPet.check_in_time && boardingPet.check_out_time) {
            const inTime = parseInt(boardingPet.check_in_time.split(':')[0]);
            const outTime = parseInt(boardingPet.check_out_time.split(':')[0]);
            if (outTime <= inTime) {
                errors.check_out_time = 'Check-out time must be later than check-in time';
            }
        }

        // Validate meal instructions
        if (boardingPet.meal_instructions) {
            Object.entries(boardingPet.meal_instructions).forEach(([meal, details]) => {
                if (details.time && !details.food) {
                    errors[`meal_instructions.${meal}.food`] = 'Food is required when time is set';
                }
                if (!details.time && details.food) {
                    errors[`meal_instructions.${meal}.time`] = 'Time is required when food is set';
                }
            });
        }
    }

    if (isGroomingPet(pet)) {
        const groomingPet = pet as GroomingPet;
        if (!groomingPet.service_variant) {
            errors.service_variant = 'Service variant is required';
        } else if (groomingPet.pet_type === 'dog' && groomingPet.service_variant === 'cat') {
            errors.service_variant = 'Invalid service variant for dog';
        }

        const hour = groomingPet.service_time ? parseInt(groomingPet.service_time.split(':')[0]) : -1;
        if (hour < 9 || hour > 17) {
            errors.service_time = 'Service time must be between 9 AM and 5 PM';
        }
    }

    // Validate age format
    if (pet.age && !pet.age.match(/^\d+\s+(month|months|year|years)$/i)) {
        errors.age = 'Age must be in format "X months" or "X years"';
    }

    if (pet.special_requests?.length > 500) {
        errors.special_requests = 'Special requests must not exceed 500 characters';
    }

    return errors;
};

export const validateCustomerDetails = (owner: OwnerDetails): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!owner.name?.trim()) {
        errors.name = 'Name is required';
    } else {
        const name = owner.name.trim();
        if (name.split(/\s+/).length < 2) {
            errors.name = 'Please enter your full name';
        } else if (name.length < 5) {
            errors.name = 'Name must be at least 5 characters';
        } else if (name.length > 25) {
            errors.name = 'Name must not exceed 25 characters';
        }
    }

    // Address validation
    if (!owner.address?.trim()) {
        errors.address = 'Address is required';
    } else if (owner.address.trim().length < 10) {
        errors.address = 'Please provide a complete address';
    }

    // Email validation
    if (!owner.email?.trim()) {
        errors.email = 'Email is required';
    } else {
        const email = owner.email.trim();
        const emailParts = email.split('@');
        if (emailParts.length !== 2 || !emailParts[0] || !emailParts[1]) {
            errors.email = 'Invalid email format';
        } else {
            const domainParts = emailParts[1].split('.');
            if (domainParts.length < 2 || domainParts.some(part => part.length < 2)) {
                errors.email = 'Invalid email domain';
            }
        }
    }

    // Phone validation
    if (!owner.contact_number?.trim()) {
        errors.contact_number = 'Contact number is required';
    } else if (!/^09\d{9}$/.test(owner.contact_number.trim())) {
        errors.contact_number = 'Please enter a valid Philippine mobile number';
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
