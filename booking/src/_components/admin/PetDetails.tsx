"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog";
import React, { useState, useEffect } from "react";
import { BoardingPetData } from "../serverSide/FetchPetData";
import { ScrollArea } from "../ui/scroll-area";
import { DialogFooter } from "@/StoryComponents/ui/dialog";
import { Button } from "../ui/Button";
import PetRoomAssignment from "./PetRoomAssignment";
import { assignRoomToPet } from "../serverSide/FetchRoomData";
import { useRefresh } from "../contexts/RefreshContext";
import { MealInstruction } from "../Booking Form/types";
import { truncate } from "./helper"; // Make sure this is robust!

export interface PetDetailsProps extends BoardingPetData {
  owner: string;
  ownerId: string | null;
  ownerContactNumber: string;
  ownerEmail: string;
  status: string;
  onRoomAssignment?: (petUuid: string, roomId: string, roomName: string) => void;
  children?: React.ReactNode;
  bookingType: "grooming" | "boarding";
};

const mealTypes = ["breakfast", "lunch", "dinner"] as const;

export default function PetDetails({
  petUuid,
  name,
  age,
  petType,
  breed,
  isVaccinated,
  allergies,
  vitaminsOrMedications,
  size,
  isCompleted,
  boardingIdExtention,
  checkInDate,
  checkInTime,
  checkOutDate,
  checkOutTime,
  boardingType,
  room_name,
  room_type,
  room_id,
  mealInstructions,
  groomingIdExtention,
  owner,
  ownerId,
  ownerContactNumber,
  ownerEmail,
  status,
  bookingType,
  onRoomAssignment,
  children,
  
}: PetDetailsProps) {
  const [roomName, setRoomName] = useState(room_name);
  const [isOpen, setIsOpen] = useState(false)
  const [assignedRoomName, setAssignedRoomName] = useState(roomName);
  const [assignedRoomId, setAssignedRoomId] = useState(room_id);
  const { refreshRooms } = useRefresh();

  async function reAssignRoom(newRoomName: string, newRoomId: string) {
    setAssignedRoomName(newRoomName);
    setAssignedRoomId(newRoomId);
    assignRoomToPet(newRoomId, petUuid)
    refreshRooms()
  }

  useEffect(() => {
    if (!isOpen && onRoomAssignment) {
      onRoomAssignment(
        petUuid,
        assignedRoomId ?? "",
        assignedRoomName ?? ""
      );
    }
  }, [isOpen]);

  function groupInstructionsByType(instructions: any) {
    return mealTypes.reduce((acc, type) => {
      acc[type] = instructions.filter((i: { meal_type: string; }) => i.meal_type === type);
      return acc;
    }, {} as Record<typeof mealTypes[number], MealInstruction[]>);
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        
        <DialogContent className="bg-purple-700 rounded-lg shadow-xl">
          <DialogHeader>
            {/* Dialog title: truncate and allow word break */}
            <DialogTitle className="text-orange-400 text-2xl font-bold break-words max-w-xs">
              {truncate(name, 30)}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="bg-purple-800 p-1 rounded">
            <div className="h-64 flex flex-col justify-between space-y-4 pr-4">
              <div className="text-gray-300">
                <dl className="gap-y-3 text-sm">
                  <div className="grid grid-cols-2 col-span-2 border-b border-purple-400 pb-2">
                    <dt className="font-medium text-yellow-300">Breed:</dt>
                    <dd className="text-right break-all">{truncate(breed, 20)}</dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium text-yellow-300">Age:</dt>
                    <dd className="text-right">{age}</dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium text-yellow-300">Pet Type:</dt>
                    <dd className="text-right capitalize">{truncate(petType, 20)}</dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium text-yellow-300">Vaccinated:</dt>
                    <dd className="text-right">{isVaccinated ? "Yes" : "No"}</dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium text-yellow-300">Vitamins/Medications:</dt>
                    <dd className="text-right break-all">
                      {truncate(vitaminsOrMedications, 20) || "Not provided"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium text-yellow-300">Allergies:</dt>
                    <dd className="text-right break-all">
                      {truncate(allergies, 20) || "Not provided"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2 col-span-2 border-b border-purple-400 pb-2">
                    <dt className="font-medium text-yellow-300">Size:</dt>
                    <dd className="text-right capitalize">
                      {truncate(size, 20) || "Undefined"}
                    </dd>
                  </div>
                
                <div>
                  <div className="grid grid-cols-2">
                    <dt className="font-medium text-yellow-300">Check-in:</dt>
                    <dd className="text-right capitalize break-all">
                      {(checkInDate && checkInTime) ? checkInDate + " at " + checkInTime : "Undefined"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium text-yellow-300">Check-out:</dt>
                    <dd className="text-right capitalize break-all">
                      {(checkOutDate && checkOutTime) ? checkOutDate + " at " + checkOutTime : "Undefined"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium text-yellow-300">Boarding Type:</dt>
                    <dd className="text-right capitalize break-all">
                      {boardingType}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2 col-span-2 border-b border-purple-400 pb-2">
                    <dt className="font-medium text-yellow-300">Room:</dt>
                    <dd className="text-right capitalize break-all">
                      {(room_name) ? (
                        <span className="text-green-400 font-semibold">{truncate(room_name, 20)}</span>
                      ) : assignedRoomName ? (
                        <span className="text-green-400 font-semibold">{truncate(assignedRoomName, 20)}</span>
                      ) : "Not assigned yet"}
                    </dd>
                  </div>
                  

                  <div className="grid grid-cols-2 col-span-2 border-b border-purple-400 pb-2">
                    <dt className="font-medium text-yellow-300 align-top">Meal Instructions:</dt>
                    <dd className="text-right">
                      <div className="flex flex-col gap-2 text-left">
                        {mealInstructions && mealInstructions.length > 0 ? (
                          <>
                            {mealTypes.map(type => {
                              const grouped = mealInstructions.filter(i => i.meal_type === type);
                              if (!grouped.length) return null;
                              return (
                                <div key={type} className="mb-2">
                                  <div className="font-bold capitalize text-orange-300 mb-1">{type}</div>
                                  <div className="space-y-1">
                                    {grouped.map((instruction, idx) => (
                                      <div
                                        key={instruction.id}
                                        className="bg-purple-900/40 border-l-4 border-purple-500 p-2 rounded"
                                      >
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="text-purple-200">
                                            ⏱ {instruction.time ? truncate(instruction.time, 15) : "N/A"}
                                          </span>
                                          <span className="text-emerald-300 font-semibold">
                                            { instruction.food? truncate(instruction.food, 20) : "No specific food"}
                                          </span>
                                        </div>
                                        {instruction.notes && (
                                          <div className="mt-1 text-purple-300 italic text-xs break-words max-h-20 overflow-auto">
                                            📝 {instruction.notes}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <span className="text-sm text-purple-300">No meal instructions provided</span>
                        )}
                      </div>
                    </dd>
                  </div>
                </div>
                  
                </dl>
              </div>
            </div>
          </ScrollArea>
          <div className="bg-purple-800 p-3 rounded-lg text-sm text-white">
            <div className="flex flex-col space-y-1">
              <div>
                <span className="font-medium text-yellow-300">Owner:</span>{" "}
                <span className="break-all">{owner}</span>
              </div>
              <div>
                <span className="font-medium text-yellow-300">Contact:</span>{" "}
                <span className="break-all">{ownerContactNumber}</span>
              </div>
              <div>
                <span className="font-medium text-yellow-300">Email:</span>{" "}
                <span className="break-all">{ownerEmail}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            {bookingType === 'grooming' ? 

            <div>

            </div>
            
            : 

              status !== "completed" && status !== "cancelled" &&
              <PetRoomAssignment
                pet_name={name}
                onClose={reAssignRoom}
                checkInDate={checkInDate ?? ""}
                checkOutDate={checkOutDate ?? ""}
                checkInDateTime={`${checkInDate ?? ""}T${checkInTime ?? ""}`}
                checkOutDateTime={`${checkOutDate ?? ""}T${checkOutTime ?? ""}`}
              >
                <Button className="bg-violet-800 hover:bg-violet-700 active:bg-violet-900">
                  Assign Room
                </Button>
              </PetRoomAssignment>
            
            }
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
