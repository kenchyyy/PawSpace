import React from "react";
import { Pet, BoardingPet, GroomingPet, ServiceType } from "../../types";
import { PriceDetails } from "./Functions/pricingCalculations";
import PetDetailsDisplay from "./PetdetailsDisplay";
import BoardingDetailsDisplay from "./BoardingDetailsDisplay";
import GroomingDetailsDisplay from "./GroomingDetailsDisplay";
import PriceDetailsDisplay from "./PriceDetailsDisplay";

interface PetServiceCardProps {
  pet: Pet;
  index: number;
  priceDetails: PriceDetails;
  isBoarding: boolean;
  surchargeAmount?: number;
  surchargeNote?: string;
}

const PetServiceCard: React.FC<PetServiceCardProps> = ({
  pet,
  index,
  priceDetails,
  isBoarding,
  surchargeAmount,
  surchargeNote,
}) => {
  const boardingPet = pet as BoardingPet;
  const groomingPet = pet as GroomingPet;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
      <h4 className="font-semibold text-gray-900 text-xl flex flex-wrap justify-between items-baseline gap-x-4 gap-y-2">
        <span className="text-blue-600">Pet {index + 1}:</span>{" "}
        <span className="min-w-0 flex-grow break-words">
          {pet.name || `Unnamed ${pet.pet_type}`}
        </span>
        <div className="flex items-baseline gap-x-2 flex-shrink-0 ml-auto">
          <span
            className={`text-sm font-medium px-4 py-1.5 rounded-full ${
              isBoarding
                ? boardingPet.boarding_type === "day"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-indigo-100 text-indigo-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {isBoarding
              ? boardingPet.boarding_type === "day"
                ? "Day Boarding"
                : "Overnight Boarding"
              : "Grooming"}
          </span>
        </div>
      </h4>

      <div className="min-w-0">
        <PetDetailsDisplay pet={pet} />
      </div>

      <div className="min-w-0">
        {isBoarding ? (
          <BoardingDetailsDisplay boardingPet={boardingPet} />
        ) : (
          <GroomingDetailsDisplay groomingPet={groomingPet} />
        )}
      </div>

      <div className="min-w-0">
        <PriceDetailsDisplay
          priceDetails={priceDetails}
          isBoarding={isBoarding}
          surchargeAmount={surchargeAmount}
          surchargeNote={surchargeNote}
        />
      </div>
    </div>
  );
};

export default PetServiceCard;