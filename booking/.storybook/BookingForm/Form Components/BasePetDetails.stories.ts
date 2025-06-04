import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import BasePetDetails from '../../../src/_components/Booking Form/Form Components/BasePetDetails';
import { mockBoardingPet, mockGroomingPet } from '../utils/mockData';
import { PetType, ServiceType } from '../../../src/_components/Booking Form/types';

const meta: Meta<typeof BasePetDetails> = {
    title: 'Form Components/BasePetDetails',
    component: BasePetDetails,
    parameters: {
        layout: 'padded',
        a11y: {
            config: {
                rules: [
                    { id: 'label', enabled: true },
                    { id: 'form-field-multiple-labels', enabled: true }
                ]
            }
        }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BasePetDetails>;

export const EmptyForm: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            name: '',
            breed: '',
            age: '',
            pet_type: 'dog' as PetType, // Fix empty string
            vaccinated: 'unknown',
            size: 'medium'
        },
        onChange: () => {},
        onScheduleChange: () => {},
        errors: {},
        serviceType: 'boarding',
        unavailableDates: [],
        unavailableTimes: []
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const inputs = canvas.getAllByRole('textbox');
        expect(inputs.length).toBeGreaterThan(0);
    }
};

export const FilledBoardingPet: Story = {
    args: {
        pet: mockBoardingPet,
        onChange: () => {},
        onScheduleChange: () => {},
        errors: {},
        serviceType: 'boarding',
        unavailableDates: [],
        unavailableTimes: []
    }
};

export const FilledGroomingPet: Story = {
    args: {
        pet: mockGroomingPet,
        onChange: () => {},
        onScheduleChange: () => {},
        errors: {},
        serviceType: 'grooming',
        unavailableDates: [],
        unavailableTimes: []
    }
};

export const WithValidationErrors: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            name: '',
            breed: '',
            vaccinated: ''
        },
        onChange: () => {},
        onScheduleChange: () => {},
        errors: {
            name: 'Name is required',
            breed: 'Breed is required',
            vaccinated: 'Vaccination status is required'
        },
        serviceType: 'boarding',
        unavailableDates: [],
        unavailableTimes: []
    }
};

export const InteractiveForm: Story = {
    args: {
        pet: mockBoardingPet,
        onChange: () => {},
        onScheduleChange: () => {},
        errors: {},
        serviceType: 'boarding'
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        
        // Test name input
        const nameInput = canvas.getByLabelText(/Pet Name/i);
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Max');
        
        // Test breed selection
        const breedInput = canvas.getByLabelText(/Breed/i);
        await userEvent.type(breedInput, 'Golden Retriever');
        
        // Test age input
        const ageInput = canvas.getByLabelText(/Age/i);
        await userEvent.type(ageInput, '2');
    }
};

export const MobileLayout: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    },
    args: {
        pet: mockBoardingPet,
        onChange: () => {},
        onScheduleChange: () => {},
        errors: {},
        serviceType: 'boarding'
    }
};

export const WithMedicalInfo: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            vitamins_or_medications: 'Daily heart medication',
            allergies: 'Sensitive to chicken',
            special_requests: 'Needs medication at 8am daily'
        },
        onChange: () => {},
        onScheduleChange: () => {},
        errors: {},
        serviceType: 'boarding'
    }
};
