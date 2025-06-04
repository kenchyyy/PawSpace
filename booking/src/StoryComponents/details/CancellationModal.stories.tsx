import type { Meta, StoryObj } from '@storybook/react';
import CancellationModal from '@/_components/BookingHistory/CancellationModal';
import { useState } from 'react';

const meta: Meta<typeof CancellationModal> = {
  title: 'Components/Booking/CancellationModal',
  component: CancellationModal,
};

export default meta;

type Story = StoryObj<typeof CancellationModal>;

const VisibleModalComponent = () => {
  const [cancelMessage, setCancelMessage] = useState('I changed my mind.');
  return (
    <CancellationModal
      showCancelModal={true}
      cancelMessage={cancelMessage}
      setCancelMessage={setCancelMessage}
      isSubmittingCancel={false}
      closeCancelModal={() => alert('Closed modal')}
      handleConfirmCancelBooking={() => alert(`Cancelled: ${cancelMessage}`)}
    />
  );
};

export const VisibleModal: Story = {
  name: 'Visible Cancellation Modal',
  render: () => <VisibleModalComponent />,
};

const DisabledConfirmButtonComponent = () => {
  const [cancelMessage, setCancelMessage] = useState('');
  return (
    <CancellationModal
      showCancelModal={true}
      cancelMessage={cancelMessage}
      setCancelMessage={setCancelMessage}
      isSubmittingCancel={false}
      closeCancelModal={() => alert('Closed modal')}
      handleConfirmCancelBooking={() => alert('Should not trigger')}
    />
  );
};

export const DisabledConfirmButton: Story = {
  name: 'Confirm Disabled (Empty Reason)',
  render: () => <DisabledConfirmButtonComponent />,
};
