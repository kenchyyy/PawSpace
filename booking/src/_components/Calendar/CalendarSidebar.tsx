"use client";

import { useState } from "react";
import { EventApi } from "@fullcalendar/core"; // Keep EventApi for FullCalendar's internal event objects
import { formatDateTime } from "@/lib/utils";

// --- START: ADJUSTMENT REQUIRED ---
// Removed: Local type definitions for MealInstruction, PetWithDetails, BookingEvent
import {
  BookingEvent,
  MealInstruction,
  PetWithDetails,
} from "@/_components/Calendar/types"; // Import BookingEvent type

type CalendarSidebarProps = {
  events: BookingEvent[]; // Use BookingEvent type here
  loading?: boolean;
  title?: string;
};

const CalendarSidebar = ({
  events,
  loading = false,
  title = "Upcoming Bookings",
}: CalendarSidebarProps) => {
  const [showMoreToday, setShowMoreToday] = useState(false);
  const [showMoreUpcoming, setShowMoreUpcoming] = useState(false);

  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(dateObj);
  };

  const adjustEndDate = (date: Date | null): Date | null => {
    if (!date) return null;

    if (
      date.getHours() === 0 &&
      date.getMinutes() === 0 &&
      date.getSeconds() === 0
    ) {
      const adjustedDate = new Date(date);
      adjustedDate.setMilliseconds(-1);
      return adjustedDate;
    }

    return date;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsedEvents = events.map((event) => {
    let startDate =
      typeof event.start === "string"
        ? new Date(event.start)
        : event.start instanceof Date
        ? event.start
        : new Date();

    let endDate = event.end
      ? typeof event.end === "string"
        ? new Date(event.end)
        : event.end instanceof Date
        ? event.end
        : Array.isArray(event.end)
        ? new Date(event.end[0])
        : null
      : null;

    const adjustedEndDate = adjustEndDate(endDate);

    return { ...event, _startDate: startDate, _endDate: adjustedEndDate };
  });

  const todayEvents = parsedEvents.filter((event) => {
    const eventStartDay = new Date(event._startDate);
    eventStartDay.setHours(0, 0, 0, 0);

    const eventEndDay = event._endDate ? new Date(event._endDate) : null;
    if (eventEndDay) eventEndDay.setHours(0, 0, 0, 0);

    const startsToday = eventStartDay.getTime() === today.getTime();
    const endsToday = eventEndDay && eventEndDay.getTime() === today.getTime();

    return startsToday || (eventStartDay < today && endsToday);
  });

  const upcomingEvents = parsedEvents
    .filter((event) => {
      const eventStartDay = new Date(event._startDate);
      eventStartDay.setHours(0, 0, 0, 0);

      const eventEndDay = event._endDate ? new Date(event._endDate) : null;
      if (eventEndDay) eventEndDay.setHours(0, 0, 0, 0);

      const sevenDaysFromToday = new Date(today);
      sevenDaysFromToday.setDate(today.getDate() + 7);
      sevenDaysFromToday.setHours(23, 59, 59, 999);

      const isFutureEvent = eventStartDay > today;
      const startsWithinNext7Days = eventStartDay <= sevenDaysFromToday;
      const endsWithinNext7Days =
        eventEndDay && eventEndDay <= sevenDaysFromToday;

      return (
        ((isFutureEvent && startsWithinNext7Days) ||
          (eventStartDay <= today &&
            endsWithinNext7Days &&
            eventEndDay >= today)) &&
        !todayEvents.some((todayEvent) => todayEvent.id === event.id)
      );
    })
    .sort((a, b) => a._startDate.getTime() - b._startDate.getTime());

  const visibleTodayEvents = showMoreToday
    ? todayEvents
    : todayEvents.slice(0, 2);
  const visibleUpcomingEvents = showMoreUpcoming
    ? upcomingEvents
    : upcomingEvents.slice(0, 2);

  return (
    <div
      className='w-full lg:w-3/12 bg-gradient-to-b from-[#1E1B4B] to-[#2A0D45] shadow-lg border border-[#4C1D95] p-4 flex flex-col'
      style={{
        overflowY: "auto",
      }}
    >
      <div className='py-6 text-xl font-bold text-[#FBBF24] px-4 border-b border-[#9F7AEA] flex items-center gap-2'>
        <span className='text-[#E9D5FF]'>📖</span> Bookings
      </div>
      <div className='flex-1 overflow-y-auto mt-4'>
        <div>
          <h3 className='text-md font-semibold text-[#E9D5FF] mb-2 px-4 flex justify-between items-center'>
            <span className='truncate'>Today</span>
            {todayEvents.length > 2 && !showMoreToday && (
              <button
                onClick={() => setShowMoreToday(true)}
                className='text-sm text-[#9F7AEA] hover:text-[#E9D5FF] focus:outline-none'
              >
                Show All ({todayEvents.length})
              </button>
            )}
          </h3>
          {loading ? (
            <div className='text-center text-[#E9D5FF] py-2'>
              <div className='inline-block h-4 w-4 animate-spin border-2 border-[#9F7AEA] border-t-transparent'></div>
            </div>
          ) : visibleTodayEvents.length > 0 ? (
            <ul className='space-y-2 px-4'>
              {visibleTodayEvents.map((event) => (
                <CalendarEventItem
                  key={event.id}
                  event={event}
                  isToday={true}
                />
              ))}
            </ul>
          ) : (
            <p className='italic text-center text-[#9F7AEA] py-2 px-4'>
              No check-ins or check-outs today
            </p>
          )}
          {todayEvents.length > 2 && showMoreToday && (
            <button
              onClick={() => setShowMoreToday(false)}
              className='mt-2 text-sm text-[#9F7AEA] hover:text-[#E9D5FF] focus:outline-none px-4'
            >
              Show Less
            </button>
          )}
        </div>

        <div className='mt-6'>
          <h3 className='text-md font-semibold text-[#E9D5FF] mb-2 px-4 flex justify-between items-center'>
            <span className='truncate'>Upcoming (Next 7 Days)</span>
            {upcomingEvents.length > 2 && !showMoreUpcoming && (
              <button
                onClick={() => setShowMoreUpcoming(true)}
                className='text-sm text-[#9F7AEA] hover:text-[#E9D5FF] focus:outline-none'
              >
                Show All ({upcomingEvents.length})
              </button>
            )}
          </h3>
          {loading ? (
            <div className='text-center text-[#E9D5FF] py-2'>
              <div className='inline-block h-4 w-4 animate-spin border-2 border-[#9F7AEA] border-t-transparent'></div>
            </div>
          ) : visibleUpcomingEvents.length > 0 ? (
            <ul className='space-y-2 px-4'>
              {visibleUpcomingEvents.map((event) => (
                <CalendarEventItem
                  key={event.id}
                  event={event}
                  isUpcoming={true}
                />
              ))}
            </ul>
          ) : (
            <p className='italic text-center text-[#9F7AEA] py-2 px-4'>
              No upcoming check-ins or check-outs in the next 7 days
            </p>
          )}
          {upcomingEvents.length > 2 && showMoreUpcoming && (
            <button
              onClick={() => setShowMoreUpcoming(false)}
              className='mt-2 text-sm text-[#9F7AEA] hover:text-[#E9D5FF] focus:outline-none px-4'
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CalendarEventItem = ({
  event,
  isToday,
  isUpcoming,
}: {
  event: BookingEvent; // Use BookingEvent type here
  isToday?: boolean;
  isUpcoming?: boolean;
}) => {
  const adjustEndDateForDisplay = (
    date: Date | string | null
  ): Date | undefined => {
    if (!date) return undefined;

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (
      dateObj.getHours() === 0 &&
      dateObj.getMinutes() === 0 &&
      dateObj.getSeconds() === 0
    ) {
      const adjustedDate = new Date(dateObj);
      adjustedDate.setTime(adjustedDate.getTime() - 1);
      return adjustedDate;
    }

    return dateObj;
  };

  const checkIn = event.extendedProps.checkIn
    ? formatDateTime(event.extendedProps.checkIn)
    : "N/A";
  const checkOut = event.extendedProps.checkOut
    ? formatDateTime(adjustEndDateForDisplay(event.extendedProps.checkOut))
    : "N/A";

  let bookingType: string | null = null;

  if (isToday) {
    if (event.extendedProps.checkIn && event.extendedProps.checkOut) {
      const checkInDate = new Date(event.extendedProps.checkIn);
      const checkOutDate = new Date(event.extendedProps.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);

      const startsToday = checkInDate.getTime() === today.getTime();
      const endsToday = checkOutDate.getTime() === today.getTime();

      if (startsToday && endsToday) {
        bookingType = "Check-in & Check-out";
      } else if (startsToday) {
        bookingType = "Check-in";
      } else if (endsToday) {
        bookingType = "Check-out";
      } else if (checkInDate < today && checkOutDate > today) {
        bookingType = "Ongoing";
      }
    } else if (event.extendedProps.checkIn) {
      const checkInDate = new Date(event.extendedProps.checkIn);
      const today = new Date();
      checkInDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (checkInDate.getTime() === today.getTime()) {
        bookingType = "Check-in";
      }
    }
  } else if (isUpcoming) {
    bookingType = "Upcoming";
  }

  const serviceType = event.extendedProps?.serviceType || "N/A";

  return (
    <li
      className='bg-[#1E1B4B] border border-[#4C1D95] shadow-lg px-4 py-3 rounded-md transition-all hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(159,122,234,0.5)]'
      style={{
        borderLeft: `4px solid ${event.backgroundColor || "#9F7AEA"}`,
        boxShadow: `0 2px 8px ${event.backgroundColor || "#9F7AEA"}40`,
      }}
    >
      <div className='font-semibold text-[#E9D5FF] flex items-center gap-2'>
        <span
          className='inline-block w-2 h-2 rounded-full'
          style={{ backgroundColor: event.backgroundColor || "#9F7AEA" }}
        ></span>
        <span className='truncate'>
          {event.title}
          {bookingType && (
            <span className='xs text-[#FBBF24] ml-1'>({bookingType})</span>
          )}
        </span>
      </div>

      <div className='text-sm text-[#C4B5FD] mt-1 truncate'>
        <span className='font-medium text-[#FBBF24]'>Owner:</span>{" "}
        {event.extendedProps?.ownerName || "N/A"}
      </div>

      <div className='text-sm text-[#C4B5FD] mt-1'>
        <span className='font-medium text-[#FBBF24]'>Service:</span>{" "}
        {serviceType}
      </div>

      <div className='text-sm text-[#C4B5FD] mt-1'>
        <span className='font-medium text-[#FBBF24]'>Check-in:</span> {checkIn}
      </div>

      {event.extendedProps.checkOut &&
        event.extendedProps.checkOut !== "N/A" && (
          <div className='text-sm text-[#C4B5FD] mt-1'>
            <span className='font-medium text-[#FBBF24]'>Check-out:</span>{" "}
            {checkOut}
          </div>
        )}

      <div
        className='mt-2 text-xs font-medium px-2 py-1 rounded-full inline-block truncate'
        style={{
          backgroundColor: `${event.backgroundColor || "#9F7AEA"}20`,
          color: event.backgroundColor || "#E9D5FF",
          border: `1px solid ${event.backgroundColor || "#9F7AEA"}`,
        }}
      >
        {event.extendedProps?.status?.toLowerCase() || "unknown"}
      </div>
    </li>
  );
};

export default CalendarSidebar;
