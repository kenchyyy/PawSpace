import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventClickArg,
  EventApi,
  EventInput,
  EventContentArg,
} from "@fullcalendar/core";
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
  // Helper to get emoji by serviceType
  const getServiceEmoji = (serviceType: string | undefined) => {
    switch (serviceType?.toLowerCase()) {
      case "boarding":
        return "🏨";
      case "grooming":
        return "✂️";
      default:
        return "🐾"; // fallback emoji
    }
  };

  // Customize event content to show emoji instead of time
  const eventContent = (arg: EventContentArg) => {
    const serviceType = arg.event.extendedProps.serviceType as
      | string
      | undefined;
    const emoji = getServiceEmoji(serviceType);

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: 6 }}>{emoji}</span>
        <span>{arg.event.title}</span>
      </div>
    );
  };

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
      allDayContent={false}
      allDaySlot={false}
      eventContent={eventContent} // <-- Add this prop
    />
  );
};

export default CalendarComponent;
