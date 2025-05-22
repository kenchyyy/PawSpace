import ServiceCard from './ServiceCard';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ServiceCard> = {
  title: 'Components/ServiceCard',
  component: ServiceCard,
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-slate-100">
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
type Story = StoryObj<typeof ServiceCard>;

export const Grooming: Story = {
  name: 'Grooming',
  args: {
    label: 'Grooming',
    icon: '✂️',
    bgColor: 'bg-pink-200',
    glow: true,
  },
};

export const Boarding: Story = {
  name: 'Boarding',
  args: {
    label: 'Boarding',
    icon: '🏨',
    bgColor: 'bg-blue-200',
    glow: false,
  },
};

export const Training: Story = {
  name: 'Training',
  args: {
    label: 'Training',
    icon: '🎓',
    bgColor: 'bg-green-200',
    glow: true,
  },
};

export const Daycare: Story = {
  name: 'Daycare',
  args: {
    label: 'Daycare',
    icon: '🧸',
    bgColor: 'bg-yellow-100',
    glow: false,
  },
};

export const Spa: Story = {
  name: 'Pet Spa',
  args: {
    label: 'Pet Spa',
    icon: '🛁',
    bgColor: 'bg-purple-200',
    glow: true,
  },
};
