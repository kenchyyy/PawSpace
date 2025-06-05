import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import ReviewStep from '../../../_components/Booking Form/Steps/ReviewStep';
import { 
    mockOwner, 
    mockBoardingPet, 
    mockGroomingPet
} from '../utils/mockData';
import { RoomSize, Pet, BoardingPet } from '../../../_components/Booking Form/types';

const meta: Meta<typeof ReviewStep> = {
    title: 'BookingForm/Steps/ReviewStep',
    component: ReviewStep,
    parameters: {
        layout: 'padded',
        chromatic: { viewports: [320, 768, 1200] },
    },
    argTypes: {
        onConfirm: { action: 'confirmed' },
        onBack: { action: 'went back' },
        onConfirmChange: { action: 'confirmation changed' }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReviewStep>;

// Base story with boarding service
export const BoardingReview: Story = {
    args: {
        ownerDetails: mockOwner,
        pets: [mockBoardingPet],
        serviceType: 'boarding',
        confirmedInfo: false,
        onConfirmChange: () => {},
        onBack: () => {},
        onConfirm: async () => ({ success: true, bookingId: 'test-123' }),
        isSubmitting: false,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const checkbox = canvas.getByRole('checkbox');
        await userEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    }
};

// Grooming service review
export const GroomingReview: Story = {
    args: {
        ownerDetails: mockOwner,
        pets: [mockGroomingPet],
        serviceType: 'grooming',
        confirmedInfo: false,
        onConfirmChange: () => {},
        onBack: () => {},
        onConfirm: async () => ({ success: true, bookingId: 'test-456' }),
        isSubmitting: false,
    }
};


const mockMultiplePetsData: Pet[] = [
    {
        ...mockBoardingPet,
        room_size: 'medium' as RoomSize
    },
    {
        ...mockBoardingPet,
        id: 'pet-2',
        name: 'Bella',
        room_size: 'large' as RoomSize
    }
];


export const MultiplePetsReview: Story = {
    args: {
        ownerDetails: mockOwner,
        pets: mockMultiplePetsData,
        serviceType: 'boarding',
        confirmedInfo: true,
        onConfirmChange: () => {},
        onBack: () => {},
        onConfirm: async () => ({ success: true, bookingId: 'test-789' }),
        isSubmitting: false,
    }
};

// Loading state
export const LoadingState: Story = {
    args: {
        ownerDetails: mockOwner,
        pets: [mockBoardingPet],
        serviceType: 'boarding',
        confirmedInfo: true,
        onConfirmChange: () => {},
        onBack: () => {},
        onConfirm: async () => new Promise(resolve => 
            setTimeout(() => resolve({ success: true }), 2000)
        ),
        isSubmitting: true,
    }
};

// Error state
export const ErrorState: Story = {
    args: {
        ownerDetails: mockOwner,
        pets: [mockBoardingPet],
        serviceType: 'boarding',
        confirmedInfo: true,
        onConfirmChange: () => {},
        onBack: () => {},
        onConfirm: async () => ({ 
            success: false, 
            error: 'Failed to process booking. Please try again.' 
        }),
        isSubmitting: false,
        errors: {
            confirmation: 'Failed to process booking. Please try again.'
        }
    }
};