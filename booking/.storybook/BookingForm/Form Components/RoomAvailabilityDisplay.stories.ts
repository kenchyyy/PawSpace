import type { Meta, StoryObj } from '@storybook/react';
import RoomAvailabilityDisplay from '../../../src/_components/Booking Form/Form Components/RoomAvailabilityDisplay';
import { RoomSize } from '../../../src/_components/Booking Form/types';

const meta: Meta<typeof RoomAvailabilityDisplay> = {
  title: 'Form Components/RoomAvailabilityDisplay',
  component: RoomAvailabilityDisplay,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RoomAvailabilityDisplay>;

export const Available: Story = {
  args: {
    roomSize: 'small',
    checkIn: new Date('2025-06-10'),
    checkOut: new Date('2025-06-12'),
    checkInTime: '09:00',
    checkOutTime: '17:00',
  },
};

export const Unavailable: Story = {
  args: {
    roomSize: 'medium',
    checkIn: null,
    checkOut: null,
    checkInTime: '',
    checkOutTime: '',
  },
};

export const Loading: Story = {
  args: {
    roomSize: 'large' as RoomSize,
    checkIn: new Date('2025-06-15'),
    checkOut: new Date('2025-06-17'),
    checkInTime: '10:00',
    checkOutTime: '16:00',
  },
};
