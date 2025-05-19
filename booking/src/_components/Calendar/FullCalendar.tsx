"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventApi, EventInput } from "@fullcalendar/core";
import "./CalendarStyles.css";

type CalendarProps = {
  events: EventInput[];
  loading?: boolean;
  onEventClick?: (event: EventClickArg) => void;
  onEventsSet?: (events: EventApi[]) => void;
  calendarRef?: React.Ref<any>;
};

const CalendarComponent = ({
  events,
  loading = false,
  onEventClick,
  onEventsSet,
  calendarRef,
}: CalendarProps) => {
  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      initialView='dayGridMonth'
      editable={false}
      selectable={false}
      dayMaxEvents={true}
      events={events}
      eventClick={onEventClick}
      eventsSet={onEventsSet}
      loading={() => loading}
      eventDisplay='block'
      eventClassNames='event-with-status'
    />
  );
};

export default CalendarComponent;
