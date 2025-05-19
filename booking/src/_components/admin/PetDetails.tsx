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

export interface PetDetailsProps extends PetData {
  owner: string;
  ownerId: string | null;
  ownerContactNumber: string;
  ownerEmail: string;
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
  groomingIdExtention,
  allergies,
  size
}: PetDetailsProps) {
  return (
    <Dialog>
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
          <div className="h-96 flex flex-col justify-between space-y-4 pr-4">
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

                <div className="grid grid-cols-2 col-span-2 border-b border-purple-400 pb-2">
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

                <div className="grid grid-cols-2">
                  <dt className="font-medium">Size:</dt>
                  <dd className="text-right capitalize">
                    {size || "Undefined"}
                  </dd>
                </div>
              </dl>
            </div>

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
          </div>
        </ScrollArea>

      </DialogContent>
    </Dialog>
  );
}