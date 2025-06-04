// GroomingBookingForm.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import GroomingBookingForm from '../../../src/_components/Booking Form/Forms/GroomingBookingForm';
import { mockOwner, mockUnavailability } from '../utils/mockData';

const meta: Meta<typeof GroomingBookingForm> = {
  title: 'BookingForm/Forms/GroomingBookingForm',
  component: GroomingBookingForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GroomingBookingForm>;

export const Default: Story = {
  args: {
    onConfirmBooking: async (ownerDetails, pets, totalAmounts) => ({ success: true, bookingId: 'test-123' }),
    onClose: () => {},
    unavailableDates: mockUnavailability.dates,
    unavailableTimes: mockUnavailability.times,
  },
};

export const WithPrefilledData: Story = {
  args: {
    onConfirmBooking: async () => ({ success: true }),
    onClose: () => {},
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