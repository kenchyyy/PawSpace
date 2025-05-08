import { AddBookingButton } from "../ui/button/Button";
import SpecialOffers from "./SpecialOffers";
import DogAccommodationCard from "./accommodation/DogAccommodationCard";
import CatAccommodationCard from "./accommodation/CatAccommodationCard";
import BasicGroomingCard from "./grooming/BasicGroomingCard";
import DeluxeGroomingCard from "./grooming/DeluxeGroomingCard";
import CatGroomingCard from "./grooming/CatGroomingCard";
import { Props } from "./types/serviceTypes";
import DayboardingInfo from "./accommodation/Dayboarding";

export default function ServiceDetailsModal({ isOpen, onClose, details }: Props) {
    if (!isOpen || !details) return null;

    const typeColor = details.type === "grooming" ? "text-orange-500" : "text-blue-600";
    const typeEmoji = details.type === "grooming" ? "✂️" : "🛏️";

    const isDogOvernight = details.title === "Dog" && details.type === "overnight";
    const isCatOvernight = details.title === "Cat" && details.type === "overnight";

    const specialOffers = details.type === "overnight" ? [
        "3 Nights: Free Food & Basic Grooming",
        "7 Nights: Free Food & Basic Grooming + 10% Discount",
        "15 Nights: Free Food & Basic Grooming + 20% Discount",
    ] : [];

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className={`bg-white text-black p-6 rounded-2xl w-[90%] max-w-md shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]`}>
            <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${typeColor}`}>
                {typeEmoji} {details.title} {details.type === "grooming" ? "Grooming" : "Accommodation"}
            </h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-200 rounded-full p-1"
                aria-label="Close"
            >
                ✖
            </button>
            </div>

            {details.type === "overnight" && details.title === "Dog" && (
            <div className="bg-white rounded-md p-4 mb-4">
                <DogAccommodationCard details={details} />
            </div>
            )}

            {details.type === "overnight" && details.title === "Cat" && (
            <div className="bg-white rounded-md p-4 mb-4">
                <CatAccommodationCard details={details} />
            </div>
            )}

            {details.type === "grooming" && details.title === "Basic" && (
            <div className="bg-white rounded-md p-4 mb-4">
                <BasicGroomingCard details={details} />
            </div>
            )}

            {details.type === "grooming" && details.title === "Deluxe" && (
            <div className="bg-white rounded-md p-4 mb-4">
                <DeluxeGroomingCard details={details} />
            </div>
            )}

            {details.type === "grooming" && details.title === "Cats" && (
            <div className="bg-white rounded-md p-4 mb-4">
                <CatGroomingCard details={details} />
            </div>
            )}

            {specialOffers.length > 0 && (
            <div className="bg-white rounded-md p-4 mb-4">
                <SpecialOffers offers={specialOffers} />
            </div>
            )}

            {(isDogOvernight || isCatOvernight) && (
            <div className="bg-white rounded-md p-4 mb-4">
                <DayboardingInfo title={details.title} />
            </div>
            )}

            <AddBookingButton
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium mt-6 cursor-pointer transition duration-300 ease-in-out"
            >
            Book Now
            </AddBookingButton>
        </div>
        </div>
    );
}