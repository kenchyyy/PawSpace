import { Meta, StoryFn } from '@storybook/react'; // Using StoryFn now
import ServiceDetailsModal, { ServiceDetails } from './ServiceDetailsModal';

export default {
  title: 'Modals/ServiceDetailsModal',
  component: ServiceDetailsModal,
} as Meta;

const sampleDetails: ServiceDetails = {
  title: 'Grooming',
  inclusions: ['Shampoo', 'Nail Clipping', 'Haircut'],
  prices: [
    { size: 'Small', price: 250 },
    { size: 'Medium', price: 300 },
    { size: 'Large', price: 350 },
  ],
};

const sampleBoardingDetails: ServiceDetails = {
  title: 'Boarding',
  inclusions: ['Daily Walks', 'Comfortable Beds', 'Playtime'],
  prices: { allSizes: 500 },
  serviceType: 'boarding',
};

const sampleTrainingDetails: ServiceDetails = {
  title: 'Training',
  inclusions: ['Basic Commands', 'Socialization', 'Advanced Techniques'],
  prices: [
    { size: 'Small', price: 1000 },
    { size: 'Medium', price: 1200 },
    { size: 'Large', price: 1500 },
  ],
  serviceType: 'training',
};

const sampleWellnessDetails: ServiceDetails = {
  title: 'Wellness Check',
  inclusions: ['Health Checkup', 'Vaccination', 'Flea Treatment'],
  prices: { allSizes: 400 },
  serviceType: 'wellness',
};

// Template to create each modal story
const Template: StoryFn<{ details: ServiceDetails | null; isOpen: boolean; onClose: () => void }> = (args) => (
  <ServiceDetailsModal {...args} />
);

export const DefaultGrooming = Template.bind({});
DefaultGrooming.args = {
  isOpen: true,
  onClose: () => console.log('Closed Grooming Modal'),
  details: sampleDetails,
};

export const BoardingService = Template.bind({});
BoardingService.args = {
  isOpen: true,
  onClose: () => console.log('Closed Boarding Modal'),
  details: sampleBoardingDetails,
};

export const TrainingService = Template.bind({});
TrainingService.args = {
  isOpen: true,
  onClose: () => console.log('Closed Training Modal'),
  details: sampleTrainingDetails,
};

export const WellnessService = Template.bind({});
WellnessService.args = {
  isOpen: true,
  onClose: () => console.log('Closed Wellness Modal'),
  details: sampleWellnessDetails,
};
