import type { Meta, StoryObj } from '@storybook/react';
import PriceDetailsDisplay from '../../../../src/_components/Booking Form/Steps/ReviewItems/PriceDetailsDisplay';

const meta: Meta<typeof PriceDetailsDisplay> = {
    title: 'BookingForm/Steps/ReviewItems/PriceDetailsDisplay',
    component: PriceDetailsDisplay,
    parameters: {
        layout: 'padded'
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PriceDetailsDisplay>;

export const StandardPrice: Story = {
    args: {
        priceDetails: {
            basePrice: 450,
            total: 450,
            discount: 0,
            surcharge: 0
        }
    }
};

export const WithDiscount: Story = {
    args: {
        priceDetails: {
            basePrice: 600,
            total: 480,
            discount: 0.2,
            surcharge: 0
        }
    }
};

export const WithSurcharge: Story = {
    args: {
        priceDetails: {
            basePrice: 450,
            total: 650,
            discount: 0,
            surcharge: 200
        }
    }
};

export const ComplexPricing: Story = {
    args: {
        priceDetails: {
            basePrice: 600,
            total: 680,
            discount: 0.2,
            surcharge: 200
        }
    }
};
