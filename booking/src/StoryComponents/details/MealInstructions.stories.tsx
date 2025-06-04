import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import MealInstructions from '@/_components/BookingHistory/MealInstructions';
import { Pet } from '@/_components/BookingHistory/types/bookingRecordType';

export default {
  title: 'Components/MealInstructions',
  component: MealInstructions,
} as Meta;

const Template: StoryFn<{ pets: Pet[] }> = (args) => <MealInstructions {...args} />;

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
    boarding_pet: {
      boarding_type: 'overnight',
      room_size: 'Large',
      meal_instructions: [
        { id: 'm1', meal_type: 'breakfast', time: '08:00', food: 'Kibble', notes: 'Mix with water' },
        { id: 'm2', meal_type: 'lunch', time: '12:00', food: 'Chicken', notes: '' },
        { id: 'm3', meal_type: 'dinner', time: '18:00', food: 'Beef', notes: 'No bones' },
        { id: 'm4', meal_type: 'other', time: '15:00', food: 'Treat', notes: 'Small portion' },
      ],
    },
    groom_service: undefined,
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
    boarding_pet: {
      boarding_type: 'day',
      room_size: 'Small',
      meal_instructions: [],
    },
    groom_service: undefined,
  },
];

export const Default = Template.bind({});
Default.args = {
  pets: samplePets,
};

export const NoMealInstructions = Template.bind({});
NoMealInstructions.args = {
  pets: [
    {
      pet_uuid: 'uuid3',
      name: 'Buddy',
      pet_type: 'Dog',
      age: 5,
      breed: 'Beagle',
      size: 'Medium',
      vaccinated: true,
      vitamins_or_medications: 'None',
      allergies: 'None',
      boarding_pet: {
        boarding_type: 'day',
        room_size: 'Medium',
        meal_instructions: [],
      },
      groom_service: undefined,
    },
  ],
};
