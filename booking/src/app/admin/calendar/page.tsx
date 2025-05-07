"use client";

import React, { useState, useRef, useEffect } from "react";
import Calendar from "@/_components/Calendar/FullCalendar";
import CalendarSidebar from "@/_components/Calendar/CalendarSidebar";
import CalendarModal from "@/_components/Calendar/CalendarModal";
import CalendarSkeleton from "@/_components/Calendar/CalendarSkeleton";
import { fetchBookings } from "@/app/api/calendar/route";
import { EventApi, EventClickArg, EventInput } from "@fullcalendar/core";
import { Suspense } from "react";

export default function CalendarPage() {
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef<any>(null);
  const isCalendarReady = useRef(false); // Track if the calendar API is available

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      case "completed":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  // Load data immediately when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const events = await fetchBookings();
        console.log("Fetched events:", events);
        const formattedEvents = events.map((event) => ({
          ...event,
          backgroundColor: getStatusColor(event.extendedProps.status),
          borderColor: getStatusColor(event.extendedProps.status),
        }));
        setCurrentEvents(formattedEvents as EventInput[]);
        console.log(
          "currentEvents state:",
          formattedEvents.map((e) => ({
            id: e.id,
            backgroundColor: e.backgroundColor,
          }))
        );
      } catch (error) {
        console.error("Error loading bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Initialize calendar ready
  useEffect(() => {
    if (calendarRef.current) {
      isCalendarReady.current = true;
      console.log("Calendar API is ready.");
    }
  }, [calendarRef]);

  // Add events to the calendar when both the ref is ready AND events are loaded
  useEffect(() => {
    if (
      calendarRef.current &&
      currentEvents.length > 0 &&
      isCalendarReady.current
    ) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.removeAllEvents();
      currentEvents.forEach((event) => {
        calendarApi.addEvent({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: false,
          extendedProps: {
            ...event.extendedProps,
            status: event.extendedProps?.status || "unknown",
          },
          backgroundColor: event.backgroundColor, // Use the backgroundColor from state
          borderColor: event.borderColor, // Use the borderColor from state
          textColor: "#ffffff",
          display: "block",
        });
      });
      console.log("Events added to calendar:", calendarApi.getEvents());
    }

    return () => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.removeAllEvents(); // Clean up events on unmount
      }
    };
  }, [currentEvents]);

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
    <main className='min-h-screen cosmic-bg p-0 flex flex-col overflow-hidden'>
      {/* Starfield background */}
      <div className='fixed inset-0 -z-10 starfield' />

      {/* Full-bleed content container */}
      <div className='w-full max-w-none px-0'>
        {/* Calendar header with cosmic styling */}
        <div className='pt-8 pb-4 px-6 bg-gradient-to-r from-purple-900/80 to-indigo-900/80'>
          <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300'>
            Pawspace Hotel Bookings
          </h1>
        </div>

        {/* Calendar content area */}
        <div className='flex flex-1 w-full overflow-hidden'>
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
                  events={currentEvents as unknown as EventInput[]}
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
