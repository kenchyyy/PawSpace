import type { Meta, StoryObj } from '@storybook/react';
import { BoardingPet } from '../../../../src/_components/Booking Form/types';
import BoardingPetDetailsDisplay from '../../../../src/_components/Booking Form/Steps/ReviewItems/BoardingDetailsDisplay';
import { mockBoardingPet } from '../../utils/mockData';

const meta: Meta<typeof BoardingPetDetailsDisplay> = {
    title: 'BookingForm/Steps/ReviewItems/BoardingPetDetailsDisplay',
    component: BoardingPetDetailsDisplay,
    parameters: {
        layout: 'padded',
        a11y: { disable: false }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BoardingPetDetailsDisplay>;

export const Default: Story = {
    args: {
        boardingPet: mockBoardingPet
    }
};

export const WithMealInstructions: Story = {
    args: {
        boardingPet: {
            ...mockBoardingPet,
            meal_instructions: {
                breakfast: { time: '07:00', food: 'Premium Kibble', notes: 'Warm water mix' },
                lunch: { time: '13:00', food: 'Wet Food', notes: 'Half portion' },
                dinner: { time: '19:00', food: 'Premium Kibble', notes: 'With supplements' }
            }
        }
    }
};

export const ExtendedStay: Story = {
    args: {
        boardingPet: {
            ...mockBoardingPet,
            check_out_date: new Date('2025-06-25'), // 15-day stay
            special_feeding_request: 'Special diet food only'
        }
    }
};

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    },
    args: {
        boardingPet: mockBoardingPet
    }
};
