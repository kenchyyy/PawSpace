// components/ServiceDetailsModal.tsx

import { AddBookingButton } from "@/StoryComponents/ui/button/Button";
import SpecialOffers from "./SpecialOffers";
import DogAccommodationCard from "./accommodation/DogAccommodationCard";
import CatAccommodationCard from "./accommodation/CatAccommodationCard";
import BasicGroomingCard from "./grooming/BasicGroomingCard";
import DeluxeGroomingCard from "./grooming/DeluxeGroomingCard";
import CatGroomingCard from "./grooming/CatGroomingCard";
import { Props } from "./types/serviceTypes";
import DayboardingInfo from "./accommodation/Dayboarding";
import { useEffect, useRef, useState } from "react";
import PoliciesModal from "./PoliciesModal";
import { policyContent } from "./data/policyData";

export default function ServiceDetailsModal({ isOpen, onClose, details, onClick }: Props) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isPoliciesModalOpen, setIsPoliciesModalOpen] = useState(false);
    const [policiesContent, setPoliciesContent] = useState<{ title: string; content: string[] } | null>(null);


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isOpen && !isPoliciesModalOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, isPoliciesModalOpen]);

    if (!isOpen || !details) return null;

    const typeColor = details.type === "grooming" ? "text-violet-600" : "text-blue-600";
    const typeEmoji = details.type === "grooming" ? "✂️" : "🛏️";

    const isDogOvernight = details.title === "Dog" && details.type === "overnight";
    const isCatOvernight = details.title === "Cat" && details.type === "overnight";

    const specialOffers = details.type === "overnight" ? [
        "3 Nights: Free Food",
        "7 Nights: Free Food & Basic Grooming + 10% Discount",
        "15 Nights: Free Food & Basic Grooming + 20% Discount",
    ] : [];

    const bookingCategory = details.type === "overnight" ? "boarding" : "grooming";

    const openPoliciesModal = (category: 'boarding' | 'grooming') => {
        if (category === 'boarding') {
            setPoliciesContent(policyContent.boarding);
        } else if (category === 'grooming') {
            setPoliciesContent(policyContent.grooming);
        }
        setIsPoliciesModalOpen(true);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm font-sans" /* No onClick here */>
                <div ref={modalRef} className={`bg-white text-black p-6 rounded-2xl w-[90%] max-w-md shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-2xl font-bold ${typeColor}`}>
                            {typeEmoji} {details.title} {details.type === "grooming" ? "Grooming" : "Accommodation"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 rounded-full p-1"
                            aria-label="Close"
                        >
                            ✖
                        </button>
                    </div>

                    {details.type === "overnight" && details.title === "Dog" && (
                        <DogAccommodationCard details={details} />
                    )}

                    {details.type === "overnight" && details.title === "Cat" && (
                        <CatAccommodationCard details={details} />
                    )}

                    {details.type === "grooming" && details.title === "Basic" && (
                        <BasicGroomingCard details={details} />
                    )}

                    {details.type === "grooming" && details.title === "Deluxe" && (
                        <DeluxeGroomingCard details={details} />
                    )}

                    {details.type === "grooming" && details.title === "Cat" && (
                        <CatGroomingCard details={details} />
                    )}

                    {specialOffers.length > 0 && (
                        <SpecialOffers offers={specialOffers} />
                    )}

                    {(isDogOvernight || isCatOvernight) && (
                        <DayboardingInfo title={details.title} />
                    )}

                    <p
                        className="text-center text-sm text-blue-500 hover:text-blue-700 cursor-pointer mt-4 mb-2 transition-colors duration-200"
                        onClick={() => openPoliciesModal(bookingCategory)}
                    >
                        View {bookingCategory === 'boarding' ? 'Boarding Terms and Conditions' : 'Grooming Waiver & Release'}
                    </p>

                    <AddBookingButton
                        onClick={() => onClick(bookingCategory)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium cursor-pointer transition duration-300 ease-in-out"
                    >
                        Book Now
                    </AddBookingButton>
                </div>
            </div>

            {isPoliciesModalOpen && policiesContent && (
                <PoliciesModal
                    isOpen={isPoliciesModalOpen}
                    onClose={() => setIsPoliciesModalOpen(false)}
                    title={policiesContent.title}
                    content={policiesContent.content}
                />
            )}
        </>
    );
}