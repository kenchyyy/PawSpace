import type { Meta, StoryObj } from '@storybook/react';
import { BoardingPet } from '../../../_components/Booking Form/types';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import MealInstructions from '../../../_components/Booking Form/Form Components/MealInstructions';
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




