"use client";

import { useState } from "react";
import { EventApi } from "@fullcalendar/core";
import { formatDateTime } from "@/lib/utils";

type CalendarSidebarProps = {
  events: EventApi[];
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

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const parsedEvents = events.map((event) => {
    let startDate =
      typeof event.start === "string"
        ? new Date(event.start)
        : new Date(event.start || new Date());
    let endDate = event.end
      ? typeof event.end === "string"
        ? new Date(event.end)
        : new Date(event.end)
      : null;
    return { ...event, _startDate: startDate, _endDate: endDate };
  });

  const todayEvents = parsedEvents.filter((event) => {
    const startYear = event._startDate.getFullYear();
    const startMonth = event._startDate.getMonth();
    const startDay = event._startDate.getDate();
    const startsToday =
      startYear === todayYear &&
      startMonth === todayMonth &&
      startDay === todayDay;

    const endsToday = event._endDate
      ? event._endDate.getFullYear() === todayYear &&
        event._endDate.getMonth() === todayMonth &&
        event._endDate.getDate() === todayDay
      : false;

    return startsToday || endsToday;
  });

  const upcomingEvents = parsedEvents
    .filter((event) => {
      const eventDate = event._startDate;
      const eventEndDate = event._endDate;

      const sevenDaysFromToday = new Date();
      sevenDaysFromToday.setDate(today.getDate() + 7);
      sevenDaysFromToday.setHours(23, 59, 59, 999); // Include the very end of the 7th day

      const startsAfterToday = eventDate > today;
      const startsInNext7Days = eventDate <= sevenDaysFromToday;
      const endsAfterToday = eventEndDate && eventEndDate > today;
      const endsInNext7Days =
        eventEndDate && eventEndDate <= sevenDaysFromToday;

      return (
        ((startsAfterToday && startsInNext7Days) ||
          (endsAfterToday && endsInNext7Days)) &&
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
            <span>Today</span>
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
            <span>Upcoming (Next 7 Days)</span>
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
  event: EventApi;
  isToday?: boolean;
  isUpcoming?: boolean;
}) => {
  const checkIn = formatDateTime(event.start || new Date());
  const checkOut = event.end ? formatDateTime(event.end) : undefined;

  let bookingType: string | null = null;
  if (isToday) {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const startYear = (event.start ?? new Date()).getFullYear();
    const startMonth = (event.start ?? new Date()).getMonth();
    const startDay = (event.start ?? new Date()).getDate();
    const startsToday =
      startYear === todayYear &&
      startMonth === todayMonth &&
      startDay === todayDay;

    const endsToday = event.end
      ? event.end.getFullYear() === todayYear &&
        event.end.getMonth() === todayMonth &&
        event.end.getDate() === todayDay
      : false;

    if (startsToday && endsToday) {
      bookingType = "Check-in & Check-out";
    } else if (startsToday) {
      bookingType = "Check-in";
    } else if (endsToday) {
      bookingType = "Check-out";
    }
  } else if (isUpcoming) {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const startsAfterToday = (event.start ?? new Date()) > today;
    const endsAfterToday = event.end && event.end > today;

    const sevenDaysFromToday = new Date();
    sevenDaysFromToday.setDate(today.getDate() + 7);
    sevenDaysFromToday.setHours(23, 59, 59, 999);

    const startsInNext7Days = (event.start ?? new Date()) <= sevenDaysFromToday;
    const endsInNext7Days = event.end && event.end <= sevenDaysFromToday;

    if (
      startsAfterToday &&
      startsInNext7Days &&
      endsAfterToday &&
      endsInNext7Days
    ) {
      bookingType = "Check-in / Check-out"; // Could span within the 7 days
    } else if (startsAfterToday && startsInNext7Days) {
      bookingType = "Check-in";
    } else if (endsAfterToday && endsInNext7Days) {
      bookingType = "Check-out";
    }
  }

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
        {event.title}
        {bookingType && (
          <span className='text-xs text-[#FBBF24] ml-1'>({bookingType})</span>
        )}
      </div>
      <div className='text-sm text-[#C4B5FD] mt-1'>
        <span className='font-medium text-[#FBBF24]'>Owner:</span>
        {event.extendedProps.ownerName}
      </div>

      <div className='text-sm text-[#C4B5FD] mt-1'>
        <span className='font-medium text-[#FBBF24]'>Check-in:</span> {checkIn}
      </div>

      {event.end && (
        <div className='text-sm text-[#C4B5FD] mt-1'>
          <span className='font-medium text-[#FBBF24]'>Check-out:</span>{" "}
          {checkOut}
        </div>
      )}

      <div
        className='mt-2 text-xs font-medium px-2 py-1 rounded-full inline-block'
        style={{
          backgroundColor: `${event.backgroundColor || "#9F7AEA"}20`,
          color: event.backgroundColor || "#E9D5FF",
          border: `1px solid ${event.backgroundColor || "#9F7AEA"}`,
        }}
      >
        {event.extendedProps.status}
      </div>
    </li>
  );
};

export default CalendarSidebar;
