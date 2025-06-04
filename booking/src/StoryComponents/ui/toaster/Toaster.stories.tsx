import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ToastMessage from '@/_components/BookingHistory/ToastMessage';

const meta: Meta<typeof ToastMessage> = {
  title: 'Components/ToastMessage',
  component: ToastMessage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative h-screen bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type ToastMessageStory = StoryObj<typeof ToastMessage>;

export const SuccessToast: ToastMessageStory = {
  name: 'Success Toast',
  args: {
    show: true,
    message: 'Booking submitted successfully!',
    type: 'success',
  },
};

export const ErrorToast: ToastMessageStory = {
  name: 'Error Toast',
  args: {
    show: true,
    message: 'Oops! Something went wrong.',
    type: 'error',
  },
};
