import type { Meta, StoryObj } from '@storybook/react';
import { AddBookingButton } from '@/_components/Services/Button';
import ViewServicesButton from '@/_components/Services/ViewServicesButton';

const meta: Meta = {
  title: 'Components/Buttons',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type AddBookingButtonStory = StoryObj<typeof AddBookingButton>;

export const BookNowButton: AddBookingButtonStory = {
  name: 'Book Now',
  render: () => (
    <AddBookingButton variant="default" size="md">
      Book Now
    </AddBookingButton>
  ),
};

type ViewServicesButtonStory = StoryObj<typeof ViewServicesButton>;

export const ServicesButton: ViewServicesButtonStory = {
  name: 'View Our Services',
  render: () => <ViewServicesButton />,
};
