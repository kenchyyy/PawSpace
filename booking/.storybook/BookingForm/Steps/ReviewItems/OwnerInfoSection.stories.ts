import type { Meta, StoryObj } from '@storybook/react';
import OwnerInfoSection from '../../../../src/_components/Booking Form/Steps/ReviewItems/OwnerInfoSection';
import { mockOwner } from '../../utils/mockData';

const meta: Meta<typeof OwnerInfoSection> = {
  title: 'BookingForm/Steps/ReviewItems/OwnerInfoSection',
  component: OwnerInfoSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OwnerInfoSection>;

export const FilledInfo: Story = {
  args: {
    ownerDetails: mockOwner,
  },
};

export const MinimalInfo: Story = {
  args: {
    ownerDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      contact_number: '09123456789',
      address: '123 Test St',
    },
  },
};
