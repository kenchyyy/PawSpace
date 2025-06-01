"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog";
import React, { useState, useEffect } from "react";
import { GroomingPetData } from "../../serverSide/FetchPetData";
import { ScrollArea } from "../../ui/scroll-area";
import { DialogFooter } from "@/StoryComponents/ui/dialog";
import { truncate } from "./../helper"; // Make sure this is robust!

export interface GroomingPetDetailsProps extends GroomingPetData {
  owner: string;
  ownerId: string | null;
  ownerAddress: string;
  ownerContactNumber: string;
  ownerEmail: string;
  status: string;
  children?: React.ReactNode;
  bookingType: "grooming" | "boarding";
};

export default function GroomingPetDetails({
  petUuid,
  name,
  age,
  petType,
  breed,
  ownerAddress,
  isVaccinated,
  allergies,
  vitaminsOrMedications,
  size,
  isCompleted,
  boardingIdExtention,
  groomingIdExtention,
  owner,
  ownerId,
  ownerContactNumber,
  ownerEmail,
  status,
  bookingType,
  children,
  serviceDate,
  serviceTime,
  serviceVariant
  
}: GroomingPetDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)

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
                    <dt className="font-medium text-yellow-300">Appointment Schedule:</dt>
                    <dd className="text-right capitalize">{`${serviceDate} at ${serviceTime}`}</dd>
                  </div>

                  <div className="grid grid-cols-2">
                    <dt className="font-medium text-yellow-300">Groom Service Variant:</dt>
                    <dd className="text-right capitalize">{serviceVariant}</dd>
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
                <span className="font-medium text-yellow-300">Address:</span>{" "}
                <span className="break-all">{ownerAddress}</span>
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
            <div>

            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
