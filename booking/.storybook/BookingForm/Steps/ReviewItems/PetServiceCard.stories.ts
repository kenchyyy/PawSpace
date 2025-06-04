import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import PetServiceCard from '../../../../src/_components/Booking Form/Steps/ReviewItems/PetServiceCard';
import { mockBoardingPet, mockGroomingPet } from '../../utils/mockData';

const meta: Meta<typeof PetServiceCard> = {
    title: 'BookingForm/Steps/ReviewItems/PetServiceCard',
    component: PetServiceCard,
    parameters: {
        layout: 'padded',
        a11y: {
            config: {
                rules: [
                    { id: 'color-contrast', enabled: true },
                    { id: 'heading-order', enabled: true }
                ]
            }
        }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PetServiceCard>;

export const BoardingService: Story = {
  args: {
    pet: {
      ...mockBoardingPet,
      service_type: 'boarding',
      boarding_type: 'overnight',
      check_in_date: new Date('2025-06-10'),
      check_in_time: '09:00',
      check_out_date: new Date('2025-06-12'),
      check_out_time: '17:00',
      room_size: 'medium',
    },
    index: 0,
    priceDetails: {
      basePrice: 600,
      total: 1200,
      discount: 0,
      surcharge: 0,
    },
    isBoarding: true,
    surchargeAmount: 0,
    surchargeNote: '',
  },
};

export const GroomingService: Story = {
  args: {
    pet: {
      ...mockGroomingPet,
      service_type: 'grooming',
      service_variant: 'basic',
      service_date: new Date('2025-06-15'),
      service_time: '14:00',
    },
    index: 0,
    priceDetails: {
      basePrice: 400,
      total: 400,
      discount: 0,
      surcharge: 0,
    },
    isBoarding: false,
    surchargeAmount: 0,
    surchargeNote: '',
  },
};

export const BoardingWithDiscount: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            check_out_date: new Date('2025-06-25'), // 15 days stay
        },
        index: 0,
        priceDetails: {
            basePrice: 600,
            total: 7200,
            discount: 0.2, // 20% discount
            surcharge: 0,
        },
        isBoarding: true,
        surchargeAmount: 0,
        surchargeNote: '',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const discountElement = canvas.getByText(/20% discount/i);
        expect(discountElement).toBeInTheDocument();
    }
};

export const WithSurcharge: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            check_in_time: '06:00', // Early check-in
        },
        index: 0,
        priceDetails: {
            basePrice: 600,
            total: 800,
            discount: 0,
            surcharge: 200,
        },
        isBoarding: true,
        surchargeAmount: 200,
        surchargeNote: 'Early check-in fee',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const surchargeElement = canvas.getByText(/Early check-in fee/i);
        expect(surchargeElement).toBeInTheDocument();
    }
};

export const ComplexPricing: Story = {
    args: {
        pet: {
            ...mockBoardingPet,
            check_out_date: new Date('2025-06-25'),
            check_in_time: '06:00',
        },
        index: 0,
        priceDetails: {
            basePrice: 600,
            total: 7400,
            discount: 0.2,
            surcharge: 200,
        },
        isBoarding: true,
        surchargeAmount: 200,
        surchargeNote: 'Early check-in fee',
    }
};

export const DeluxeGrooming: Story = {
    args: {
        pet: {
            ...mockGroomingPet,
            service_variant: 'deluxe',
            size: 'large',
        },
        index: 0,
        priceDetails: {
            basePrice: 600,
            total: 600,
            discount: 0,
            surcharge: 0,
        },
        isBoarding: false,
        surchargeAmount: 0,
        surchargeNote: '',
    }
};

export const Mobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    },
    args: {
        pet: mockGroomingPet,
        index: 0,
        priceDetails: {
            basePrice: 450,
            total: 450,
            discount: 0,
            surcharge: 0,
        },
        isBoarding: false,
        surchargeAmount: 0,
        surchargeNote: '',
    }
};
