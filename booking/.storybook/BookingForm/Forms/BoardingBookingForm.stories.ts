// BoardingBookingForm.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import BoardingBookingForm from '../../../src/_components/Booking Form/Forms/BoardingBookingForm';
import { mockOwner, mockUnavailability } from '../utils/mockData';
import { BookingResult } from '../../../src/_components/Booking Form/types';

const meta: Meta<typeof BoardingBookingForm> = {
  title: 'BookingForm/Forms/BoardingBookingForm',
  component: BoardingBookingForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BoardingBookingForm>;

export const Default: Story = {
  args: {
    onConfirmBooking: async (ownerDetails, pets, totalAmounts) => ({ success: true, bookingId: 'test-123' }),
    onClose: () => { },
    unavailableDates: mockUnavailability.dates,
    unavailableTimes: mockUnavailability.times,
  },
};

export const WithPrefilledData: Story = {
  args: {
    onConfirmBooking: async () => ({ success: true } as BookingResult),
    onClose: () => { },
    unavailableDates: [],
    unavailableTimes: [],
  },
};

export const WithUnavailability: Story = {
    args: {
        onConfirmBooking: async (ownerDetails, pets, totalAmounts) => ({ success: true, bookingId: 'test-123' }),
        onClose: () => {},
        unavailableDates: [
            new Date('2025-06-15'),
            new Date('2025-06-16'),
        ],
        unavailableTimes: ['09:00', '10:00', '14:00']
    }
};