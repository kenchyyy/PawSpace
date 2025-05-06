import type { Meta, StoryObj } from '@storybook/react';
import GroomingServiceCard from './GroomingServiceCard';

const meta: Meta<typeof GroomingServiceCard> = {
  title: 'Components/GroomingServiceCard',
  component: GroomingServiceCard,
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
type Story = StoryObj<typeof GroomingServiceCard>;

export const DogGrooming: Story = {
  name: 'Dog Grooming',
  args: {
    label: 'Dog Grooming',
    bgColor: 'bg-blue-100',
    inclusions: [
      { name: 'Bath', icon: '🛁' },
      { name: 'Haircut', icon: '✂️' },
      { name: 'Nail Trim', icon: '🐾' },
    ],
    prices: {
      Teacup: 250,
      Small: 300,
      Medium: 400,
      Large: 500,
      XL: 600,
    },
  },
};

export const CatGrooming: Story = {
  name: 'Cat Grooming',
  args: {
    label: 'Cat Grooming',
    bgColor: 'bg-pink-100',
    inclusions: [
      { name: 'Gentle Bath', icon: '🧼' },
      { name: 'Fur Brushing', icon: '🪮' },
      { name: 'Ear Cleaning', icon: '👂' },
    ],
    prices: {
      Standard: 450,
    },
  },
};

export const Disconnected: Story = {
  name: 'No Internet / Offline',
  args: {
    label: 'Dog Grooming',
    bgColor: 'bg-gray-200',
    inclusions: [],
    prices: {
      Teacup: 0,
      Small: 0,
      Medium: 0,
      Large: 0,
      XL: 0,
    },
    isOffline: true,
  },
  render: (args) => (
    <div className="relative">
      <GroomingServiceCard {...args} />
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">⚠️ No Internet Connection</p>
          <p className="text-sm text-gray-600">Features are currently unavailable.</p>
        </div>
      </div>
    </div>
  ),
};

