// CustomerStep.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';
import CustomerStep from '../../../_components/Booking Form/Steps/CustomerStep';
import { mockOwner } from '../utils/mockData';

const meta: Meta<typeof CustomerStep> = {
  title: 'BookingForm/Steps/CustomerStep',
  component: CustomerStep,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomerStep>;

export const Empty: Story = {
  args: {
    ownerDetails: {
      name: '',
      email: '',
      address: '',
      contact_number: '',
    },
    onChange: (e) => console.log('Changed:', e.target.name, e.target.value),
    onNext: () => console.log('Next clicked'),
    isSubmitting: false,
    errors: {},
  },
};

export const Filled: Story = {
  args: {
    ownerDetails: mockOwner,
    onChange: (e) => console.log('Changed:', e.target.name, e.target.value),
    onNext: () => console.log('Next clicked'),
    isSubmitting: false,
    errors: {},
  },
};

export const WithErrors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows form validation errors when fields are invalid',
      },
    },
  },
  args: {
    ownerDetails: {
      name: 'J',  // Invalid: too short
      email: 'notavalidemail', // Invalid format
      address: '123', // Invalid: too short
      contact_number: '123456789', // Invalid format
    },
    onChange: (e) => console.log('Changed:', e.target.name, e.target.value),
    onNext: () => console.log('Next clicked'),
    isSubmitting: false,
    errors: {
      name: 'Please enter your full name',
      email: 'Please enter a valid email address (e.g., example@gmail.com).',
      address: 'Make sure to input a complete address.',
      contact_number: 'Please enter a valid 11-digit Philippine mobile number (e.g., 09123456789).',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find all input fields
    const inputs = canvas.getAllByRole('textbox');
    
    // Simulate interactions with each input to trigger error display
    for (const input of inputs) {
      await userEvent.click(input);
      await userEvent.tab();
    }
  },
};