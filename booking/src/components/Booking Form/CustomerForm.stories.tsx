import React from 'react';
import { StoryFn, Meta } from '@storybook/react'; 
import CustomerForm from '../../_components/Booking Form/CustomerForm'; 

export default {
  title: 'Booking/CustomerForm',
  component: CustomerForm,
} as Meta<typeof CustomerForm>; 

const Template: StoryFn<typeof CustomerForm> = (args) => <CustomerForm {...args} />; 

export const Empty = Template.bind({});
Empty.args = {
  ownerDetails: {
    name: '',
    address: '',
    contactNumber: ''
  },
  onChange: () => {},
  onNext: () => {},
  errors: {}
};

export const WithErrors = Template.bind({});
WithErrors.args = {
  ...Empty.args,
  errors: {
    name: 'Name is required',
    contactNumber: 'Invalid phone number',
    address: 'Address too short'
  }
};