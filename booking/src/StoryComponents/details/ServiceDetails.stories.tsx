import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import ServiceDetails from '@/_components/BookingHistory/ServiceDetails';
import { Pet } from '@/_components/BookingHistory/types/bookingRecordType';

export default {
  title: 'Components/ServiceDetails',
  component: ServiceDetails,
} as Meta;

const Template: StoryFn<{
  cancellationReason: string;
  pets: Pet[];
  specialRequests: string;
}> = (args) => <ServiceDetails {...args} />;

const samplePets: Pet[] = [
  {
    pet_uuid: 'uuid1',
    name: 'Fluffy',
    pet_type: 'Dog',
    age: 4,
    breed: 'Golden Retriever',
    size: 'Large',
    vaccinated: true,
    vitamins_or_medications: 'None',
    allergies: 'None',
    groom_service: { service_variant: 'Full Groom' },
    boarding_pet: {
      boarding_type: 'overnight',
      room_size: 'Large',
      meal_instructions: [],
    },
  },
  {
    pet_uuid: 'uuid2',
    name: 'Whiskers',
    pet_type: 'Cat',
    age: 3,
    breed: 'Siamese',
    size: 'Medium',
    vaccinated: true,
    vitamins_or_medications: 'Fish oil',
    allergies: 'None',
    groom_service: undefined,
    boarding_pet: {
      boarding_type: 'day',
      room_size: 'Small',
      meal_instructions: [],
    },
  },
];

export const Default = Template.bind({});
Default.args = {
  cancellationReason: 'Owner is sick',
  pets: samplePets,
  specialRequests: 'Please be gentle with Whiskers.',
};

export const NoCancellation = Template.bind({});
NoCancellation.args = {
  cancellationReason: '',
  pets: samplePets,
  specialRequests: '',
};

export const NoPets = Template.bind({});
NoPets.args = {
  cancellationReason: '',
  pets: [],
  specialRequests: 'No special requests',
};
