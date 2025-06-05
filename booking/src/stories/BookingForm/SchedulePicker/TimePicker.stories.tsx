// TimePicker.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import TimePicker from '../../../_components/Booking Form/Schedule Picker/TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'BookingForm/SchedulePicker/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  args: {
    selectedTime: '',
    onChange: (time) => console.log('Time selected:', time),
    unavailableTimes: [],
    disabled: false,
  },
};

export const WithSelectedTime: Story = {
  args: {
    selectedTime: '10:00',
    onChange: (time) => console.log('Time selected:', time),
    unavailableTimes: [],
    disabled: false,
  },
};

export const WithUnavailableTimes: Story = {
  args: {
    selectedTime: '10:00',
    onChange: (time) => console.log('Time selected:', time),
    unavailableTimes: ['09:00', '11:00', '14:00'],
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    selectedTime: '',
    onChange: (time) => console.log('Time selected:', time),
    unavailableTimes: [],
    disabled: true,
  },
};