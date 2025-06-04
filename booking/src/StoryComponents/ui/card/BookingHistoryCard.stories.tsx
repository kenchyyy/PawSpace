import { Meta, StoryObj } from '@storybook/react';
import BookingCard from '@/_components/BookingHistory/BookingCard';
import { BookingRecord } from '@/_components/BookingHistory/types/bookingRecordType';

const meta: Meta<typeof BookingCard> = {
  title: 'Components/BookingCard',
  component: BookingCard,
};

export default meta;

type Story = StoryObj<typeof BookingCard>;

const now = new Date().toISOString();

const baseBooking: Partial<BookingRecord> = {
  booking_uuid: '1',
  date_booked: now,
  service_date_start: now,
  service_date_end: now,
  pets: [
    {
      name: 'Buddy',
    } as BookingRecord['pets'][number],
  ],
};

// --- GROOMING BOOKINGS ---

export const GroomingPending: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'pending',
      pets: [
        {
          name: 'Fluffy',
          groom_service: {
            service_time: '10:00',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const GroomingConfirmed: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'confirmed',
      pets: [
        {
          name: 'Fluffy',
          groom_service: {
            service_time: '10:00',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const GroomingOngoing: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'ongoing',
      pets: [
        {
          name: 'Fluffy',
          groom_service: {
            service_time: '10:00',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const GroomingCompleted: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'completed',
      pets: [
        {
          name: 'Fluffy',
          groom_service: {
            service_time: '10:00',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const GroomingCancelled: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'cancelled',
      pets: [
        {
          name: 'Fluffy',
          groom_service: {
            service_time: '10:00',
          },
        },
      ],
    } as BookingRecord,
  },
};

// --- DAY BOARDING BOOKINGS ---

export const DayBoardingPending: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'pending',
      pets: [
        {
          name: 'Max',
          boarding_pet: {
            check_in_time: '08:00',
            check_out_time: '17:00',
            boarding_type: 'day',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const DayBoardingConfirmed: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'confirmed',
      pets: [
        {
          name: 'Max',
          boarding_pet: {
            check_in_time: '08:00',
            check_out_time: '17:00',
            boarding_type: 'day',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const DayBoardingOngoing: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'ongoing',
      pets: [
        {
          name: 'Max',
          boarding_pet: {
            check_in_time: '08:00',
            check_out_time: '17:00',
            boarding_type: 'day',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const DayBoardingCompleted: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'completed',
      pets: [
        {
          name: 'Max',
          boarding_pet: {
            check_in_time: '08:00',
            check_out_time: '17:00',
            boarding_type: 'day',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const DayBoardingCancelled: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'cancelled',
      pets: [
        {
          name: 'Max',
          boarding_pet: {
            check_in_time: '08:00',
            check_out_time: '17:00',
            boarding_type: 'day',
          },
        },
      ],
    } as BookingRecord,
  },
};

// --- OVERNIGHT BOARDING BOOKINGS ---

export const OvernightBoardingPending: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'pending',
      pets: [
        {
          name: 'Luna',
          boarding_pet: {
            check_in_time: '18:00',
            check_out_time: '08:00',
            boarding_type: 'overnight',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const OvernightBoardingConfirmed: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'confirmed',
      pets: [
        {
          name: 'Luna',
          boarding_pet: {
            check_in_time: '18:00',
            check_out_time: '08:00',
            boarding_type: 'overnight',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const OvernightBoardingOngoing: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'ongoing',
      pets: [
        {
          name: 'Luna',
          boarding_pet: {
            check_in_time: '18:00',
            check_out_time: '08:00',
            boarding_type: 'overnight',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const OvernightBoardingCompleted: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'completed',
      pets: [
        {
          name: 'Luna',
          boarding_pet: {
            check_in_time: '18:00',
            check_out_time: '08:00',
            boarding_type: 'overnight',
          },
        },
      ],
    } as BookingRecord,
  },
};

export const OvernightBoardingCancelled: Story = {
  args: {
    booking: {
      ...baseBooking,
      status: 'cancelled',
      pets: [
        {
          name: 'Luna',
          boarding_pet: {
            check_in_time: '18:00',
            check_out_time: '08:00',
            boarding_type: 'overnight',
          },
        },
      ],
    } as BookingRecord,
  },
};
