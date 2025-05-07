import { Meta, StoryObj } from '@storybook/react';
import PetStep from '../../_components/Booking Form/PetStep';
import { Pet } from '../../_components/Booking Form/types';

const meta: Meta<typeof PetStep> = {
  title: 'Components/PetStep',
  component: PetStep,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PetStep>;

const samplePet: Pet = {
  id: 1,
  name: 'Buddy',
  age: '5',
  type: 'dog',
  breed: 'Labrador',
  vaccinated: 'Yes',
  size: 'medium',
  vitaminsOrMedications: 'None',
  allergies: 'None',
  mealTime: '8:00 AM, 6:00 PM',
  specialRequests: 'Please be gentle',
  serviceType: 'grooming',
  serviceVariant: 'basic',
  serviceDate: new Date(),
  serviceTime: '10:00',
  completed: true
};

export const Default: Story = {
  args: {
    pets: [samplePet],
    currentPetIndex: 0,
    formErrors: {},
    onAddPet: () => {},
    onEditPet: () => {},
    onRemovePet: () => {},
    onPetChange: () => {},
    onScheduleChange: () => {},
    onBack: () => {},
    onNext: () => {},
    canAddNewPet: () => true
  }
};

export const WithMultiplePets: Story = {
  args: {
    ...Default.args,
    pets: [
      samplePet,
      {
        ...samplePet,
        id: 2,
        name: 'Whiskers',
        type: 'cat',
        breed: 'Siamese',
        serviceVariant: 'cat'
      }
    ]
  }
};

export const EmptyState: Story = {
  args: {
    ...Default.args,
    pets: [],
    currentPetIndex: -1
  }
};