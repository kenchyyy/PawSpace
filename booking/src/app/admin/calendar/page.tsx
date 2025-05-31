"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Calendar from "@/_components/Calendar/FullCalendar";
import CalendarSidebar from "@/_components/Calendar/CalendarSidebar";
import CalendarModal from "@/_components/Calendar/CalendarModal";
import CalendarSkeleton from "@/_components/Calendar/CalendarSkeleton";
import { EventApi, EventClickArg, EventInput } from "@fullcalendar/core";

// Define types to match the updated fetchBookings function
type MealInstruction = {
  food: string;
  notes?: string;
  mealType: string;
  time: string;
};

type PetWithDetails = {
  petName: string;
  petBreed: string;
  petType: string;
  mealInstructions: MealInstruction | null;
  checkIn: string | null;
  checkOut: string | null;
  serviceType: "boarding" | "grooming";
};

type BookingEvent = EventInput & {
  extendedProps: {
    bookingId: string;
    ownerName: string;
    contactNumber: string;
    status: string;
    specialRequests: string;
    totalAmount: number;
    serviceType: string;
    pets: PetWithDetails[];
    checkIn?: string | null;
    checkOut?: string | null;
  };
};

export default function CalendarPage() {
  const [currentEvents, setCurrentEvents] = useState<BookingEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<any>(null);

  // Define colors for the statuses you want to display
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "#10B981"; // emerald green (confirmed)
      case "ongoing":
        return "#F59E0B"; // amber (ongoing)
      case "completed":
        return "#3B82F6"; // blue (completed)
      default:
        return "#6B7280"; // gray fallback
    }
  };

  // Get service type color for mixed services
  const getServiceTypeAccent = (serviceType: string) => {
    if (serviceType.includes("Boarding") && serviceType.includes("Grooming")) {
      return "#8B5CF6"; // purple for mixed services
    } else if (serviceType.includes("Boarding")) {
      return "#059669"; // darker green for boarding
    } else if (serviceType.includes("Grooming")) {
      return "#DC2626"; // red for grooming
    }
    return "#6B7280"; // gray fallback
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/calendar");
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching bookings:", errorData);
          setError("Failed to load calendar data");
          return;
        }

        const events: BookingEvent[] = await response.json();

        // Filter to only show confirmed, ongoing, or completed bookings
        const filteredEvents = events.filter((event) => {
          const status = event.extendedProps?.status?.toLowerCase();
          return (
            status === "confirmed" ||
            status === "ongoing" ||
            status === "completed"
          );
        });

        // Format events with colors based on status and service type
        const formattedEvents: BookingEvent[] = filteredEvents.map((event) => {
          const status = event.extendedProps.status;
          const serviceType = event.extendedProps.serviceType;

          return {
            ...event,
            backgroundColor: getStatusColor(status),
            borderColor: getServiceTypeAccent(serviceType),
            textColor: "#FFFFFF",
            // Add additional styling for mixed service events
            classNames:
              serviceType.includes("Boarding") &&
              serviceType.includes("Grooming")
                ? ["mixed-service-event"]
                : [],
          };
        });

        setCurrentEvents(formattedEvents);
      } catch (error) {
        console.error("Error loading bookings:", error);
        setError("Failed to load calendar data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const { event } = clickInfo;

    // Construct the event object with proper typing
    const selectedEventData: BookingEvent = {
      id: event.id,
      title: event.title,
      start: event.start || undefined,
      end: event.end || undefined,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      textColor: event.textColor,
      extendedProps: {
        bookingId: event.extendedProps.bookingId || event.id,
        ownerName: event.extendedProps.ownerName || "",
        contactNumber: event.extendedProps.contactNumber || "",
        status: event.extendedProps.status || "",
        specialRequests: event.extendedProps.specialRequests || "",
        totalAmount: event.extendedProps.totalAmount || 0,
        serviceType: event.extendedProps.serviceType || "",
        pets: event.extendedProps.pets || [],
        checkIn: event.extendedProps.checkIn || null,
        checkOut: event.extendedProps.checkOut || null,
      },
    };

    setSelectedEvent(selectedEventData);
    setIsModalOpen(true);
  };

  const handleRefresh = async () => {
    await loadData();
  };

  // Helper function to get readable service duration
  const getServiceDuration = (event: BookingEvent) => {
    if (!event.start || !event.end) return null;

    const start = event.start instanceof Date ? event.start : new Date(event.start as string);
    const end = event.end instanceof Date ? event.end : new Date(event.end as string);
    const diffHours =
      Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return `${Math.round(diffHours)} hours`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }
  };

  if (error) {
    return (
      <main className='cosmic-bg p-8 flex flex-col items-center justify-center h-full'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error Loading Calendar
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={handleRefresh}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className='cosmic-bg p-0 flex flex-col overflow-hidden h-full'>
      <div className='fixed inset-0 -z-10 starfield' />
      <div className='w-full max-w-none px-0 h-full'>
        <div className='flex flex-1 w-full overflow-hidden h-full'>
          <Suspense fallback={<CalendarSkeleton />}>
            {loading ? (
              <CalendarSkeleton />
            ) : (
              <>
                <CalendarSidebar
                  events={currentEvents as unknown as EventApi[]}
                  loading={loading}
                />
                <Calendar
                  events={currentEvents}
                  loading={loading}
                  onEventClick={handleEventClick}
                  calendarRef={calendarRef}
                />
              </>
            )}
          </Suspense>
        </div>
      </div>
      <CalendarModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        event={selectedEvent}
      />
    </main>
  );
}
function loadData() {
  throw new Error("Function not implemented.");
}

