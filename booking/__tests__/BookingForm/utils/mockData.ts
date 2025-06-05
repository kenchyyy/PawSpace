import { OwnerDetails, BoardingPet, GroomingPet } from '../../../src/_components/Booking Form/types';

export const mockOwner: OwnerDetails = {
    name: 'John Doe',
    email: 'john@example.com',
    contact_number: '09123456789',
    address: '123 Test St.'
};

export const mockBoardingPet: BoardingPet = {
    name: 'Max',
    age: '2 years',
    pet_type: 'dog',
    breed: 'Golden Retriever',
    vaccinated: 'yes',
    size: 'medium',
    service_type: 'boarding',
    room_size: 'medium',
    boarding_type: 'overnight',
    check_in_date: new Date('2025-06-10'),
    check_in_time: '10:00',
    check_out_date: new Date('2025-06-12'),
    check_out_time: '10:00',
    meal_instructions: {
        breakfast: { time: '', food: '', notes: '' },
        lunch: { time: '', food: '', notes: '' },
        dinner: { time: '', food: '', notes: '' }
    },
    special_feeding_request: '',
    vitamins_or_medications: '',
    allergies: '',
    special_requests: '',
    completed: false
};

export const mockGroomingPet: GroomingPet = {
    name: 'Luna',
    age: '1 year',
    pet_type: 'cat',
    breed: 'Persian',
    vaccinated: 'yes',
    size: 'medium',
    service_type: 'grooming',
    service_variant: 'cat',
    service_date: new Date('2025-06-10'),
    service_time: '14:00',
    vitamins_or_medications: '',
    allergies: '',
    special_requests: '',
    completed: false
};
