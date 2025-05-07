"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/StoryComponents/ui/dialog";
import { EventInput } from "@fullcalendar/core";

type CalendarModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: EventInput | null;
};

const CalendarModal = ({ open, onOpenChange, event }: CalendarModalProps) => {
  if (!event) return null;

  const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formatDate = (date: Date | null | undefined) => {
    if (date instanceof Date) {
      return new Intl.DateTimeFormat(undefined, dateTimeFormatOptions).format(
        date
      );
    }
    return "Not set";
  };

  const getStatusStyles = (status: string) => {
    let backgroundColor = "";
    let color = "";
    let borderColor = "";

    if (status.toLowerCase() === "confirmed") {
      backgroundColor = "#14532D"; // Dark green
      color = "#86EFAC"; // Light green
      borderColor = "#4CAF50"; // Slightly lighter green
    } else if (status.toLowerCase() === "pending") {
      backgroundColor = "#A16207"; // Darker yellow/orange
      color = "#FCD34D"; // Lighter yellow
      borderColor = "#FBBF24"; // Slightly lighter yellow
    } else {
      // Default styles (you can adjust these or add more status conditions)
      backgroundColor = "#4B5563"; // Gray
      color = "#F3F4F6"; // Light gray
      borderColor = "#6B7280"; // Slightly lighter gray
    }

    return {
      backgroundColor,
      color,
      borderColor,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full lg:w-3/12 bg-gradient-to-b from-[#1E1B4B] to-[#2A0D45] shadow-lg border border-[#4C1D95] p-4 rounded-md dialog-content'>
        <DialogHeader className='py-6 text-xl font-bold text-[#FBBF24] px-4 border-b border-[#9F7AEA] flex items-center gap-2 mb-4'>
          <DialogTitle className='text-lg font-semibold text-[#E9D5FF]'>
            Booking Details
          </DialogTitle>
        </DialogHeader>
        {/* Booking Information */}
        <div className='px-4'>
          <h4 className='text-md font-semibold text-[#E9D5FF] mb-2'>
            Booking Information
          </h4>
          <div className='bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md mb-3'>
            <p className='text-sm text-[#C4B5FD] mb-1'>
              <span className='font-medium text-[#FBBF24]'>Check-in:</span>{" "}
              {formatDate(
                event.start
                  ? typeof event.start === "string" ||
                    typeof event.start === "number"
                    ? new Date(event.start)
                    : event.start instanceof Date
                    ? event.start
                    : null
                  : null
              )}
            </p>
            <p className='text-sm text-[#C4B5FD] mb-1'>
              <span className='font-medium text-[#FBBF24]'>Check-out:</span>{" "}
              {formatDate(
                event.end
                  ? typeof event.end === "string" ||
                    typeof event.end === "number"
                    ? new Date(event.ebd)
                    : event.end instanceof Date
                    ? event.end
                    : null
                  : null
              )}
            </p>
            {event.extendedProps?.status && (
              <p className='text-sm text-[#C4B5FD] mb-1'>
                <span className='font-medium text-[#FBBF24]'>Status:</span>{" "}
                <span
                  className='inline-block px-2 py-0.5 rounded-full text-xs font-medium'
                  style={getStatusStyles(event.extendedProps.status)}
                >
                  {event.extendedProps.status}
                </span>
              </p>
            )}
            {event.extendedProps?.departure && (
              <p className='text-sm text-[#C4B5FD] mb-1'>
                <span className='font-medium text-[#FBBF24]'>Departure:</span>{" "}
                {formatDate(new Date(event.extendedProps.departure))}
              </p>
            )}
            {event.extendedProps?.returnDate && (
              <p className='text-sm text-[#C4B5FD] mb-1'>
                <span className='font-medium text-[#FBBF24]'>Return:</span>{" "}
                {formatDate(new Date(event.extendedProps.returnDate))}
              </p>
            )}
            {event.extendedProps?.bookingNotes && (
              <p className='text-sm text-[#C4B5FD]'>
                <span className='font-medium text-[#FBBF24]'>Notes:</span>{" "}
                {event.extendedProps.bookingNotes}
              </p>
            )}
          </div>

          {/* Pet Information */}
          <h4 className='text-md font-semibold text-[#E9D5FF] mb-2'>
            Pet Information
          </h4>
          <div className='bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md mb-3'>
            {event.extendedProps?.petName && (
              <p className='text-sm text-[#C4B5FD] mb-1'>
                <span className='font-medium text-[#FBBF24]'>Name:</span>{" "}
                {event.extendedProps.petName}
              </p>
            )}
            {event.extendedProps?.petType && (
              <p className='text-sm text-[#C4B5FD] mb-1'>
                <span className='font-medium text-[#FBBF24]'>Type:</span>{" "}
                {event.extendedProps.petType}
              </p>
            )}
            {event.extendedProps?.petBreed && (
              <p className='text-sm text-[#C4B5FD]'>
                <span className='font-medium text-[#FBBF24]'>Breed:</span>{" "}
                {event.extendedProps.petBreed}
              </p>
            )}
          </div>

          {/* Owner Information */}
          <h4 className='text-md font-semibold text-[#E9D5FF] mb-2'>
            Owner Information
          </h4>
          <div className='bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md'>
            {event.extendedProps?.ownerName && (
              <p className='text-sm text-[#C4B5FD] mb-1'>
                <span className='font-medium text-[#FBBF24]'>Name:</span>{" "}
                {event.extendedProps.ownerName}
              </p>
            )}
            {event.extendedProps?.ownerPhone && (
              <p className='text-sm text-[#C4B5FD] mb-1'>
                <span className='font-medium text-[#FBBF24]'>Phone:</span>{" "}
                {event.extendedProps.ownerPhone}
              </p>
            )}
            {event.extendedProps?.ownerEmail && (
              <p className='text-sm text-[#C4B5FD]'>
                <span className='font-medium text-[#FBBF24]'>Email:</span>{" "}
                {event.extendedProps.ownerEmail}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;
