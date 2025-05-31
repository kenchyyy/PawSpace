"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Calendar from "@/_components/Calendar/FullCalendar";
import CalendarSidebar from "@/_components/Calendar/CalendarSidebar";
import CalendarModal from "@/_components/Calendar/CalendarModal";
import CalendarSkeleton from "@/_components/Calendar/CalendarSkeleton";
import { EventApi, EventClickArg, EventInput } from "@fullcalendar/core";

export default function CalendarPage() {
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/calendar"); // Your API endpoint
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching bookings:", errorData);
          setLoading(false);
          return;
        }
        const events = await response.json();

        // Filter to only show confirmed, ongoing, or completed bookings
        const filteredEvents = events.filter(
          (event: { extendedProps: { status: string } }) => {
            const status = event.extendedProps.status?.toLowerCase();
            return (
              status === "confirmed" ||
              status === "ongoing" ||
              status === "completed"
            );
          }
        );

        // Format events with colors based on status
        const formattedEvents = filteredEvents.map(
          (event: { extendedProps: { status: string } }) => ({
            ...event,
            backgroundColor: getStatusColor(event.extendedProps.status),
            borderColor: getStatusColor(event.extendedProps.status),
          })
        );

        setCurrentEvents(formattedEvents as EventInput[]);
        setLoading(false);
      } catch (error) {
        console.error("Error loading bookings:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const { event } = clickInfo;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start || undefined,
      end: event.end || undefined,
      extendedProps: event.extendedProps,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
    });
    setIsModalOpen(true);
  };

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
