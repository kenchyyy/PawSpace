import type { Meta, StoryObj } from '@storybook/react';
import { GroomingPet } from '../../../../_components/Booking Form/types';
import GroomingPetDetailsDisplay from '../../../../_components/Booking Form/Steps/ReviewItems/GroomingDetailsDisplay';
import { mockGroomingPet } from '../../utils/mockData';

const meta: Meta<typeof GroomingPetDetailsDisplay> = {
    title: 'BookingForm/Steps/ReviewItems/GroomingPetDetailsDisplay',
    component: GroomingPetDetailsDisplay,
    parameters: {
        layout: 'padded',
        a11y: { disable: false }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GroomingPetDetailsDisplay>;

export const Default: Story = {
    args: {
        groomingPet: mockGroomingPet as GroomingPet
    }
};

export const DeluxeService: Story = {
    args: {
        groomingPet: {
            ...mockGroomingPet,
            service_variant: 'deluxe'
        } as GroomingPet
    }
};
