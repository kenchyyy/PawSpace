import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import BookingForm from '../../_components/Booking Form/BookingForm';
import { Booking, OwnerDetails, Pet } from '../../_components/Booking Form/types';

export default {
  title: 'Booking/BookingForm',
  component: BookingForm,
} as Meta<typeof BookingForm>;

const Template: StoryFn<typeof BookingForm> = (args) => <BookingForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  onConfirmBooking: (bookings: Booking[]) => console.log('Bookings confirmed:', bookings),
  onClose: () => console.log('Form closed'),
};

export const WithInitialData = Template.bind({});
WithInitialData.args = {
  onConfirmBooking: (bookings: Booking[]) => console.log('Bookings confirmed:', bookings),
  onClose: () => console.log('Form closed'),
  initialOwnerDetails: {
    name: 'Jane Smith',
    address: '456 Oak Ave',
    contactNumber: '09987654321'
  } as OwnerDetails,
  initialPets: [
    {
      id: 1,
      name: 'Max',
      type: 'dog',
      breed: 'Golden Retriever',
      vaccinated: 'Yes',
      size: 'medium',
      serviceType: 'grooming',
      serviceVariant: 'basic',
      serviceDate: null,
      serviceTime: '',
      vitaminsOrMedications: '',
      allergies: '',
      mealTime: '8:00 AM, 6:00 PM',
      specialRequests: 'Please be gentle, he gets nervous',
      completed: true
    } as Pet
  ]
};

