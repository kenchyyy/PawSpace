import type { Meta, StoryObj } from "@storybook/react";
import CalendarSidebar from "@/_components/Calendar/CalendarSidebar";
import { EventApi } from "@fullcalendar/core";

type BookingStatus = "Ongoing" | "Confirmed" | "Completed";

const createMockEvent = (
  id: string,
  petName: string,
  petType: "Dog" | "Cat",
  ownerName: string,
  start: Date,
  end: Date | null,
  status: BookingStatus
): EventApi => {
  let computedBackgroundColor: string;
  let computedStatus: string = status;

  switch (status) {
    case "Confirmed":
      computedBackgroundColor = "#10B981";
      break;
    case "Ongoing":
      computedBackgroundColor = "#F59E0B";
      break;
    case "Completed":
      computedBackgroundColor = "#3B82F6";
      break;
    default:
      computedBackgroundColor = "#4B5563";
  }

  const title = `${petName} (${petType}) - ${ownerName}`;

  return {
    id,
    title,
    start,
    end,
    allDay: false,
    extendedProps: {
      ownerName,
      status: computedStatus,
    },
    backgroundColor: computedBackgroundColor,
    setProp: () => {},
    setDates: () => {},
    setEnd: () => {},
    setAllDay: () => {},
    setExtendedProp: () => {},
    setStart: () => {},
    remove: () => {},
    hasEnd: true,
    url: "",
    groupId: "",
    overlap: true,
    constraint: "",
    editable: true,
    startEditable: true,
    durationEditable: true,
    display: "",
    color: "",
    textColor: "",
    classNames: [],
  } as unknown as EventApi;
};

const meta: Meta<typeof CalendarSidebar> = {
  title: "Calendar/CalendarSidebar",
  component: CalendarSidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    events: {
      control: "object",
      description: "Array of FullCalendar EventApi objects",
    },
    loading: {
      control: "boolean",
      description: "Loading state for the sidebar",
    },
    title: {
      control: "text",
      description: "Title for the sidebar section",
    },
  },
  decorators: [
    (Story) => (
      <div className='flex justify-start bg-gray-900 min-h-screen p-4'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CalendarSidebar>;

const getTodayNormalized = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const Default: Story = {
  args: {
    events: [],
    loading: false,
    title: "Upcoming Pet Bookings",
  },
};

export const LoadingState: Story = {
  args: {
    events: [],
    loading: true,
    title: "Upcoming Pet Bookings",
  },
};

export const WithTodayAndUpcomingEvents: Story = {
  args: {
    events: [
      (() => {
        const start = new Date();
        start.setHours(9, 0, 0, 0);
        const end = new Date();
        end.setDate(start.getDate() + 5);
        end.setHours(9, 0, 0, 0);
        return createMockEvent(
          "1",
          "Bob",
          "Dog",
          "Lei Andrea Trasadas",
          start,
          end,
          "Ongoing"
        );
      })(),
      (() => {
        const start = new Date();
        start.setHours(10, 0, 0, 0);
        const end = new Date();
        end.setDate(start.getDate() + 1);
        end.setHours(10, 0, 0, 0);
        return createMockEvent(
          "2",
          "Queeny",
          "Cat",
          "Erika Noreen Delarosa",
          start,
          end,
          "Ongoing"
        );
      })(),
      (() => {
        const start = new Date();
        start.setHours(14, 0, 0, 0);
        const end = new Date();
        end.setHours(16, 0, 0, 0);
        return createMockEvent(
          "3",
          "Max",
          "Dog",
          "Jane Smith",
          start,
          end,
          "Ongoing"
        );
      })(),

      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 1);
        d.setHours(19, 0, 0, 0);
        const end = new Date(d);
        end.setDate(end.getDate() + 6);
        end.setHours(19, 0, 0, 0);
        return createMockEvent(
          "4",
          "Mamaw",
          "Cat",
          "Kenneth Joel A. Urbano",
          d,
          end,
          "Confirmed"
        );
      })(),
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 2);
        d.setHours(9, 0, 0, 0);
        const end = new Date(d);
        end.setHours(11, 0, 0, 0);
        return createMockEvent(
          "5",
          "Mittens",
          "Cat",
          "Emily White",
          d,
          end,
          "Confirmed"
        );
      })(),
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 3);
        d.setHours(14, 0, 0, 0);
        const end = new Date(d);
        end.setHours(16, 0, 0, 0);
        return createMockEvent(
          "6",
          "Rocky",
          "Dog",
          "David Green",
          d,
          end,
          "Ongoing"
        );
      })(),
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 5);
        d.setHours(12, 0, 0, 0);
        const end = new Date(d);
        end.setHours(13, 0, 0, 0);
        return createMockEvent(
          "7",
          "Luna",
          "Dog",
          "Frank Black",
          d,
          end,
          "Confirmed"
        );
      })(),
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 6);
        d.setHours(9, 0, 0, 0);
        const end = new Date(d);
        end.setHours(17, 0, 0, 0);
        return createMockEvent(
          "8",
          "Cleo",
          "Cat",
          "Grace Gold",
          d,
          end,
          "Ongoing"
        );
      })(),
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 7);
        d.setHours(10, 0, 0, 0);
        const end = new Date(d);
        end.setHours(12, 0, 0, 0);
        return createMockEvent(
          "9",
          "Bella",
          "Dog",
          "Heidi Silver",
          d,
          end,
          "Completed"
        );
      })(),
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 1);
        d.setHours(9, 0, 0, 0);
        const end = getTodayNormalized();
        end.setDate(end.getDate() + 3);
        end.setHours(0, 0, 0, 0);
        return createMockEvent(
          "10",
          "Smokey",
          "Cat",
          "Ivy Green",
          d,
          end,
          "Confirmed"
        );
      })(),
    ],
    loading: false,
  },
};

