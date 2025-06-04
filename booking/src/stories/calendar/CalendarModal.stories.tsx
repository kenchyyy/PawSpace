import type { Meta, StoryObj } from "@storybook/react";
import CalendarModal from "@/_components/Calendar/CalendarModal";
import { EventInput } from "@fullcalendar/core";
import { action } from "@storybook/addon-actions";

const createMockEvent = (
  id: string,
  title: string,
  start: Date | string,
  end: Date | string | undefined | null,
  extendedProps: {
    ownerName?: string;
    contactNumber?: string;
    status?: string;
    specialRequests?: string;
    totalAmount?: number;
    serviceType?: string;
    pets?: {
      petName: string;
      petBreed: string;
      petType: "Dog" | "Cat";
      mealInstructions: {
        food: string;
        notes?: string;
        mealType: string;
        time: string;
      } | null;
    }[];
    checkIn?: string | null;
    checkOut?: string | null;
  }
): EventInput => {
  return {
    id,
    title,
    start,
    end: end === null ? undefined : end,
    extendedProps,
    allDay: false,
    backgroundColor: "#3B82F6",
  };
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);

const mockEventConfirmed: EventInput = createMockEvent(
  "1",
  "Fluffy & Max Booking",
  today.toISOString(),
  tomorrow.toISOString(),
  {
    ownerName: "Alice Johnson",
    contactNumber: "123-456-7890",
    status: "Confirmed",
    serviceType: "Pet Boarding",
    totalAmount: 150.0,
    checkIn: today.toISOString(),
    checkOut: tomorrow.toISOString(),
    pets: [
      {
        petName: "Fluffy",
        petBreed: "Poodle",
        petType: "Dog",
        mealInstructions: {
          food: "Royal Canin",
          notes: "Likes wet food mixed in",
          mealType: "Breakfast & Dinner",
          time: "8:00 AM, 6:00 PM",
        },
      },
      {
        petName: "Max",
        petBreed: "Siamese",
        petType: "Cat",
        mealInstructions: null,
      },
    ],
    specialRequests: "Please give Fluffy extra belly rubs.",
  }
);

const mockEventOngoing: EventInput = createMockEvent(
  "2",
  "Buddy's Stay",
  new Date(today.setHours(9, 0, 0, 0)).toISOString(),
  new Date(today.setHours(17, 0, 0, 0)).toISOString(),
  {
    ownerName: "Bob Williams",
    contactNumber: "098-765-4321",
    status: "Ongoing",
    serviceType: "grooming",
    totalAmount: 50.0,
    checkIn: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
    checkOut: new Date(today.setHours(17, 0, 0, 0)).toISOString(),
    pets: [
      {
        petName: "Buddy",
        petBreed: "Golden Retriever",
        petType: "Dog",
        mealInstructions: {
          food: "Kibble",
          mealType: "Lunch",
          time: "12:30 PM",
        },
      },
    ],
    specialRequests: "Buddy needs a quiet space for naps.",
  }
);

const mockEventCompleted: EventInput = createMockEvent(
  "3",
  "Mittens Grooming",
  new Date(today.setHours(10, 0, 0, 0)).toISOString(),
  new Date(today.setHours(11, 0, 0, 0)).toISOString(),
  {
    ownerName: "Carol Davis",
    contactNumber: "555-123-4567",
    status: "Completed",
    serviceType: "Grooming",
    totalAmount: 75.0,
    checkIn: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
    checkOut: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    pets: [
      {
        petName: "Mittens",
        petBreed: "Persian",
        petType: "Cat",
        mealInstructions: null,
      },
    ],
    specialRequests: "Use sensitive skin shampoo.",
  }
);

const meta: Meta<typeof CalendarModal> = {
  title: "Calendar/CalendarModal",
  component: CalendarModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls the visibility of the modal.",
    },
    onOpenChange: {
      action: "onOpenChange",
      description: "Callback function when the modal's open state changes.",
    },
    event: {
      control: "object",
      description: "The FullCalendar event object to display details for.",
    },
  },

  decorators: [
    (Story) => (
      <div className='flex justify-center items-center h-screen w-full bg-gray-900'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CalendarModal>;

export const ConfirmedBooking: Story = {
  args: {
    open: true,
    onOpenChange: action("onOpenChange"),
    event: mockEventConfirmed,
  },
};

export const OngoingBooking: Story = {
  args: {
    open: true,
    onOpenChange: action("onOpenChange"),
    event: mockEventOngoing,
  },
};

export const CompletedBooking: Story = {
  args: {
    open: true,
    onOpenChange: action("onOpenChange"),
    event: mockEventCompleted,
  },
};

export const BookingWithNoMealInstructions: Story = {
  args: {
    open: true,
    onOpenChange: action("onOpenChange"),
    event: createMockEvent(
      "5",
      "Quiet Dog Stay",
      today.toISOString(),
      dayAfterTomorrow.toISOString(),
      {
        ownerName: "Zoe Young",
        contactNumber: "999-888-7777",
        status: "Confirmed",
        serviceType: "Boarding",
        pets: [
          {
            petName: "Shadow",
            petBreed: "Labrador",
            petType: "Dog",
            mealInstructions: null,
          },
        ],
        specialRequests: "Keep away from loud noises.",
      }
    ),
  },
};

export const BookingWithMultiplePetsAndInstructions: Story = {
  args: {
    open: true,
    onOpenChange: action("onOpenChange"),
    event: createMockEvent(
      "6",
      "Multi-Pet Booking",
      today.toISOString(),
      dayAfterTomorrow.toISOString(),
      {
        ownerName: "Frank White",
        contactNumber: "111-222-3333",
        status: "Confirmed",
        serviceType: "Overnight Stay",
        pets: [
          {
            petName: "Whiskers",
            petBreed: "Domestic Shorthair",
            petType: "Cat",
            mealInstructions: {
              food: "Fancy Feast",
              notes: "Only salmon flavor",
              mealType: "All Day",
              time: "Free-feed",
            },
          },
          {
            petName: "Spike",
            petBreed: "German Shepherd",
            petType: "Dog",
            mealInstructions: {
              food: "Dry Kibble",
              notes: "Needs slow feeder bowl",
              mealType: "Morning & Evening",
              time: "8:00 AM, 5:00 PM",
            },
          },
          {
            petName: "Polly",
            petBreed: "Ragdoll",
            petType: "Cat",
            mealInstructions: null,
          },
        ],
        specialRequests: "Provide fresh filtered water for all pets.",
      }
    ),
  },
};
