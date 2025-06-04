import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import PetList from '../../../src/_components/Booking Form/Form Components/PetList';
import { mockBoardingPet, mockGroomingPet } from '../utils/mockData';

const meta: Meta<typeof PetList> = {
    title: 'Form Components/PetList',
    component: PetList,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PetList>;

export const EmptyList: Story = {
    args: {
        pets: [],
        currentPetIndex: -1,
        onEdit: () => {},
        onRemove: () => {}
    }
};

export const SinglePet: Story = {
    args: {
        pets: [mockBoardingPet],
        currentPetIndex: 0,
        onEdit: () => {},
        onRemove: () => {}
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const editButton = canvas.getByTitle('Edit');
        await userEvent.click(editButton);
    }
};

export const MultiplePets: Story = {
    args: {
        pets: [mockBoardingPet, mockGroomingPet],
        currentPetIndex: 0,
        onEdit: () => {},
        onRemove: () => {}
    }
};

export const WithCompletedPets: Story = {
    args: {
        pets: [
            { ...mockBoardingPet, completed: true },
            { ...mockGroomingPet, completed: false }
        ],
        currentPetIndex: 1,
        onEdit: () => {},
        onRemove: () => {}
    }
};

export const LongList: Story = {
    args: {
        pets: Array(5).fill(null).map((_, index) => ({
            ...mockBoardingPet,
            id: `pet-${index}`,
            name: `Pet ${index + 1}`
        })),
        currentPetIndex: 0,
        onEdit: () => {},
        onRemove: () => {}
    },
    parameters: {
        chromatic: { viewports: [320, 768] }
    }
};

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    },
    args: {
        pets: [mockBoardingPet, mockGroomingPet],
        currentPetIndex: 0,
        onEdit: () => {},
        onRemove: () => {}
    }
};
