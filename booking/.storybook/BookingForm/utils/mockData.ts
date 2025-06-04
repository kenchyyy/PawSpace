import { 
    OwnerDetails, 
    Pet, 
    BoardingPet, 
    GroomingPet, 
    MealInstructions 
} from '../../../src/_components/Booking Form/types';

export const mockOwner: OwnerDetails = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Pet Street, Metro Manila',
    contact_number: '09123456789',
    auth_id: 'mock-auth-id'
};

export const mockBoardingPet: BoardingPet = {
    id: '1',
    name: 'Max',
    pet_type: 'dog',
    breed: 'Golden Retriever',
    size: 'medium',
    age: '2 years',
    vaccinated: 'yes',
    vitamins_or_medications: 'Daily vitamins',
    allergies: 'None',
    special_requests: 'Likes to play with toys',
    completed: false,
    service_type: 'boarding',
    room_size: 'medium',
    boarding_type: 'overnight',
    check_in_date: new Date('2025-06-10'),
    check_in_time: '09:00',
    check_out_date: new Date('2025-06-12'),
    check_out_time: '17:00',
    meal_instructions: {
        breakfast: { time: '07:00', food: 'Dry kibble', notes: 'Half cup' },
        lunch: { time: '12:00', food: 'Wet food', notes: 'One pouch' },
        dinner: { time: '18:00', food: 'Dry kibble', notes: 'Half cup' }
    },
    special_feeding_request: 'Separate from other dogs during feeding'
};

export const mockGroomingPet: GroomingPet = {
    id: '2',
    name: 'Luna',
    pet_type: 'cat',
    breed: 'Persian',
    size: 'small',
    age: '3 years',
    vaccinated: 'yes',
    vitamins_or_medications: '',
    allergies: 'None',
    special_requests: 'Extra gentle handling',
    completed: false,
    service_type: 'grooming',
    service_variant: 'cat',
    service_date: new Date('2025-06-15'),
    service_time: '14:00'
};

export const mockErrorStates = {
    ownerErrors: {
        name: 'Full name is required',
        email: 'Please enter a valid email',
        contact_number: 'Contact number must be 11 digits',
        address: 'Complete address is required'
    },
    petErrors: {
        name: 'Pet name is required',
        breed: 'Breed is required',
        age: 'Age must be specified in years or months',
        vaccinated: 'Vaccination status is required'
    }
};

export const mockUnavailability = {
    dates: [
        new Date('2025-06-20'),
        new Date('2025-06-21'),
        new Date('2025-06-22')
    ],
    times: ['09:00', '10:00', '14:00']
};

export const mockLoadingStates = {
    isSubmitting: true,
    isLoading: true,
    isSaving: true
};

// Additional test data variations
export const mockInvalidPet = {
    ...mockBoardingPet,
    name: '',
    breed: '',
    vaccinated: 'unknown'
};

export const mockMultiplePets = [
    mockBoardingPet,
    {
        ...mockBoardingPet,
        id: '3',
        name: 'Charlie',
        breed: 'Labrador',
        room_size: 'large'
    }
];
