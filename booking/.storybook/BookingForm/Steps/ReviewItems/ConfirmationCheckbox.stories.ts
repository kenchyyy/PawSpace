import type { Meta, StoryObj } from '@storybook/react';
import ConfirmationCheckbox from '../../../../src/_components/Booking Form/Steps/ReviewItems/ConfirmationCheckox';

const meta: Meta<typeof ConfirmationCheckbox> = {
  title: 'BookingForm/Steps/ReviewItems/ConfirmationCheckbox',
  component: ConfirmationCheckbox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmationCheckbox>;

export const Default: Story = {
  args: {
    confirmedInfo: false,
    onConfirmChange: (checked) => console.log('Confirmation changed:', checked),
    errors: {},
    serviceType: 'boarding',
  },
};

export const Checked: Story = {
  args: {
    confirmedInfo: true,
    onConfirmChange: (checked) => console.log('Confirmation changed:', checked),
    errors: {},
    serviceType: 'grooming',
  },
};

export const WithError: Story = {
  args: {
    confirmedInfo: false,
    onConfirmChange: (checked) => console.log('Confirmation changed:', checked),
    errors: {
      confirmation: 'Please confirm that you agree to the terms and policies',
    },
    serviceType: 'boarding',
  },
};
