import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import PoliciesModal from "@/_components/Services/PoliciesModal";
import { policyContent } from "@/_components/Services/data/policyData";

const meta: Meta<typeof PoliciesModal> = {
  title: "Components/PoliciesModal",
  component: PoliciesModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PoliciesModal>;
type PoliciesModalStoryArgs = {
  title: string;
  content: string[];
  linkLabel: string;
};

const Template = ({ title, content, linkLabel }: PoliciesModalStoryArgs) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen font-sans">
      <a
        href="#!"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="text-blue-400 hover:text-blue-500 text-base font-medium underline transition duration-300 ease-in-out"
      >
        {linkLabel}
      </a>

      <PoliciesModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        content={content}
      />
    </div>
  );
};

export const BoardingPolicies: Story = {
  render: () =>
    Template({
      title: policyContent.boarding.title,
      content: policyContent.boarding.content,
      linkLabel: "View Boarding Terms & Conditions",
    }),
};

export const GroomingWaiver: Story = {
  render: () =>
    Template({
      title: policyContent.grooming.title,
      content: policyContent.grooming.content,
      linkLabel: "View Grooming Waiver & Release",
    }),
};


