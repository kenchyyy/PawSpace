import type { Meta, StoryObj } from '@storybook/react';
import BaseBookingForm from '../../../src/_components/Booking Form/Forms/BaseBookingForm';
import { 
    mockOwner, 
    mockBoardingPet, 
    mockUnavailability 
} from '../utils/mockData';
import { Pet } from '../../../src/_components/Booking Form/types';

const meta: Meta<typeof BaseBookingForm> = {
    title: 'BookingForm/Forms/BaseBookingForm',
    component: BaseBookingForm,
    parameters: {
        layout: 'padded',
        chromatic: { viewports: [320, 768, 1200] }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BaseBookingForm>;

export const NewBookingBoarding: Story = {
    args: {
        onConfirmBooking: async (ownerDetails, pets, totalAmounts) => ({ 
            success: true, 
            bookingId: 'test-123' 
        }),
        onClose: () => {},
        serviceType: 'boarding',
        isSubmitting: false,
        unavailableDates: mockUnavailability.dates,
        unavailableTimes: mockUnavailability.times,
        dateDefaultMessage: 'Select a date',
        dateHighlight: (date: Date) => date.getDay() === 0,
        children: (props) => {
            const { pet, onChange, onScheduleChange, errors } = props;
            return null; // Child components will handle rendering
        }
    }
};

export const Default: Story = {
    args: {
        onConfirmBooking: async (ownerDetails, pets, totalAmounts) => ({ success: true, bookingId: 'test-123' }),
        onClose: () => {},
        serviceType: 'boarding',
        isSubmitting: false,
        unavailableDates: mockUnavailability.dates,
        unavailableTimes: mockUnavailability.times
    }
};

export const WithErrors: Story = {
    args: {
        onConfirmBooking: async () => ({ success: false, error: 'Validation failed' }),
        onClose: () => {},
        serviceType: 'boarding',
        isSubmitting: false,
        unavailableDates: mockUnavailability.dates,
        unavailableTimes: mockUnavailability.times,
        children: ({ errors, pet }) => {
            if (Object.keys(errors).length > 0) {
                return `Validation errors: ${Object.values(errors).join(', ')}`;
            }
            return null;
        }
    }
};

export const MobileViewport: Story = {
    args: {
        onConfirmBooking: async (ownerDetails, pets, totalAmounts) => ({ 
            success: true, 
            bookingId: 'test-123' 
        }),
        onClose: () => {},
        serviceType: 'boarding',
        isSubmitting: false,
        unavailableDates: mockUnavailability.dates,
        unavailableTimes: mockUnavailability.times,
        dateDefaultMessage: 'Select a date',
        dateHighlight: (date: Date) => date.getDay() === 0,
        children: (props) => {
            const { pet, onChange, onScheduleChange, errors } = props;
            return null; // Child components will handle rendering
        }
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    },
    play: async ({ canvasElement }) => {
        // Test mobile interactions
    }
};

export const ErrorScenarios: Story = {
    args: {
        onConfirmBooking: async () => ({ success: false, error: 'Validation failed' }),
        onClose: () => {},
        serviceType: 'boarding',
        isSubmitting: false,
        unavailableDates: mockUnavailability.dates,
        unavailableTimes: mockUnavailability.times,
        children: ({ errors, pet }) => {
            if (Object.keys(errors).length > 0) {
                return `Validation errors: ${Object.values(errors).join(', ')}`;
            }
            return null;
        }
    },
    play: async ({ canvasElement }) => {
        // Test error scenarios
    }
};