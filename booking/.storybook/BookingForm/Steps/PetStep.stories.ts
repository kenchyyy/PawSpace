// PetStep.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import PetStep from '../../../src/_components/Booking Form/Steps/PetStep';
import { 
    mockBoardingPet, 
    mockGroomingPet, 
    mockInvalidPet, 
    mockErrorStates,
    mockUnavailability 
} from '../utils/mockData';

const meta: Meta<typeof PetStep> = {
    title: 'BookingForm/Steps/PetStep',
    component: PetStep,
    parameters: {
        layout: 'padded',
        chromatic: { viewports: [320, 768, 1200] }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PetStep>;

export const EmptyPetList: Story = {
    args: {
        pets: [],
        currentPetIndex: -1,
        serviceType: 'boarding',
        onAddPet: () => {},
        onEditPet: () => {},
        onRemovePet: () => {},
        onBack: () => {},
        onNext: () => {},
        onPetChange: () => {},
        onScheduleChange: () => {},
        unavailableDates: mockUnavailability.dates,
        unavailableTimes: mockUnavailability.times
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const addButton = canvas.getByText(/Add Pet/i);
        await userEvent.click(addButton);
    }
};

export const BoardingPetForm: Story = {
    args: {
        pets: [mockBoardingPet],
        currentPetIndex: 0,
        serviceType: 'boarding',
        onAddPet: () => {},
        onEditPet: () => {},
        onRemovePet: () => {},
        onBack: () => {},
        onNext: () => {},
        onPetChange: () => {},
        onScheduleChange: () => {},
        unavailableDates: mockUnavailability.dates,
        unavailableTimes: mockUnavailability.times
    }
};

export const GroomingPetForm: Story = {
    args: {
        pets: [mockGroomingPet],
        currentPetIndex: 0,
        serviceType: 'grooming',
        onAddPet: () => {},
        onEditPet: () => {},
        onRemovePet: () => {},
        onBack: () => {},
        onNext: () => {},
        onPetChange: () => {},
        onScheduleChange: () => {},
        unavailableDates: mockUnavailability.dates,
        unavailableTimes: mockUnavailability.times
    }
};

export const WithErrors: Story = {
    args: {
        pets: [{
            ...mockBoardingPet,
            name: '',
            breed: '',
            vaccinated: 'unknown' as const
        }],
        currentPetIndex: 0,
        serviceType: 'boarding',
        onAddPet: () => {},
        onEditPet: () => {},
        onRemovePet: () => {},
        onBack: () => {},
        onNext: () => {},
        onPetChange: () => {},
        onScheduleChange: () => {},
        unavailableDates: mockUnavailability.dates,
        unavailableTimes: mockUnavailability.times,
        errors: {
            'name': 'Name is required',
            'breed': 'Breed is required',
            'age': 'Age must be specified',
            'vaccinated': 'Vaccination status is required'
        }
    }
};