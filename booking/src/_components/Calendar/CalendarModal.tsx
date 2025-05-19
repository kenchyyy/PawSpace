"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/StoryComponents/ui/dialog";
import { EventInput } from "@fullcalendar/core";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type CalendarModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: EventInput | null;
};

const CalendarModal = ({ open, onOpenChange, event }: CalendarModalProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
      backgroundColor = "#14532D";
      color = "#86EFAC";
      borderColor = "#4CAF50";
    } else if (status.toLowerCase() === "pending") {
      backgroundColor = "#A16207";
      color = "#FCD34D";
      borderColor = "#FBBF24";
    } else {
      backgroundColor = "#4B5563";
      color = "#F3F4F6";
      borderColor = "#6B7280";
    }

    return {
      backgroundColor,
      color,
      borderColor,
    };
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full lg:w-3/12 bg-gradient-to-b from-[#1E1B4B] to-[#2A0D45] shadow-lg border border-[#4C1D95] rounded-md dialog-content pb-3'>
        <DialogHeader className='py-4 text-xl font-bold text-[#FBBF24] px-4 border-b border-[#9F7AEA]'>
          <DialogTitle className='text-lg font-semibold text-[#E9D5FF]'>
            Booking Details
          </DialogTitle>
        </DialogHeader>

        {/* Initial Booking Information Container */}
        <div className='px-4 py-3 bg-[#1E1B4B] border border-[#4C1D95] shadow-md rounded-md mt-2'>
          <h4 className='text-md font-semibold text-[#E9D5FF] mb-1'>
            Booking Overview
          </h4>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Service:</span>{" "}
            {event.extendedProps?.serviceType || "N/A"}
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Owner:</span>{" "}
            {event.extendedProps?.ownerName} (
            {event.extendedProps?.contactNumber})
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
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
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Check-out:</span>{" "}
            {formatDate(
              event.end
                ? typeof event.end === "string" || typeof event.end === "number"
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
        </div>

        {/* Expanded Information */}
        {isExpanded && (
          <div className='px-0.3 mt-2'>
            <div className='flex gap-4 mb-2'>
              {/* Pet Information */}
              <div className='flex-1 bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md'>
                <h4 className='text-md font-semibold text-[#E9D5FF] mb-1'>
                  Pet Information
                </h4>
                {event.extendedProps?.petName && (
                  <p className='text-sm text-[#C4B5FD] mb-0.5'>
                    <span className='font-medium text-[#FBBF24]'>Name:</span>{" "}
                    {event.extendedProps.petName}
                  </p>
                )}
                {event.extendedProps?.petType && (
                  <p className='text-sm text-[#C4B5FD] mb-0.5'>
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
                {event.extendedProps?.mealInstructions &&
                typeof event.extendedProps.mealInstructions === "object" ? (
                  <div className='mt-0.5'>
                    <p className='text-sm text-[#C4B5FD]'>
                      <span className='font-medium text-[#FBBF24]'>
                        Meal Instructions:
                      </span>
                    </p>
                    <p className='text-sm text-[#C4B5FD] ml-2'>
                      <span className='font-medium text-[#9F7AEA]'>Food:</span>{" "}
                      {event.extendedProps.mealInstructions.food}
                      <br />
                      <span className='font-medium text-[#9F7AEA]'>
                        Type:
                      </span>{" "}
                      {event.extendedProps.mealInstructions.mealType}
                      <br />
                      <span className='font-medium text-[#9F7AEA]'>
                        Time:
                      </span>{" "}
                      {event.extendedProps.mealInstructions.time}
                      {event.extendedProps.mealInstructions.notes && (
                        <>
                          <br />
                          <span className='font-medium text-[#9F7AEA]'>
                            Notes:
                          </span>{" "}
                          {event.extendedProps.mealInstructions.notes}
                        </>
                      )}
                    </p>
                  </div>
                ) : typeof event.extendedProps?.mealInstructions ===
                  "string" ? (
                  <div className='mt-2'>
                    <p className='text-sm text-[#C4B5FD]'>
                      <span className='font-medium text-[#FBBF24]'>
                        Meal Instructions:
                      </span>
                    </p>
                    <p className='text-sm text-[#C4B5FD] ml-2'>
                      {event.extendedProps.mealInstructions}
                    </p>
                  </div>
                ) : (
                  <p className='text-sm text-[#C4B5FD] mt-2'>
                    <span className='font-medium text-[#FBBF24]'>
                      Meal Instructions:
                    </span>{" "}
                    Not Available
                  </p>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            {event.extendedProps?.bookingNotes && (
              <div className='bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md mb-2'>
                <h4 className='text-md font-semibold text-[#E9D5FF] mb-1'>
                  Booking Notes
                </h4>
                <p className='text-sm text-[#C4B5FD]'>
                  {event.extendedProps.bookingNotes}
                </p>
              </div>
            )}

            {/* Departure and Return Dates */}
            <div className='flex gap-4 mb-2'>
              {event.extendedProps?.departure && (
                <div className='flex-1 bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md'>
                  <p className='text-sm text-[#C4B5FD] mb-0.5'>
                    <span className='font-medium text-[#FBBF24]'>
                      Departure:
                    </span>
                    {formatDate(new Date(event.extendedProps.departure))}
                  </p>
                </div>
              )}
              {event.extendedProps?.returnDate && (
                <div className='flex-1 bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md'>
                  <p className='text-sm text-[#C4B5FD] mb-0.5'>
                    <span className='font-medium text-[#FBBF24]'>Return:</span>
                    {formatDate(new Date(event.extendedProps.returnDate))}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expand/Collapse Arrow at the Bottom */}
        <div className='flex justify-center mt-2'>
          <button
            onClick={toggleExpand}
            className='text-[#9F7AEA] hover:text-[#E9D5FF] transition-colors duration-200 focus:outline-none'
            tabIndex={-1}
          >
            {isExpanded ? (
              <FaChevronUp className='h-6 w-6' />
            ) : (
              <FaChevronDown className='h-6 w-6' />
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;
