import type { Meta, StoryObj } from '@storybook/react';
import { BoardingPet } from '../../../src/_components/Booking Form/types';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import MealInstructions from '../../../src/_components/Booking Form/Form Components/MealInstructions';
import { mockBoardingPet } from '../utils/mockData';

const meta: Meta<typeof MealInstructions> = {
    title: 'BookingForm/Form Components/MealInstructions',
    component: MealInstructions,
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
    argTypes: {
        onChange: { action: 'meal instructions changed' }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MealInstructions>;

export const EmptyForm: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            meal_instructions: {
                breakfast: { time: '', food: '', notes: '' },
                lunch: { time: '', food: '', notes: '' },
                dinner: { time: '', food: '', notes: '' }
            }
        },
        onChange: () => {},
        errors: {}
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const timeInputs = canvas.getAllByLabelText(/time/i);
        expect(timeInputs).toHaveLength(3);
    }
};

export const FilledForm: Story = {
    args: {
        pet: mockBoardingPet,
        onChange: () => {},
        errors: {}
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const foodInputs = canvas.getAllByLabelText(/food/i);
        await userEvent.type(foodInputs[0], ' extra');
    }
};

export const WithValidationErrors: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            meal_instructions: {
                breakfast: { time: '', food: '', notes: '' },
                lunch: { time: '12:00', food: '', notes: '' },
                dinner: { time: '', food: 'Kibble', notes: '' }
            }
        },
        onChange: () => {},
        errors: {
            'meal_instructions.breakfast.time': 'Breakfast time is required',
            'meal_instructions.lunch.food': 'Lunch food is required',
            'meal_instructions.dinner.time': 'Dinner time is required'
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const errorMessages = canvas.getAllByRole('alert');
        expect(errorMessages).toHaveLength(3);
    }
};

export const WithCustomSchedule: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            meal_instructions: {
                breakfast: { time: '06:30', food: 'Special Diet Kibble', notes: '1 cup with medication' },
                lunch: { time: '13:00', food: 'Wet food', notes: 'Half can only' },
                dinner: { time: '19:30', food: 'Special Diet Kibble', notes: '1 cup' }
            }
        },
        onChange: () => {},
        errors: {}
    }
};

export const WithSpecialInstructions: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            meal_instructions: {
                breakfast: { time: '07:00', food: 'Prescription Diet', notes: 'Must be measured exactly' },
                lunch: { time: '12:00', food: 'Prescription Diet', notes: 'Mix with warm water' },
                dinner: { time: '18:00', food: 'Prescription Diet', notes: 'Give medication after meal' }
            },
            special_feeding_request: 'Food allergies - strict diet required'
        },
        onChange: () => {},
        errors: {}
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const specialInstructions = canvas.getByText(/Food allergies/i);
        expect(specialInstructions).toBeInTheDocument();
    }
};