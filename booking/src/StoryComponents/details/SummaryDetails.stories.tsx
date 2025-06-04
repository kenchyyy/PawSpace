import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import BookingSummary from '@/_components/BookingHistory/BookingSummary';

export default {
  title: 'Components/BookingSummary',
  component: BookingSummary,
} as Meta;

interface BookingSummaryProps {
  discountApplied: number | null | undefined;
  totalAmount: number | string | null | undefined;
}

const Template: StoryFn<BookingSummaryProps> = (args) => <BookingSummary {...args} />;

export const DiscountAndTotal = Template.bind({});
DiscountAndTotal.args = {
  discountApplied: 15,
  totalAmount: 2500,
};

export const TotalAmountAsString = Template.bind({});
TotalAmountAsString.args = {
  discountApplied: 10,
  totalAmount: 1000,
};

export const NoDiscount = Template.bind({});
NoDiscount.args = {
  discountApplied: 0,
  totalAmount: 1500,
};

export const NullDiscountAndTotal = Template.bind({});
NullDiscountAndTotal.args = {
  discountApplied: null,
  totalAmount: null,
};


