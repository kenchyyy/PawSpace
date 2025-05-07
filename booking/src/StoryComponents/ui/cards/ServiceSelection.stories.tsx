import ServiceSection from './ServiceSelection';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ServiceSection> = {
  title: 'Components/ServiceSection',
  component: ServiceSection,
  decorators: [
    (Story) => (
      <div className="p-6 bg-gray-50">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServiceSection>;

export const GroomingServices: Story = {
  name: 'Grooming Services',
  args: {
    title: 'Grooming',
    columns: 3,
    services: [
      { label: 'Basic Groom', icon: '✂️', bgColor: 'bg-pink-200', glow: true },
      { label: 'Premium Spa', icon: '🛁', bgColor: 'bg-purple-200' },
      { label: 'Nail Trim', icon: '🐾', bgColor: 'bg-yellow-100', glow: true },
      { label: 'De-shedding', icon: '🧼', bgColor: 'bg-blue-200' },
      { label: 'Blow Dry', icon: '💨', bgColor: 'bg-green-200' },
      { label: 'Ear Cleaning', icon: '👂', bgColor: 'bg-cyan-200', glow: true },
    ],
  },
};

export const BoardingServices: Story = {
  name: 'Boarding Services',
  args: {
    title: 'Boarding',
    columns: 2,
    services: [
      { label: 'Overnight Stay', icon: '🏨', bgColor: 'bg-blue-200' },
      { label: 'Daycare', icon: '🧸', bgColor: 'bg-yellow-200', glow: true },
      { label: 'Luxury Suite', icon: '💎', bgColor: 'bg-pink-200' },
    ],
  },
};

export const TrainingServices: Story = {
  name: 'Training Services',
  args: {
    title: 'Training',
    columns: 4,
    services: [
      { label: 'Puppy Class', icon: '🎓', bgColor: 'bg-green-200' },
      { label: 'Obedience', icon: '🐶', bgColor: 'bg-red-200' },
      { label: 'Agility', icon: '🏃‍♀️', bgColor: 'bg-orange-200', glow: true },
      { label: 'Trick Training', icon: '🎩', bgColor: 'bg-purple-200' },
      { label: 'Behavioral', icon: '🐾', bgColor: 'bg-teal-200' },
    ],
  },
};

export const WellnessServices: Story = {
  name: 'Wellness Services',
  args: {
    title: 'Wellness',
    columns: 3,
    services: [
      { label: 'Health Check', icon: '🩺', bgColor: 'bg-blue-100', glow: true },
      { label: 'Flea Treatment', icon: '🐜', bgColor: 'bg-yellow-100' },
      { label: 'Vaccinations', icon: '💉', bgColor: 'bg-green-100' },
      { label: 'Teeth Cleaning', icon: '🪥', bgColor: 'bg-orange-100', glow: true },
      { label: 'Microchipping', icon: '📍', bgColor: 'bg-red-100' },
    ],
  },
};
