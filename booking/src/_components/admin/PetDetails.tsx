"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog";
import React, { useState, useEffect } from "react";
import { PetData } from "../serverSide/FetchPetData";
import { ScrollArea } from "../ui/scroll-area";
import { DialogFooter } from "@/StoryComponents/ui/dialog";
import { Button } from "../ui/Button";
import PetRoomAssignment from "./PetRoomAssignment";
import { assignRoomToPet } from "../serverSide/FetchRoomData";

export interface PetDetailsProps extends PetData {
  owner: string;
  ownerId: string | null;
  ownerContactNumber: string;
  ownerEmail: string;
  onRoomAssignment: (petUuid: string, roomId: string, roomName: string) => void;
  children?: React.ReactNode;
};

export default function PetDetails({
  children,
  owner,
  ownerId,
  name,
  ownerContactNumber,
  ownerEmail,
  breed,
  age,
  petType,
  petUuid,
  isVaccinated,
  vitaminsOrMedications,
  isCompleted,
  allergies,
  size,
  checkInDate,
  checkInTime,
  checkOutDate,
  checkOutTime,
  room_name,
  room_id,
  onRoomAssignment

}: PetDetailsProps) {
  const [roomName, setRoomName] = useState(room_name);
  const [isOpen, setIsOpen] = useState(false)
  const [assignedRoomName, setAssignedRoomName] = useState(roomName);
  const [assignedRoomId, setAssignedRoomId] = useState(room_id);


  async function reAssignRoom(newRoomName: string, newRoomId: string) {
    setAssignedRoomName(newRoomName);
    setAssignedRoomId(newRoomId);

    const {message} = await assignRoomToPet(newRoomId, petUuid)
    alert(message)
  }

  useEffect(() => {
    if (!isOpen) {
      onRoomAssignment(petUuid, assignedRoomId, assignedRoomName)
    }
  }, [isOpen]);

  return (
    <div  >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        
        <DialogContent className="bg-purple-700 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold">
              {name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea>
            <div className="h-64 flex flex-col justify-between space-y-4 pr-4">
              <div className="text-gray-300">
                <dl className=" gap-y-3 text-sm">
                  <div className="grid grid-cols-2 col-span-2 border-b border-purple-400 pb-2">
                    <dt className="font-medium">Breed:</dt>
                    <dd className="text-right">{breed}</dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium">Age:</dt>
                    <dd className="text-right">{age}</dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium">Pet Type:</dt>
                    <dd className="text-right capitalize">{petType}</dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium">Vaccinated:</dt>
                    <dd className="text-right">
                      {isVaccinated ? "Yes" : "No"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2 ">
                    <dt className="font-medium">Vitamins/Medications:</dt>
                    <dd className="text-right">
                      {vitaminsOrMedications || "Not provided"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium">Allergies:</dt>
                    <dd className="text-right">
                      {allergies || "Not provided"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2 col-span-2 border-b border-purple-400 pb-2">
                    <dt className="font-medium">Size:</dt>
                    <dd className="text-right capitalize">
                      {size || "Undefined"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2 ">
                    <dt className="font-medium">Check-in:</dt>
                    <dd className="text-right capitalize">
                      { (checkInDate && checkInTime) ? checkInDate + " at " + checkInTime : "Undefined"}
                    </dd>                
                  </div>

                  <div className="grid grid-cols-2 ">
                    <dt className="font-medium">Check-out:</dt>
                    <dd className="text-right capitalize">
                      { (checkOutDate && checkOutTime) ? checkOutDate + " at " + checkOutTime : "Undefined"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2 ">
                    <dt className="font-medium">Room:</dt>
                    <dd className="text-right capitalize">
                      { (room_name) ? <span className="text-green-400 font-semibold">{room_name}</span> : assignedRoomName ? <span className="text-green-400 font-semibold"> {assignedRoomName}</span>: "Not assigned yet"}
                    </dd>
                  </div>


                </dl>
              </div>


            </div>
          </ScrollArea>
          <div className="bg-purple-800 p-3 rounded-lg text-sm text-white">
            <div className="flex flex-col space-y-1">
              <div>
                <span className="font-medium">Owner:</span> {owner}
              </div>
              <div>
                <span className="font-medium">Contact:</span> {ownerContactNumber}
              </div>
              <div>
                <span className="font-medium">Email:</span> {ownerEmail}
              </div>
            </div>
          </div>
          <DialogFooter>
            <PetRoomAssignment
              pet_name={name}
              onClose={reAssignRoom}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              checkInDateTime={checkInDate + 'T' + checkInTime}
              checkOutDateTime={checkOutDate + 'T' + checkOutTime}
            >
              <Button className="bg-violet-800 hover:bg-violet-700 active:bg-violet-900">
                Assign Room
              </Button>
            </PetRoomAssignment>
          </DialogFooter>
          
        </DialogContent>
      </Dialog>
    </div>
  );
}