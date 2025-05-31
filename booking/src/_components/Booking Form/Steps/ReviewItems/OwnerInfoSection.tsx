import React from "react";
import { OwnerDetails } from "../../types";
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt
} from 'react-icons/fa';

interface OwnerInfoSectionProps {
    ownerDetails: OwnerDetails;
}

const OwnerInfoSection: React.FC<OwnerInfoSectionProps> = ({ ownerDetails }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h5 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                Owner Information
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FaUser className="mr-2 text-purple-600" /> Full Name
                    </p>
                    <p className="font-semibold text-gray-800 break-words">{ownerDetails.name || "Not specified"}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FaPhone className="mr-2 text-purple-600" /> Contact Number
                    </p>
                    <p className="font-semibold text-gray-800 break-words">{ownerDetails.contact_number || "Not specified"}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FaEnvelope className="mr-2 text-purple-600" /> Email
                    </p>
                    <p className="font-semibold text-gray-800 break-words">{ownerDetails.email || "Not specified"}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 col-span-1 sm:col-span-2 md:col-span-2 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-purple-600" /> Address
                    </p>
                    <p className="font-semibold text-gray-800 break-words">{ownerDetails.address || "Not specified"}</p>
                </div>
            </div>
        </div>
    );
};

export default OwnerInfoSection;