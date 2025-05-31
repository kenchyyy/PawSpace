"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/StoryComponents/ui/dialog";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import {
  BookingEvent,
  MealInstruction,
  PetWithDetails,
} from "@/_components/Calendar/types";

type CalendarModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: BookingEvent | null;
};

const CalendarModal = ({ open, onOpenChange, event }: CalendarModalProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!event) return null;

  const {
    bookingId = "N/A",
    ownerName = "N/A",
    contactNumber = "N/A",
    status = "Unknown",
    specialRequests = "",
    totalAmount = 0,
    serviceType = "N/A",
    pets = [],
    checkIn,
    checkOut,
  } = event.extendedProps;

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
        backgroundColor = "#10B981";
        color = "#064E3B";
        borderColor = "#059669";
        break;
      case "ongoing":
        backgroundColor = "#F59E0B";
        color = "#78350F";
        borderColor = "#D97706";
        break;
      case "completed":
        backgroundColor = "#3B82F6";
        color = "#1E40AF";
        borderColor = "#2563EB";
        break;
      default:
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

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "Not specified";
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full lg:w-3/12 bg-gradient-to-b from-[#1E1B4B] to-[#2A0D45] shadow-lg border border-[#4C1D95] rounded-md dialog-content pb-0.5'>
        <DialogHeader className='py-2 text-xl font-bold text-[#FBBF24] px-4 border-b border-[#9F7AEA]'>
          <DialogTitle className='text-lg font-semibold text-[#E9D5FF]'>
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className='px-4 py-2 bg-[#1E1B4B] border border-[#4C1D95] shadow-md rounded-md'>
          <h4 className='text-md font-semibold text-[#E9D5FF] mb-1'>
            Booking Overview
          </h4>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Booking ID:</span>{" "}
            {bookingId}
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Service:</span>{" "}
            {serviceType}
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Owner:</span>{" "}
            {ownerName} ({contactNumber})
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>
              Overall Check-in:
            </span>{" "}
            {formatDateTime(checkIn)}
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>
              Overall Check-out:
            </span>{" "}
            {formatDateTime(checkOut)}
          </p>
          <p className='text-sm text-[#C4B5FD] mb-0.5'>
            <span className='font-medium text-[#FBBF24]'>Total Amount:</span>{" "}
            {formatCurrency(totalAmount ?? 0)}
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

        {isExpanded && (
          <div className='px-0.3 mt-2 space-y-4'>
            <div className='bg-[#1E1B4B] border border-[#4C1D95] shadow-md px-4 py-3 rounded-md'>
              <h4 className='text-md font-semibold text-[#E9D5FF] mb-3'>
                Pets ({pets.length})
              </h4>

              {pets.length > 0 ? (
                pets.map((pet, index) => (
                  <div
                    key={`${pet.petName}-${index}`}
                    className='mb-4 border-b border-[#4C1D95] pb-3 last:border-b-0'
                  >
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2'>
                      <h5 className='text-sm font-semibold text-[#FBBF24]'>
                        {pet.petName}{" "}
                        <span className='text-[#C4B5FD] font-normal'>
                          ({pet.petType} - {pet.petBreed || "Unknown"})
                        </span>
                      </h5>
                      <span className='text-xs bg-[#2A0D45] text-[#E9D5FF] px-2 py-1 rounded-full border border-[#4C1D95]'>
                        {pet.serviceType === "boarding"
                          ? "Boarding"
                          : "Grooming"}
                      </span>
                    </div>

                    <div className='mb-2 space-y-1'>
                      {pet.checkIn && (
                        <p className='text-xs text-[#C4B5FD]'>
                          <span className='font-medium text-[#FBBF24]'>
                            {pet.serviceType === "grooming"
                              ? "Service Time:"
                              : "Check-in:"}
                          </span>{" "}
                          {formatDateTime(pet.checkIn)}
                        </p>
                      )}
                      {pet.checkOut && (
                        <p className='text-xs text-[#C4B5FD]'>
                          <span className='font-medium text-[#FBBF24]'>
                            Check-out:
                          </span>{" "}
                          {formatDateTime(pet.checkOut)}
                        </p>
                      )}
                    </div>

                    {pet.serviceType === "boarding" && pet.mealInstructions ? (
                      <div className='bg-[#2A0D45] border border-[#4C1D95] px-3 py-2 rounded-md'>
                        <h6 className='text-xs font-semibold text-[#FBBF24] mb-1'>
                          Meal Instructions
                        </h6>
                        <ul className='text-xs text-[#C4B5FD] list-disc list-inside space-y-0.5'>
                          <li>
                            <strong>Food:</strong> {pet.mealInstructions.food}
                          </li>
                          <li>
                            <strong>Meal Type:</strong>{" "}
                            {pet.mealInstructions.mealType}
                          </li>
                          <li>
                            <strong>Time:</strong> {pet.mealInstructions.time}
                          </li>
                          {pet.mealInstructions.notes && (
                            <li>
                              <strong>Notes:</strong>{" "}
                              {pet.mealInstructions.notes}
                            </li>
                          )}
                        </ul>
                      </div>
                    ) : pet.serviceType === "boarding" ? (
                      <p className='text-xs text-[#9F7AEA] italic'>
                        No meal instructions
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className='text-sm text-[#C4B5FD]'>No pets available.</p>
              )}
            </div>

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
