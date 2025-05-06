import { Meta, StoryFn } from '@storybook/react';
import OvernightServiceCard, { OvernightServiceCardProps } from './OvernightServiceCard';

const meta: Meta<typeof OvernightServiceCard> = {
  title: 'Components/OvernightServiceCard',
  component: OvernightServiceCard,
  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<OvernightServiceCardProps> = (args) => (
  <div className="flex justify-center items-center h-screen">
    <OvernightServiceCard {...args} />
  </div>
);

export const DogOvernightCard = Template.bind({});
DogOvernightCard.args = {
  label: 'Dog Overnight Stay',
  icon: '🐶', // Dog emoji
  bgColor: 'bg-orange-500', // Example color
};

export const CatOvernightCard = Template.bind({});
CatOvernightCard.args = {
  label: 'Cat Overnight Stay',
  icon: '🐱', // Cat emoji
  bgColor: 'bg-pink-500', // Example color
};

export const DogOvernightCardDisconnected = Template.bind({});
DogOvernightCardDisconnected.args = {
  label: 'Dog Overnight Stay',
  icon: '🐶', // Dog emoji
  bgColor: 'bg-orange-500', // Example color
  isOffline: true, // Simulating no internet connection
};

export const CatOvernightCardDisconnected = Template.bind({});
CatOvernightCardDisconnected.args = {
  label: 'Cat Overnight Stay',
  icon: '🐱', // Cat emoji
  bgColor: 'bg-pink-500', // Example color
  isOffline: true, // Simulating no internet connection
};
