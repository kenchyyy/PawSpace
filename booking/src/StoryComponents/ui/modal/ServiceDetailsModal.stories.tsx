import type { Meta, StoryObj } from "@storybook/react";
import ServiceDetailsModal from "@/_components/Services/ServiceDetailsModal";
import { serviceDetailsMap } from "@/_components/Services/data/serviceData";

const meta: Meta<typeof ServiceDetailsModal> = {
  title: "Modals/ServiceDetailsModal",
  component: ServiceDetailsModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ServiceDetailsModal>;

export const DogBoarding: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    onClick: (category) => console.log("Book Now clicked for:", category),
    details: serviceDetailsMap.Dog,
  },
};

export const CatBoarding: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    onClick: (category) => console.log("Book Now clicked for:", category),
    details: serviceDetailsMap.Cat,
  },
};

export const BasicGrooming: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    onClick: (category) => console.log("Book Now clicked for:", category),
    details: serviceDetailsMap.Basic,
  },
};

export const DeluxeGrooming: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    onClick: (category) => console.log("Book Now clicked for:", category),
    details: serviceDetailsMap.Deluxe,
  },
};

export const CatGrooming: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    onClick: (category) => console.log("Book Now clicked for:", category),
    details: serviceDetailsMap.Cats,
  },
};
