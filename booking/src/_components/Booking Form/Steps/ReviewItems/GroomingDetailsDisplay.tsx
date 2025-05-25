import React from "react";
import { GroomingPet } from "../../types";
import { formatDate } from "./Functions/formatters";
import {
    FiCalendar,
    FiClock,
    FiTag
} from 'react-icons/fi';

interface GroomingDetailsDisplayProps {
    groomingPet: GroomingPet;
}

const GroomingDetailsDisplay: React.FC<GroomingDetailsDisplayProps> = ({
    groomingPet,
}) => {
    return (
        <div className="bg-white rounded-lg mb-6">
            <h5 className="font-bold text-gray-900 mb-4 text-xl">Grooming Details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FiCalendar className="mr-2 text-purple-600" /> Service Date
                    </p>
                    <p className="font-semibold text-gray-800">
                        {formatDate(groomingPet.service_date) || "Not specified"}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FiClock className="mr-2 text-purple-600" /> Service Time
                    </p>
                    <p className="font-semibold text-gray-800">
                        {groomingPet.service_time || "Not specified"}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FiTag className="mr-2 text-purple-600" /> Service Variant
                    </p>
                    <p className="font-semibold text-gray-800">
                        {groomingPet.service_variant || "Not specified"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GroomingDetailsDisplay;