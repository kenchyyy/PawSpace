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
};

type ExtendedProps = {
  ownerName?: string;
  contactNumber?: string;
  status?: string;
  specialRequests?: string;
  totalAmount?: number;
  serviceType?: string;
  pets?: PetWithDetails[];
  checkIn?: string | null;
  checkOut?: string | null;
};

type CalendarModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: EventInput | null;
};

const CalendarModal = ({ open, onOpenChange, event }: CalendarModalProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!event) return null;

  const {
    ownerName = "N/A",
    contactNumber = "N/A",
    status = "Unknown",
    specialRequests = "",
    totalAmount,
    serviceType = "N/A",
    pets = [],
    checkIn,
    checkOut,
  } = event.extendedProps as ExtendedProps;

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusStyles = (status: string) => {
    let backgroundColor = "";
    let color = "";
    let borderColor = "";

    switch (status?.toLowerCase()) {
      case "confirmed":
        backgroundColor = "#10B981"; // emerald-500 (green)
        color = "#064E3B"; // emerald-900
        borderColor = "#059669"; // emerald-600
        break;
      case "ongoing":
        backgroundColor = "#F59E0B"; // amber-500
        color = "#78350F"; // amber-900
        borderColor = "#D97706"; // amber-600
        break;
      case "completed":
        backgroundColor = "#3B82F6"; // blue-500
        color = "#1E40AF"; // blue-900
        borderColor = "#2563EB"; // blue-600
        break;
      default:
        backgroundColor = "#4B5563"; // gray-600
        color = "#F3F4F6"; // gray-100
        borderColor = "#6B7280"; // gray-500
    }
    return {
      backgroundColor,
      color,
      borderColor,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full lg:w-3/12 bg-gradient-to-b from-[#1E1B4B] to-[#2A0D45] shadow-lg border border-[#4C1D95] rounded-md dialog-content pb-0.5'>
        <DialogHeader className='py-2 text-xl font-bold text-[#FBBF24] px-4 border-b border-[#9F7AEA]'>
          <DialogTitle className='text-lg font-semibold text-[#E9D5FF]'>
            Booking Details
          </DialogTitle>
        </DialogHeader>

        {/* Booking Overview */}
        <div className='px-4 py-2 bg-[#1E1B4B] border border-[#4C1D95] shadow-md rounded-md'>
          <h4 className='text-md font-semibold text-[#E9D5FF] mb-1'>
            Booking Overview
          </h4>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Service:</span>{" "}
            {serviceType}
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Owner:</span>{" "}
            {ownerName} ({contactNumber})
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Check-in:</span>{" "}
            {formatDateTime(checkIn)}
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Check-out:</span>{" "}
            {formatDateTime(checkOut)}
          </p>
          {status && (
            <p className='text-sm text-[#C4B5FD] mb-1'>
              <span className='font-medium text-[#FBBF24]'>Status:</span>{" "}
              <span
                className='inline-block px-2 py-0.5 rounded-full text-xs font-medium'
                style={getStatusStyles(status)}
              >
                {status}
              </span>
            </p>
          )}
        </div>

        {/* Expanded Information */}
        {isExpanded && (
          <div className='px-0.3 mt-2 space-y-4'>
            <div className='bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md'>
              <h4 className='text-md font-semibold text-[#E9D5FF] mb-3'>
                Pets
              </h4>

              {pets.length > 0 ? (
                pets.map(({ petName, petBreed, mealInstructions }) => (
                  <div key={petName} className='mb-4'>
                    <h5 className='text-sm font-semibold text-[#FBBF24] mb-1'>
                      {petName}{" "}
                      <span className='text-[#C4B5FD] font-normal'>
                        ({petBreed || "Unknown"})
                      </span>
                    </h5>

                    {mealInstructions ? (
                      <ul className='text-sm text-[#C4B5FD] list-disc list-inside'>
                        <li>
                          <strong>Food:</strong> {mealInstructions.food}
                        </li>
                        <li>
                          <strong>Meal Type:</strong>{" "}
                          {mealInstructions.mealType}
                        </li>
                        <li>
                          <strong>Time:</strong> {mealInstructions.time}
                        </li>
                        {mealInstructions.notes && (
                          <li>
                            <strong>Notes:</strong> {mealInstructions.notes}
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className='text-sm text-[#C4B5FD]'>
                        No meal instructions
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className='text-sm text-[#C4B5FD]'>
                  No pets or meal instructions available.
                </p>
              )}
            </div>

            {/* Special Requests */}
            {specialRequests && (
              <div className='bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md'>
                <h4 className='text-md font-semibold text-[#E9D5FF] mb-1'>
                  Special Requests
                </h4>
                <p className='text-sm text-[#C4B5FD]'>{specialRequests}</p>
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <div className='flex justify-center mt-2'>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className='text-[#9F7AEA] hover:text-[#E9D5FF] transition-colors duration-200 focus:outline-none'
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
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