export const NoEventsTodayOrUpcoming: Story = {
  args: {
    events: [
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 10);
        d.setHours(12, 0, 0, 0);
        const end = new Date(d);
        end.setHours(13, 0, 0, 0);
        return createMockEvent(
          "far1",
          "Daisy",
          "Dog",
          "Far Away",
          d,
          end,
          "Ongoing"
        );
      })(),
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() - 5);
        d.setHours(10, 0, 0, 0);
        const end = new Date(d);
        end.setHours(11, 0, 0, 0);
        return createMockEvent(
          "past1",
          "Milo",
          "Cat",
          "Old Timer",
          d,
          end,
          "Completed"
        );
      })(),
    ],
    loading: false,
  },
};

export const OnlyTodayEvents: Story = {
  args: {
    events: [
      (() => {
        const d = new Date();
        d.setHours(9, 0, 0, 0);
        const end = new Date();
        end.setHours(9, 30, 0, 0);
        return createMockEvent(
          "t1",
          "Sparky",
          "Dog",
          "Team Alpha",
          d,
          end,
          "Confirmed"
        );
      })(),
      (() => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        const end = new Date();
        end.setHours(13, 0, 0, 0);
        return createMockEvent("t2", "Nala", "Cat", "Self", d, end, "Ongoing");
      })(),
      (() => {
        const d = new Date();
        d.setHours(16, 0, 0, 0);
        const end = new Date();
        end.setHours(17, 0, 0, 0);
        return createMockEvent(
          "t3",
          "Leo",
          "Cat",
          "Operations",
          d,
          end,
          "Completed"
        );
      })(),
    ],
    loading: false,
  },
};

export const OnlyUpcomingEvents: Story = {
  args: {
    events: [
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 2);
        d.setHours(14, 0, 0, 0);
        const end = new Date(d);
        end.setHours(15, 0, 0, 0);
        return createMockEvent(
          "u1",
          "Charlie",
          "Dog",
          "HR Team",
          d,
          end,
          "Ongoing"
        );
      })(),
      (() => {
        const d = getTodayNormalized();
        d.setDate(d.getDate() + 4);
        d.setHours(10, 0, 0, 0);
        const end = new Date(d);
        end.setHours(11, 0, 0, 0);
        return createMockEvent(
          "u2",
          "Lucy",
          "Cat",
          "Sales Dept.",
          d,
          end,
          "Confirmed"
        );
      })(),
    ],
    loading: false,
  },
};

export const ManyEventsToday: Story = {
  args: {
    events: Array.from({ length: 5 }).map((_, i) => {
      const start = new Date();
      start.setHours(8 + i, 0, 0, 0);
      const end = new Date();
      end.setHours(9 + i, 0, 0, 0);
      const petType = i % 2 === 0 ? "Dog" : "Cat";
      return createMockEvent(
        `today-event-${i}`,
        `Pet ${i + 1}`,
        petType,
        `Owner ${i + 1}`,
        start,
        end,
        i % 2 === 0 ? "Confirmed" : "Ongoing"
      );
    }),
    loading: false,
  },
};

export const ManyUpcomingEvents: Story = {
  args: {
    events: Array.from({ length: 8 }).map((_, i) => {
      const d = getTodayNormalized();
      d.setDate(d.getDate() + 1 + Math.floor(i / 2));
      d.setHours(10 + (i % 2), 0, 0, 0);
      const end = new Date(d);
      end.setHours(d.getHours() + 1, 0, 0, 0);
      const petType = i % 2 === 0 ? "Cat" : "Dog";
      return createMockEvent(
        `upcoming-event-${i}`,
        `Pet ${i + 1}`,
        petType,
        `Client ${i + 1}`,
        d,
        end,
        i % 2 === 0 ? "Ongoing" : "Confirmed"
      );
    }),
    loading: false,
  },
};

export const AllDayEvents: Story = {
  args: {
    events: [
      (() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
        return createMockEvent(
          "allDayToday",
          "Coco",
          "Dog",
          "Team Sitter",
          start,
          end,
          "Confirmed"
        );
      })(),
      (() => {
        const start = getTodayNormalized();
        start.setDate(start.getDate() + 2);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 3);
        end.setHours(0, 0, 0, 0);
        return createMockEvent(
          "allDayUpcoming",
          "Whiskers",
          "Cat",
          "Happy Paws Resort",
          start,
          end,
          "Ongoing"
        );
      })(),
      (() => {
        const start = getTodayNormalized();
        start.setDate(start.getDate() - 2);
        start.setHours(0, 0, 0, 0);

        const end = getTodayNormalized();
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);
        return createMockEvent(
          "allDayTodayCheckout",
          "Max",
          "Dog",
          "Furry Friends Home",
          start,
          end,
          "Completed"
        );
      })(),
    ],
    loading: false,
  },
};
