import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import OwnerDetails from '@/_components/BookingHistory/OwnerDetails';
import { OwnerDetails as OwnerDetailsType } from '@/_components/BookingHistory/types/bookingRecordType';

export default {
  title: 'Components/OwnerDetails',
  component: OwnerDetails,
} as Meta;

const Template: StoryFn<{ ownerDetails: OwnerDetailsType | undefined }> = (args) => <OwnerDetails {...args} />;

export const Default = Template.bind({});
Default.args = {
  ownerDetails: {
    name: 'Jane Doe',
    address: '123 Pet Lane, Pawsville',
    contact_number: '+1234567890',
    email: 'jane.doe@example.com',
  },
};

export const NoDetails = Template.bind({});
NoDetails.args = {
  ownerDetails: undefined,
};
