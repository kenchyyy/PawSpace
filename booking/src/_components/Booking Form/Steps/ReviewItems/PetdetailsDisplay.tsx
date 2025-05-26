import React from "react";
import { Pet } from "../../types";
import {
    FiTag,
    FiList,
    FiGift,
    FiCheckCircle,
    FiAlertCircle,
    FiAlertTriangle,
    FiStar,
} from 'react-icons/fi';
import { FaPaw, FaPrescriptionBottleAlt, FaBalanceScale as FaScale } from 'react-icons/fa';

interface PetDetailsDisplayProps {
    pet: Pet;
}

const PetDetailsDisplay: React.FC<PetDetailsDisplayProps> = ({ pet }) => {
    return (
        <div className="bg-white rounded-lg mb-6">
            <h5 className="font-bold text-gray-900 mb-4 text-xl">Pet Details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FaPaw className="mr-2 text-purple-600" /> Pet Name
                    </p>
                    <p className="font-semibold text-gray-800 break-words">
                        {pet.name || "Not specified"}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FiTag className="mr-2 text-purple-600" /> Pet Type
                    </p>
                    <p className="font-semibold text-gray-800">
                        {pet.pet_type || "Not specified"}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FiList className="mr-2 text-purple-600" /> Breed
                    </p>
                    <p className="font-semibold text-gray-800 break-words">
                        {pet.breed || "Not specified"}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FiGift className="mr-2 text-purple-600" /> Age
                    </p>
                    <p className="font-semibold text-gray-800">
                        {pet.age || "Not specified"}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        {pet.vaccinated === "yes" ? (
                            <FiCheckCircle className="mr-2 text-purple-600" />
                        ) : pet.vaccinated === "no" ? (
                            <FiAlertCircle className="mr-2 text-purple-600" />
                        ) : (
                            <FiCheckCircle className="mr-2 text-purple-600" />
                        )}
                        Vaccination Status
                    </p>
                    <p className="font-semibold text-gray-800">
                        {pet.vaccinated === "yes" ? "Vaccinated" : pet.vaccinated === "no" ? "Not Vaccinated" : "Not specified"}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FaScale className="mr-2 text-purple-600" /> Size (kg)
                    </p>
                    <p className="font-semibold text-gray-800">
                        {pet.size || "Not specified"}
                    </p>
                </div>

                {pet.vitamins_or_medications && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 col-span-1 sm:col-span-2 md:col-span-2 flex flex-col justify-between">
                        <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                            <FaPrescriptionBottleAlt className="mr-2 text-purple-600" /> Vitamins/Medications
                        </p>
                        <p className="font-semibold text-gray-800 whitespace-pre-wrap break-words">
                            {pet.vitamins_or_medications}
                        </p>
                    </div>
                )}

                {pet.allergies && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 col-span-1 sm:col-span-2 md:col-span-2 flex flex-col justify-between">
                        <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                            <FiAlertTriangle className="mr-2 text-purple-600" /> Allergies
                        </p>
                        <p className="font-semibold text-gray-800 whitespace-pre-wrap break-words">
                            {pet.allergies}
                        </p>
                    </div>
                )}

                {pet.special_requests && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 col-span-1 sm:col-span-2 md:col-span-2 flex flex-col justify-between">
                        <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                            <FiStar className="mr-2 text-purple-600" /> Special Requests
                        </p>
                        <p className="font-semibold text-gray-800 whitespace-pre-wrap break-words">
                            {pet.special_requests}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetDetailsDisplay;