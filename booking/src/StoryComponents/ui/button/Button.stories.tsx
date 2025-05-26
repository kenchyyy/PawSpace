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

export const Default: Story = {
  name: 'Default Button',
  args: {
    variant: 'default',
    size: 'md',
    children: 'Book Now',
  },
};

export const Disabled: Story = {
  name: 'Disabled Button',
  args: {
    variant: 'default',
    size: 'md',
    children: 'Book Now',
    disabled: true,
  },
};
