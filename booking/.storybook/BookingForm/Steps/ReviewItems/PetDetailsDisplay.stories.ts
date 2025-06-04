import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import PetDetailsDisplay from '../../../../src/_components/Booking Form/Steps/ReviewItems/PetdetailsDisplay';
import { mockBoardingPet, mockGroomingPet } from '../../utils/mockData';

const meta: Meta<typeof PetDetailsDisplay> = {
    title: 'BookingForm/Steps/ReviewItems/PetDetailsDisplay',
    component: PetDetailsDisplay,
    parameters: {
        layout: 'padded',
        chromatic: { viewports: [320, 768, 1200] },
        a11y: { disable: false }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PetDetailsDisplay>;

export const StandardPet: Story = {
    args: {
        pet: mockBoardingPet
    }
};

export const WithFullMedicalInfo: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            vitamins_or_medications: 'Daily heart medication, joint supplements',
            allergies: 'Chicken, beef products',
            special_requests: 'Extra care during feeding times'
        }
    }
};

export const UnvaccinatedPet: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            vaccinated: 'no'
        }
    }
};

export const SmallScreenLayout: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    },
    args: {
        pet: mockBoardingPet
    }
};
