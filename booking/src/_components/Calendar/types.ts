// src/types/calendar.ts or src/types/index.ts
import { EventInput } from "@fullcalendar/core";

export type MealInstruction = {
  food: string;
  notes?: string;
  mealType: string;
  time: string;
};

export type PetWithDetails = {
  petName: string;
  petBreed: string;
  petType: string;
  mealInstructions: MealInstruction | null;
  checkIn: string | null;
  checkOut: string | null;
  serviceType: "boarding" | "grooming" | "unknown";
};

// BookingEvent will extend EventInput because it's the base for FullCalendar events
export type BookingEvent = EventInput & {
  extendedProps: {
    bookingId: string;
    ownerName: string;
    contactNumber: string;
    status: string;
    specialRequests: string;
    totalAmount: number;
    serviceType: string; // Overall service type string (e.g., "Boarding, Grooming")
    pets: PetWithDetails[];
    checkIn?: string | null; // Overall booking check-in
    checkOut?: string | null; // Overall booking check-out
  };
};

// You might also export EventApi if you use it frequently and want a consistent source
// import { EventApi } from "@fullcalendar/core";
// export type BookingEventApi = EventApi & { ... extendedProps based on BookingEvent ... };
// But for now, sticking to EventInput as it's the base for creating/passing data.
