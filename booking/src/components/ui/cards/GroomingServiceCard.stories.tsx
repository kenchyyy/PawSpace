import GroomingServiceCard from './GroomingServiceCard';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GroomingServiceCard> = {
  title: 'Components/GroomingServiceCard',
  component: GroomingServiceCard,
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-gray-100 p-6">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GroomingServiceCard>;

export const BasicGroom: Story = {
  name: 'Basic Groom',
  args: {
    label: 'Basic Groom',
    bgColor: 'bg-blue-100',
    inclusions: [
      { name: 'Bath', icon: '🛁' },
      { name: 'Brushing', icon: '🪥' },
      { name: 'Nail Trim', icon: '🐾' },
    ],
    prices: {
      Small: 250,
      Medium: 300,
      Large: 350,
      XL: 400,
      XXL: 450,
    },
  },
};

export const PremiumSpa: Story = {
  name: 'Premium Spa',
  args: {
    label: 'Premium Spa',
    bgColor: 'bg-pink-100',
    inclusions: [
      { name: 'Aromatherapy Bath', icon: '🧖‍♀️' },
      { name: 'Blow Dry', icon: '💨' },
      { name: 'Nail Polish', icon: '💅' },
      { name: 'Hair Trim', icon: '✂️' },
    ],
    prices: {
      Small: 450,
      Medium: 500,
      Large: 600,
      XL: 700,
      XXL: 800,
    },
  },
};

export const SummerCoolDown: Story = {
  name: 'Summer Cool Down',
  args: {
    label: 'Summer Cool Down',
    bgColor: 'bg-cyan-100',
    inclusions: [
      { name: 'Cooling Rinse', icon: '❄️' },
      { name: 'Ear Cleaning', icon: '👂' },
      { name: 'De-shedding', icon: '🧼' },
    ],
    prices: {
      Small: 300,
      Medium: 350,
      Large: 400,
      XL: 450,
      XXL: 500,
    },
  },
};

export const LuxuryRoyalBath: Story = {
  name: 'Luxury Royal Bath',
  args: {
    label: 'Luxury Royal Bath',
    bgColor: 'bg-yellow-100',
    inclusions: [
      { name: 'Champagne Rinse', icon: '🍾' },
      { name: 'Silk Wrap', icon: '🧣' },
      { name: 'Massage', icon: '💆‍♂️' },
      { name: 'Scented Finish', icon: '🌸' },
    ],
    prices: {
      Small: 650,
      Medium: 750,
      Large: 850,
      XL: 950,
      XXL: 1050,
    },
  },
};
