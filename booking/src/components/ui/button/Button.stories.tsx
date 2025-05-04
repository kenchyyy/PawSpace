import { AddBookingButton } from './Button';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AddBookingButton> = {
  title: 'Components/AddBookingButton',
  component: AddBookingButton,
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof AddBookingButton>;

export const PurpleGradient: Story = {
  name: 'Default Gradient (Medium)',
  args: {
    variant: 'default',
    size: 'md',
  },
};

export const RoseLarge: Story = {
  name: 'Romantic Rose (Large)',
  args: {
    variant: 'rose',
    size: 'lg',
    children: 'Reserve a Stay',
  },
};

export const AquaSmall: Story = {
  name: 'Aqua Fresh (Small)',
  args: {
    variant: 'aqua',
    size: 'sm',
    children: 'Quick Book',
    withIcon: false,
  },
};

export const GoldLuxury: Story = {
  name: 'Gold Luxury (Large)',
  args: {
    variant: 'gold',
    size: 'lg',
    children: 'VIP Booking',
  },
};
