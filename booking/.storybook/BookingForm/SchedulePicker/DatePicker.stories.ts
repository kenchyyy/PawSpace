// DatePicker.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from '../../../src/_components/Booking Form/Schedule Picker/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'BookingForm/SchedulePicker/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    selectedDate: null,
    onChange: (date) => console.log('Date selected:', date),
    unavailableDates: [],
    minDate: new Date('2025-06-05'),
  },
};

export const WithSelectedDate: Story = {
  args: {
    selectedDate: new Date('2025-06-10'),
    onChange: (date) => console.log('Date selected:', date),
    unavailableDates: [],
    minDate: new Date('2025-06-05'),
  },
};

export const WithUnavailableDates: Story = {
  args: {
    selectedDate: new Date('2025-06-10'),
    onChange: (date) => console.log('Date selected:', date),
    unavailableDates: [
      new Date('2025-06-15'),
      new Date('2025-06-16'),
      new Date('2025-06-17'),
    ],
    minDate: new Date('2025-06-05'),
  },
};