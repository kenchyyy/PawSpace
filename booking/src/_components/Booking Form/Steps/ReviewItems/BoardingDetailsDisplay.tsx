import React from "react";
import { BoardingPet } from "../../types";
import { formatDate } from "./Functions/formatters";
import {
    FiCalendar,
    FiFileText,
    FiHome,
    FiCoffee,
    FiSun,
    FiMoon
} from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';

interface BoardingDetailsDisplayProps {
    boardingPet: BoardingPet;
}

const formatTime = (timeString: string | undefined): string => {
    if (!timeString) return "Not specified";
    try {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (error) {
        console.error("Error formatting time:", timeString, error);
        return timeString;
    }
};

const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
        case 'breakfast': return <FiCoffee className="inline-block mr-1 text-purple-600" />;
        case 'lunch': return <FiSun className="inline-block mr-1 text-purple-600" />;
        case 'dinner': return <FiMoon className="inline-block mr-1 text-purple-600" />;
        default: return null;
    }
};

const BoardingDetailsDisplay: React.FC<BoardingDetailsDisplayProps> = ({
    boardingPet,
}) => {
    const hasMealInstructions = boardingPet.meal_instructions &&
        Object.values(boardingPet.meal_instructions).some(
            (meal) => meal.time || meal.food || meal.notes
        );

    return (
        <div className="bg-white rounded-lg mb-6">
            <h5 className="font-bold text-gray-900 mb-4 text-xl">Boarding Details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FaPaw className="mr-2 text-purple-600" /> Boarding Type
                    </p>
                    <p className="font-semibold text-gray-800">
                        {boardingPet.boarding_type === "day"
                            ? "Day Boarding"
                            : "Overnight Boarding"}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FiCalendar className="mr-2 text-purple-600" /> Check-in
                    </p>
                    <p className="font-semibold text-gray-800">
                        {formatDate(boardingPet.check_in_date) || "Not specified"}{" "}
                        {boardingPet.check_in_time ? `at ${formatTime(boardingPet.check_in_time)}` : ""}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FiCalendar className="mr-2 text-purple-600" /> Check-out
                    </p>
                    <p className="font-semibold text-gray-800">
                        {formatDate(boardingPet.check_out_date) || "Not specified"}{" "}
                        {boardingPet.check_out_time ? `at ${formatTime(boardingPet.check_out_time)}` : ""}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center">
                        <FiHome className="mr-2 text-purple-600" /> Room Size
                    </p>
                    <p className="font-semibold text-gray-800">
                        {boardingPet.room_size || "Not specified"}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 sm:col-span-2 md:col-span-2">
                    <p className="text-base text-gray-700 mb-4 font-semibold flex items-center">
                         Meal Instructions
                    </p>
                    {hasMealInstructions ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(boardingPet.meal_instructions).map(([mealType, meal]) => (
                                <div
                                    key={mealType}
                                    className="p-4 rounded-md bg-gray-50 border border-gray-200 shadow-sm"
                                >
                                    <h4 className="font-bold text-gray-900 text-base mb-2 capitalize flex items-center">
                                        {getMealIcon(mealType)} {mealType}
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-medium text-gray-600">Time:</span>{" "}
                                        <span className="font-semibold text-gray-800">
                                            {formatTime(meal.time)}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-medium text-gray-600">Food:</span>{" "}
                                        <span className="font-semibold text-gray-800 whitespace-pre-wrap break-words">
                                            {meal.food || "Not specified"}
                                        </span>
                                    </p>
                                    {meal.notes && (
                                        <p className="text-sm text-gray-700 mt-2">
                                            <span className="font-medium text-gray-600">Notes:</span>{" "}
                                            <span className="font-semibold text-gray-800 whitespace-pre-wrap break-words">
                                                {meal.notes}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic">No specific meal instructions provided.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoardingDetailsDisplay;