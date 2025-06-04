import type { Meta, StoryObj } from "@storybook/react";
import ServiceCard from "@/_components/Services/ServiceCard";
import { FaDog, FaCat, FaStar } from "react-icons/fa";

const meta: Meta<typeof ServiceCard> = {
  title: "Components/ServiceCard",
  component: ServiceCard,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ServiceCard>;

const CenteredContainer = (args: React.ComponentProps<typeof ServiceCard>) => (
  <div className="flex justify-center text-white items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-4">
      <ServiceCard {...args} />
    </div>
  </div>
);

export const BasicGrooming: Story = {
  render: (args) => <CenteredContainer {...args} />,
  args: {
    label: "Basic",
    icon: (
      <div className="relative flex items-center justify-center h-full w-full overflow-hidden">
        <span className="absolute z-0 text-[12rem] text-orange-300">🐶</span>
        <span className="absolute z-20 text-white text-3xl md:text-4xl font-extrabold">Basic</span>
      </div>
    ),
    bgColor: "bg-orange-500",
    onClick: () => alert("Basic Grooming clicked!"),
  },
};

export const DeluxeGrooming: Story = {
  render: (args) => <CenteredContainer {...args} />,
  args: {
    label: "Deluxe",
    icon: (
      <div className="relative flex items-center justify-center h-full w-full overflow-hidden">
        <span className="absolute z-0 text-[12rem] text-lime-300">🐶</span>
        <span className="absolute z-20 text-white text-3xl md:text-4xl font-extrabold">Deluxe</span>
      </div>
    ),
    bgColor: "bg-lime-500",
    onClick: () => alert("Deluxe Grooming clicked!"),
  },
};

export const CatGrooming: Story = {
  render: (args) => <CenteredContainer {...args} />,
  args: {
    label: "Cat",
    icon: (
      <div className="relative flex items-center justify-center h-full w-full overflow-hidden">
        <span className="absolute z-0 text-[12rem] text-pink-300">🐱</span>
        <span className="absolute z-20 text-white text-3xl md:text-4xl font-extrabold">Platinum</span>
      </div>
    ),
    bgColor: "bg-pink-500",
    onClick: () => alert("Platinum Grooming clicked!"),
  },
};

export const AccommodationDog: Story = {
  render: (args) => <CenteredContainer {...args} />,
  args: {
    label: "Dog",
    icon: (
      <div className="relative flex items-center justify-center h-full w-full overflow-hidden">
        <FaStar className="relative text-orange-200 text-8xl z-0 animate-pulse" />
        <FaDog className="absolute text-orange-800 z-10 text-7xl" />
      </div>
    ),
    bgColor: "bg-orange-500",
    onClick: () => alert("Overnight Dog Boarding clicked!"),
  },
};

export const AccommodationCat: Story = {
  render: (args) => <CenteredContainer {...args} />,
  args: {
    label: "Cat",
    icon: (
      <div className="relative flex items-center justify-center h-full w-full overflow-hidden">
        <FaStar className="relative text-pink-200 text-8xl z-0 animate-pulse" />
        <FaCat className="absolute text-pink-800 z-10 text-7xl" />
      </div>
    ),
    bgColor: "bg-pink-500",
    onClick: () => alert("Overnight Cat Boarding clicked!"),
  },
};
