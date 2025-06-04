import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import BookingSuccessModal from '../../../../src/_components/Booking Form/Steps/ReviewItems/BookingSuccessModal';

const meta: Meta<typeof BookingSuccessModal> = {
    title: 'BookingForm/Steps/ReviewItems/BookingSuccessModal',
    component: BookingSuccessModal,
    parameters: {
        layout: 'centered',
        a11y: {
            config: {
                rules: [
                    { id: 'dialog', enabled: true },
                    { id: 'modal-focus', enabled: true }
                ]
            }
        }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BookingSuccessModal>;

export const Visible: Story = {
    args: {
        showSuccess: true,
        bookingId: 'BOOK-123-456',
        onClose: () => {}
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const modal = canvas.getByRole('dialog');
        expect(modal).toBeInTheDocument();
    }
};

export const Hidden: Story = {
    args: {
        showSuccess: false,
        bookingId: 'BOOK-123-456',
        onClose: () => {}
    }
};

export const LongBookingId: Story = {
    args: {
        showSuccess: true,
        bookingId: 'BOOK-123-456-789-VERY-LONG-ID',
        onClose: () => {}
    }
};

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    },
    args: {
        showSuccess: true,
        bookingId: 'BOOK-123-456',
        onClose: () => {}
    }
};
