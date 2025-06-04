import type { Meta, StoryObj } from '@storybook/react';
import { AddBookingButton } from '@/_components/Services/Button';
import ViewServicesButton from '@/_components/Services/ViewServicesButton';
import CancelBookingButton from '@/_components/BookingHistory/CancelBookingButton';

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

// --- Book Now Button ---
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

type CancelBookingButtonStory = StoryObj<typeof CancelBookingButton>;

export const CanCancel: CancelBookingButtonStory = {
  name: 'Can Cancel Booking',
  render: () => (
    <CancelBookingButton
      isSubmitting={false}
      isDisabled={false}
      onClick={() => alert('Booking cancelled!')}
      pastBooking={false}
      checkInLessThan3Days={false}
    />
  ),
};

export const CannotCancelPastBooking: CancelBookingButtonStory = {
  name: 'Cannot Cancel - Past Booking',
  render: () => (
    <CancelBookingButton
      isSubmitting={false}
      isDisabled={true}
      onClick={() => {}}
      pastBooking={true}
      checkInLessThan3Days={false}
    />
  ),
};

export const CannotCancelLessThan3Days: CancelBookingButtonStory = {
  name: 'Cannot Cancel - Less than 3 Days',
  render: () => (
    <CancelBookingButton
      isSubmitting={false}
      isDisabled={true}
      onClick={() => {}}
      pastBooking={false}
      checkInLessThan3Days={true}
    />
  ),
};