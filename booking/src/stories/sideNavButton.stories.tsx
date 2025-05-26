import { Meta, StoryObj } from "@storybook/react";
import { SideNavButtonProps } from "@/_components/SideNavButton";
import SideNavButton from "@/_components/SideNavButton";
import { fn } from "@storybook/test";
import { FaNode } from "react-icons/fa";

const meta = {
    title: "SideNavButton",
    component: SideNavButton,
    parameters: {
        layout: "centered"
    },
    args: {
        onClick: fn()
    }
} satisfies Meta<typeof SideNavButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const defaultSetup: Story = {
    args: {
        icon: FaNode,
        text: "Button",
        isCurrent: false,
        color: "gray",
    }
}

export const CustomerSideCurrentTrue: Story = {
    args: {
        icon: FaNode,
        text: "Button",
        isCurrent: true,
        color: "purple",
    }
}

export const AdminSideCurrentTrue: Story = {
    args: {
        icon: FaNode,
        text: "Button",
        isCurrent: true,
        color: "gray",
    }
}

export const TextHidden: Story = {
    args: {
        icon: FaNode,
        text: "Button",
        isCurrent: false,
        color: "gray",
        showText: false,
        overrideWindowSizeConstraint: true,
        
    }
}
export const CustomerSideTextHiddenCurrentTrue: Story = {
    args: {
        icon: FaNode,
        text: "Button",
        isCurrent: true,
        color: "gray",
        showText: false,
        overrideWindowSizeConstraint: true,
        
    }
    
}

export const AdminSideTextHiddenCurrentTrue: Story = {
    args: {
        icon: FaNode,
        text: "Button",
        isCurrent: true,
        color: "purple",
        showText: false,
        overrideWindowSizeConstraint: true,
        
    }
    
}