import { Meta, StoryObj } from "@storybook/react";
import CalendarSidebar from "@/_components/Calendar/CalendarSidebar";
import { EventApi } from "@fullcalendar/core";

const meta: Meta<typeof CalendarSidebar> = {
  title: "Components/Calendar/CalendarSidebar",
  component: CalendarSidebar,
};

export default meta;

type Story = StoryObj<typeof CalendarSidebar>;

// Mock Event Data
const mockEvents: EventApi[] = [
  {
    id: "1",
    title: "Buddy (Labrador) - Alice",
    start: new Date(),
    end: new Date(Date.now() + 3600000), // One hour later
    extendedProps: {
      petName: "Buddy",
      petType: "Labrador",
      ownerName: "Alice",
      status: "confirmed",
    },
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  } as unknown as EventApi,
  {
    id: "2",
    title: "Lucy (Poodle) - Bob",
    start: new Date(Date.now() + 86400000), // Tomorrow
    end: new Date(Date.now() + 86400000 + 1800000), // 30 minutes later
    extendedProps: {
      petName: "Lucy",
      petType: "Poodle",
      ownerName: "Bob",
      status: "pending",
    },
    backgroundColor: "#f59e0b",
    borderColor: "#f59e0b",
  } as unknown as EventApi,
  {
    id: "3",
    title: "Max (Golden Retriever) - Carol",
    start: new Date(Date.now() - 3600000), // One hour ago
    end: new Date(),
    extendedProps: {
      petName: "Max",
      petType: "Golden Retriever",
      ownerName: "Carol",
      status: "completed",
    },
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  } as unknown as EventApi,
  {
    id: "4",
    title: "Daisy (Beagle) - David",
    start: new Date(Date.now() + 2 * 86400000), // Two days from now
    end: new Date(Date.now() + 2 * 86400000 + 7200000), // Two hours later
    extendedProps: {
      petName: "Daisy",
      petType: "Beagle",
      ownerName: "David",
      status: "cancelled",
    },
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  } as unknown as EventApi,
  {
    id: "5",
    title: "Rocky (Bulldog) - Eve",
    start: new Date(),
    end: new Date(Date.now() + 7200000), // Two hours later
    extendedProps: {
      petName: "Rocky",
      petType: "Bulldog",
      ownerName: "Eve",
      status: "confirmed",
    },
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  } as unknown as EventApi,
  {
    id: "6",
    title: "Bella (Shih Tzu) - Frank",
    start: new Date(Date.now() + 6 * 86400000), // Six days from now
    end: new Date(Date.now() + 6 * 86400000 + 3600000), // One hour later
    extendedProps: {
      petName: "Bella",
      petType: "Shih Tzu",
      ownerName: "Frank",
      status: "pending",
    },
    backgroundColor: "#f59e0b",
    borderColor: "#f59e0b",
  } as unknown as EventApi,
];

export const Default: Story = {
  args: {
    events: mockEvents,
  },
};

export const NoEvents: Story = {
  args: {
    events: [],
  },
};

export const OnlyTodayEvents: Story = {
  args: {
    events: mockEvents.filter((event) => {
      const today = new Date();
      const start = new Date(event.start || Date.now());
      const end = event.end ? new Date(event.end) : null;
      return (
        (start.getFullYear() === today.getFullYear() &&
          start.getMonth() === today.getMonth() &&
          start.getDate() === today.getDate()) ||
        (end &&
          end.getFullYear() === today.getFullYear() &&
          end.getMonth() === today.getMonth() &&
          end.getDate() === today.getDate())
      );
    }),
  },
};

export const OnlyUpcomingEvents: Story = {
  args: {
    events: mockEvents.filter((event) => {
      const today = new Date();
      const sevenDaysFromToday = new Date();
      sevenDaysFromToday.setDate(today.getDate() + 7);
      return (
        new Date(event.start || Date.now()) > today &&
        new Date(event.start || Date.now()) <= sevenDaysFromToday
      );
    }),
  },
};

export const MoreThanTwoTodayEvents: Story = {
  args: {
    events: [
      mockEvents[0],
      {
        ...mockEvents[0],
        id: "7",
        start: new Date(Date.now() + 60000),
      } as EventApi, // Another event very soon
      {
        ...mockEvents[0],
        id: "8",
        start: new Date(Date.now() + 120000),
      } as EventApi, // And another
    ],
  },
};

export const MoreThanTwoUpcomingEvents: Story = {
  args: {
    events: [
      mockEvents[1],
      {
        ...mockEvents[1],
        id: "9",
        start: new Date(Date.now() + 2 * 86400000),
      } as EventApi, // Another upcoming event
      {
        ...mockEvents[1],
        id: "10",
        start: new Date(Date.now() + 3 * 86400000),
      } as EventApi, // And another
    ],
  },
};

export const CustomTitle: Story = {
  args: {
    events: mockEvents,
    title: "Scheduled Appointments",
  },
};
