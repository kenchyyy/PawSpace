import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import StepIndicator from '../../../_components/Booking Form/Form Components/StepIndicator';

const meta: Meta<typeof StepIndicator> = {
    title: 'Form Components/StepIndicator',
    component: StepIndicator,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StepIndicator>;

export const CustomerStep: Story = {
    args: {
        currentStep: 'customer',
        serviceType: 'boarding',
        completedSteps: [],
        onStepClick: () => {}
    }
};

export const PetStepWithCompletedCustomer: Story = {
    args: {
        currentStep: 'pet',
        serviceType: 'boarding',
        completedSteps: ['customer'],
        onStepClick: () => {}
    }
};

export const ReviewStepGrooming: Story = {
    args: {
        currentStep: 'review',
        serviceType: 'grooming',
        completedSteps: ['customer', 'pet'],
        onStepClick: () => {}
    }
};
