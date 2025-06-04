import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import PetDetails from '@/_components/BookingHistory/PetDetails';
import { Pet } from '@/_components/BookingHistory/types/bookingRecordType';

export default {
  title: 'Components/PetDetails',
  component: PetDetails,
} as Meta;

const Template: StoryFn<{ pets: Pet[] }> = (args) => <PetDetails {...args} />;

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
    groom_service: undefined,
    boarding_pet: undefined,
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
    boarding_pet: undefined,
  },
];

export const Default = Template.bind({});
Default.args = {
  pets: samplePets,
};

export const NoPets = Template.bind({});
NoPets.args = {
  pets: [],
};
