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
            setPoliciesContent({
                title: "Boarding Terms and Conditions",
                content: [
                    "1. Pet Health and Behavior: I confirm that my pet is in reasonably good health and has not shown signs of illness, contagious disease, or aggressive behavior. I understand that PawSpace reserves the right to refuse service if my pet displays aggressive or unsafe behavior for staff or other animals.",
                    "2. Injury and Risk Disclosure: I understand that while PawSpace staff take all precautions to ensure my pet's safety and comfort, grooming may involve inherent risks including, but not limited to, minor cuts, nicks, burns, skin irritation, stress, or accidental reactions. I will not hold PawSpace, its owners, employees, or affiliates liable for any injury, illness, or stress-related conditions resulting from grooming.",
                    "3. Matted Fur or Special Conditions: I understand that heavily matted fur may need to be shaved down to prevent pain or injury. I acknowledge that de-matting can cause skin irritation or uncover pre-existing conditions. PawSpace will make reasonable efforts to inform me before proceeding.",
                    "4. Emergency Care: In the unlikely event of an emergency, I authorize PawSpace to seek veterinary care for my pet. I understand that I am fully responsible for any and all expenses incurred.",
                    "5. Late Pick-Up or No-Show Policy: I agree to pick up my pet promptly at the agreed time. I understand that a fee may apply for late pickups or no-shows.",
                    "7. Photo Release (Optional): I consent to PawSpace taking photos or videos of my pet before, during, or after grooming for promotional or marketing purposes.",
                ]
            });
        } else if (category === 'grooming') {
            setPoliciesContent({
                title: "Grooming Service Waiver & Release of Liability",
                content: [
                    "1. HEALTH & VACCINATIONS: I confirm that my pet is in good health and up to date on core vaccinations including Rabies, Parvovirus, and Distemper. I agree to disclose any existing medical conditions, medications, allergies, or special needs. PawSpace reserves the right to refuse boarding if my pet shows signs of illness, parasites, or aggressive behavior.",
                    "2. TEMPERAMENT & BEHAVIOR: I confirm that my pet is non-aggressive and has no history of harmful or dangerous behavior. If my pet exhibits signs of distress, aggression, or destruction while at PawSpace, staff may separate them and contact me for early pick-up if necessary.",
                    "3. EMERGENCY CARE: In case of illness or emergency, I authorize PawSpace to contact my preferred veterinarian or an emergency animal clinic. I accept financial responsibility for all veterinary expenses incurred. Staff will make every reasonable effort to contact me before proceeding with treatment.",
                    "4. CHECK-IN AND CHECK-OUT POLICY: Standard check-in and check-out is between 9:00 AM and 7:00 PM. Early check-in or late check-out is available during the following times: 6:00 AM - 8:59 AM (Early) and 7:01 PM - 10:00 PM (Late). An additional fee applies for early or late check-in/out. Pets picked up after 10:00 PM will be considered extended stay and charged accordingly.",
                    "5. LIABILITY WAIVER: I release PawSpace Pet Hotel and Grooming, its owners, staff, and affiliates from any liability due to illness, injury, stress, or accidental loss of my pet, unless caused by gross negligence. I understand that boarding involves inherent risks, even with professional care.",
                    "6. ABANDONMENT CLAUSE: If I fail to retrieve my pet within 3 days of the scheduled pick-up date without communication, PawSpace reserves the right to treat the pet as abandoned under local regulations.",
                    "7. CANCELLATION & REFUND POLICY: Cancellations must be made at least 2 days prior to the scheduled reservation date to receive a refund. Cancellations made within 48 hours of the reservation date are non-refundable but may be converted to store credit, applicable to grooming services or pet products.",
                    "8. REMINDERS TO PET OWNERS: Please bring enough food for the entire stay, especially if your pet has specific dietary needs. Don't forget any medications and written instructions. Make sure all contact and emergency details are accurate. Feel free to bring one small comfort item (e.g., a blanket or toy). PawSpace provides a loving and fun environment-but if your pet is highly anxious or has never been boarded before, consider a short trial day first."
                ]
            });
        }
        setIsPoliciesModalOpen(true);
    };

    return (
        <>
            {/* The main ServiceDetailsModal content */}
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm font-sans" /* No onClick here */>
                <div ref={modalRef} className={`bg-white text-black p-6 rounded-2xl w-[90%] max-w-md shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-2xl font-bold ${typeColor}`}>
                            {typeEmoji} {details.title} {details.type === "grooming" ? "Grooming" : "Accommodation"}
                        </h2>
                        <button
                            onClick={onClose} // This closes ServiceDetailsModal
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

            {/* PoliciesModal is rendered conditionally, but ServiceDetailsModal remains open underneath */}
            {isPoliciesModalOpen && policiesContent && (
                <PoliciesModal
                    isOpen={isPoliciesModalOpen}
                    onClose={() => setIsPoliciesModalOpen(false)} // This only closes PoliciesModal
                    title={policiesContent.title}
                    content={policiesContent.content}
                />
            )}
        </>
    );
}