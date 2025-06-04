import type { Meta, StoryObj } from '@storybook/react';
import ErrorMessage from '../../../../src/_components/Booking Form/Steps/ReviewItems/ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'BookingForm/Steps/ReviewItems/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
  args: {
    message: 'An error occurred while processing your request.',
  },
};

export const ValidationError: Story = {
  args: {
    message: 'Please fill in all required fields.',
  },
};

export const ServerError: Story = {
  args: {
    message: 'Server is currently unavailable. Please try again later.',
  },
};
