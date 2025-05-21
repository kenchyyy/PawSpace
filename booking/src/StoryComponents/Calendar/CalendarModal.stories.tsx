import { Meta, StoryObj } from "@storybook/react";
import CalendarModal from "@/_components/Calendar/CalendarModal";
import { EventInput } from "@fullcalendar/core";

const meta: Meta<typeof CalendarModal> = {
  title: "Components/Calendar/CalendarModal",
  component: CalendarModal,
  args: {
    open: true,
    onOpenChange: (open: boolean) =>
      console.log("Modal open state changed:", open),
    event: {
      id: "1",
      title: "Buddy (Labrador) - Alice",
      start: new Date(),
      end: new Date(Date.now() + 3600000),
      extendedProps: {
        petName: "Buddy",
        petType: "Labrador",
        ownerName: "Alice",
        ownerPhone: "123-456-7890",
        ownerEmail: "alice@example.com",
        status: "confirmed",
        departure: new Date(Date.now() + 2 * 86400000).toISOString(),
        returnDate: new Date(Date.now() + 5 * 86400000).toISOString(),
        bookingNotes: "Special care instructions for Buddy.",
      },
      backgroundColor: "#10b981",
      borderColor: "#10b981",
    } as EventInput,
  },
};

export default meta;

type Story = StoryObj<typeof CalendarModal>;

export const Default: Story = {};

export const PendingStatus: Story = {
  args: {
    event: {
      ...Default.args?.event,
      extendedProps: {
        ...Default.args?.event?.extendedProps,
        status: "pending",
      },
      backgroundColor: "#f59e0b",
      borderColor: "#f59e0b",
    } as EventInput,
  },
};

export const CancelledStatus: Story = {
  args: {
    event: {
      ...Default.args?.event,
      extendedProps: {
        ...Default.args?.event?.extendedProps,
        status: "cancelled",
      },
      backgroundColor: "#ef4444",
      borderColor: "#ef4444",
    } as EventInput,
  },
};

export const CompletedStatus: Story = {
  args: {
    event: {
      ...Default.args?.event,
      extendedProps: {
        ...Default.args?.event?.extendedProps,
        status: "completed",
      },
      backgroundColor: "#3b82f6",
      borderColor: "#3b82f6",
    } as EventInput,
  },
};

export const NoEndDate: Story = {
  args: {
    event: {
      ...Default.args?.event,
      end: undefined,
    } as EventInput,
  },
};

export const NoExtendedProps: Story = {
  args: {
    event: {
      id: "2",
      title: "Generic Event",
      start: new Date(),
    } as EventInput,
  },
};
