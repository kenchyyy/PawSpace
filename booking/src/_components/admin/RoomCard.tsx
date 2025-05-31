"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getPetsScheduledByDate } from "../serverSide/FetchRoomData";
import PetDetails from "./PetDetails"; 
import { RoomData } from "../serverSide/FetchRoomData";
import { PetDetailsProps } from "./PetDetails";
import { Skeleton } from "../ui/skeleton";

function truncate(str : string, maxLength = 30) {
  if (!str) return "";
  str = String(str);
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}

interface RoomCardProps {
  room: RoomData;
  date: string | Date;
  className?: string;
  onRoomAssignment?: () => void; // Add this
}

export default function RoomCard({ room, date, className }: RoomCardProps) {
  const [pets, setPets] = useState<PetDetailsProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPets() {
      setLoading(true);
      setError(null);
      try {
        const { message, returnData } = await getPetsScheduledByDate(date, room.id.toString());
        if (returnData) {
          setPets(returnData);
        } else {
          setPets([]);
          setError(message);
        }
      } catch (err) {
        setError("Failed to fetch pets");
        setPets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPets();
  }, [date, room.id]);

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <Card className={`w-full h-full bg-violet-800 hover:bg-violet-700 ${className ?? ""}`}>
      <CardHeader>
        <CardTitle className="font-bold text-orange-400 break-words">
          {truncate(room.roomName, 30)}
        </CardTitle>
        <CardDescription className="text-xs text-white break-words">
          Inhabitants:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {loading && <p className="text-white">Loading pets...</p>}
          {error && <p className="text-gray-400 break-words">{truncate(error, 100)}</p>}
          {!loading && !error && pets.length === 0 && (
            <p className="text-gray-400">No pets scheduled for this room on this date.</p>
          )}
          {!loading && pets.map((pet) => (
            <PetDetails
              key={pet.petUuid}
              {...pet}
              bookingType="boarding"
              onRoomAssignment={() => {}} // pass your handler here if needed
            >
              <button className="text-sm text-orange-400 underline break-words">
                {truncate(pet.name, 20)}
              </button>
            </PetDetails>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
