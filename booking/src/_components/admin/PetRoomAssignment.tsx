"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/Button";
import { getAllRooms, RoomData, getPetsSceduledForRoomStay, assignRoomToPet } from "../serverSide/FetchRoomData";
import { ScrollArea } from "../ui/scroll-area";
import { RoomButton } from "./RoomButton";

interface PetRoomAssignmentProps {
  onClose: (newRoom: string, newRoomId: string) => void;
  pet_name: string;
  children?: React.ReactNode;
  checkInDateTime: string;  // ISO date string, e.g. "2025-05-21"
  checkOutDate: string;
  checkInDate: string;
  checkOutDateTime: string; // ISO date string
}

export interface PetSummary {
  petUuid: string;
  name: string;
  petType: string;
  breed: string;
  checkInDate?: string;   // Added these fields
  checkOutDate?: string;
}





export default function PetRoomAssignment({
  onClose,
  pet_name,
  children,
  checkInDate,
  checkInDateTime,
  checkOutDate,
  checkOutDateTime
}: PetRoomAssignmentProps) {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<{ name: string; id: string } | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [errorRooms, setErrorRooms] = useState<string | null>(null);
  const hiddenbutton = useRef<HTMLButtonElement>(null);

  // Store pets per roomId
  const [petsByRoom, setPetsByRoom] = useState<Record<string, PetSummary[]>>({});
  const [loadingPetsByRoom, setLoadingPetsByRoom] = useState<Record<string, boolean>>({});
  const [errorPetsByRoom, setErrorPetsByRoom] = useState<Record<string, string | null>>({});

  // Load all rooms on mount
  useEffect(() => {
    const loadRooms = async () => {
      setIsLoadingRooms(true);
      try {
        const fetchedRooms = await getAllRooms();
        if (fetchedRooms && fetchedRooms.length > 0) {
          setRooms(fetchedRooms);
        } else {
          setErrorRooms("No rooms available to assign.");
        }
      } catch (err) {
        setErrorRooms("An unexpected error occurred while loading rooms.");
        console.error(err);
      } finally {
        setIsLoadingRooms(false);
      }
    };
    loadRooms();
  }, []);

  // For each room, load pets scheduled overlapping the check-in date
  useEffect(() => {
    if (rooms.length === 0) return;

    rooms.forEach((room) => {
      // Avoid duplicate fetches
      if (petsByRoom[room.id]) return;

      // Mark loading
      setLoadingPetsByRoom((prev) => ({ ...prev, [room.id]: true }));
      setErrorPetsByRoom((prev) => ({ ...prev, [room.id]: null }));

      // Fetch pets scheduled for this room with check-in date filter
      getPetsSceduledForRoomStay(checkInDateTime, checkOutDateTime, room.id.toString()) // petUuid param empty because we want all pets
        .then(({ returnData, message }) => {
          if (!returnData) {
            setErrorPetsByRoom((prev) => ({ ...prev, [room.id]: message || "Failed to fetch pets" }));
            setPetsByRoom((prev) => ({ ...prev, [room.id]: [] }));
          } else {
            // Map to PetSummary including check-in/out dates
            const pets: PetSummary[] = returnData.map((pet: any) => ({
              petUuid: pet.petUuid,
              name: pet.name,
              petType: pet.petType,
              breed: pet.breed,
              checkInDate: pet.checkInDate,
              checkOutDate: pet.checkOutDate,
            }));
            setPetsByRoom((prev) => ({ ...prev, [room.id]: pets }));
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorPetsByRoom((prev) => ({ ...prev, [room.id]: "Unexpected error occurred" }));
          setPetsByRoom((prev) => ({ ...prev, [room.id]: [] }));
        })
        .finally(() => {
          setLoadingPetsByRoom((prev) => ({ ...prev, [room.id]: false }));
        });
    });
  }, [rooms, checkInDate, petsByRoom]);

  const handleConfirm = () => {
    if (!selectedRoom) return;
    onClose(selectedRoom.name, selectedRoom.id);
     hiddenbutton.current?.click()

  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-purple-700 text-white border-purple-600">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Assign a room for <span className="font-extrabold text-orange-400">{pet_name}</span>
          </DialogTitle>
          <DialogDescription className="text-white" asChild>
            <div className=" flex flex-col">
              <span> Assign their room scheduled at</span>
              <span className="text-orange-200"> {checkInDateTime.replace("T" , " at ")}</span>
              <span> to </span>
              <span className="text-orange-200"> {checkOutDateTime.replace("T" , " at ")}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-4 h-96 rounded-md border border-purple-600 bg-purple-800 p-2">
          {isLoadingRooms ? (
            <div className="text-center py-4">Loading rooms...</div>
          ) : errorRooms ? (
            <div className="text-red-300 p-4">{errorRooms}</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {rooms.map((room) => (
                <RoomButton
                  key={room.id}
                  room={room}
                  isSelected={selectedRoom?.id === String(room.id)}
                  onSelect={setSelectedRoom}
                  petsInRoom={petsByRoom[room.id] ?? []}
                  loadingPets={loadingPetsByRoom[room.id] ?? false}
                  errorPets={errorPetsByRoom[room.id] ?? null}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="outline"
            className="bg-gray-200 text-black hover:bg-gray-300"
            onClick={() => onClose("", "")}
          >
            Cancel
          </Button>
          <Button
            className="bg-violet-800 hover:bg-violet-700 active:bg-violet-900 disabled:opacity-50"
            onClick={handleConfirm}
            disabled={!selectedRoom}
          >
            Confirm
          </Button>
          <DialogClose ref={hiddenbutton}></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
