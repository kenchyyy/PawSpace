// CustomerStep.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import CustomerStep from '../../../src/_components/Booking Form/Steps/CustomerStep';
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
  args: {
    ownerDetails: {
      name: '',
      email: 'invalid-email',
      address: '',
      contact_number: '',
    },
    onChange: (e) => console.log('Changed:', e.target.name, e.target.value),
    onNext: () => console.log('Next clicked'),
    isSubmitting: false,
    errors: {
      name: 'Name is required',
      email: 'Invalid email format',
      address: 'Address is required',
      contact_number: 'Contact number is required',
    },
  },
};