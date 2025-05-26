import React, { useState, useEffect, useCallback } from "react";
import {
    OwnerDetails,
    Pet,
    ServiceType,
    BoardingPet,
    GroomingPet,
} from "@/_components/Booking Form/types";
import {
    FiChevronLeft,
    FiChevronRight,
    FiClipboard,
} from "react-icons/fi";
import { FaPaw, FaUser } from "react-icons/fa";
import PoliciesModal from "@/_components/Services/PoliciesModal"; 
import { policyContent } from "@/_components/Services/data/policyData";
import OwnerInfoSection from "./ReviewItems/OwnerInfoSection";
import PetServiceCard from "./ReviewItems/PetServiceCard";
import ConfirmationCheckbox from "./ReviewItems/ConfirmationCheckox";
import BookingSuccessModal from "./ReviewItems/BookingSuccessModal";
import ErrorMessage from "./ReviewItems/ErrorMessage";
import {
    getGroomingPrice,
    getBoardingPrice,
    PriceDetails,
} from "./ReviewItems/Functions/pricingCalculations";

interface ReviewStepProps {
    ownerDetails: OwnerDetails;
    pets: Pet[];
    serviceType: ServiceType;
    confirmedInfo: boolean;
    onConfirmChange: (confirmed: boolean) => void;
    onBack: () => void;
    onConfirm: () => Promise<{ success: boolean; bookingId?: string }>;
    isSubmitting?: boolean;
    errors?: Record<string, string>;
}

type FormErrors = {
    confirmation?: string;
};

const ReviewStep: React.FC<ReviewStepProps> = ({
    ownerDetails,
    pets,
    serviceType,
    confirmedInfo,
    onConfirmChange,
    onBack,
    onConfirm,
    isSubmitting: propIsSubmitting = false,
    errors = {},
}) => {
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [bookingId, setBookingId] = useState<string | undefined>(undefined);
    const [submissionTimeoutId, setSubmissionTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(propIsSubmitting);

    useEffect(() => {
        setIsSubmitting(propIsSubmitting);
    }, [propIsSubmitting]);

    useEffect(() => {
        return () => {
            if (submissionTimeoutId) {
                clearTimeout(submissionTimeoutId);
            }
        };
    }, [submissionTimeoutId]);

    const calculatePrice = useCallback(
        (pet: Pet): PriceDetails => {
            if (pet.service_type === "grooming") {
                const groomingPet = pet as GroomingPet;
                const price = getGroomingPrice(
                    groomingPet.pet_type,
                    groomingPet.service_variant,
                    pet.size
                );
                return {
                    basePrice: price,
                    total: price,
                    discount: 0,
                    surcharge: 0,
                };
            } else if (pet.service_type === "boarding") {
                const boardingPet = pet as BoardingPet;
                const priceDetails = getBoardingPrice(boardingPet);
                return priceDetails;
            }
            return {
                basePrice: 0,
                total: 0,
                discount: 0,
                surcharge: 0,
            };
        },
        []
    );

    const handleConfirm = async () => {
        if (!confirmedInfo) {
            setFormErrors({
                confirmation: "Please confirm the information and policies.",
            });
            return;
        }

        setIsSubmitting(true);
        setFormErrors({});

        if (submissionTimeoutId) {
            clearTimeout(submissionTimeoutId);
        }

        const id = setTimeout(() => {
            setFormErrors({
                confirmation: "Submission is taking longer than expected. Please wait...",
            });
        }, 10000);
        setSubmissionTimeoutId(id);

        try {
            pets.forEach((pet) => {
                if (!pet.service_type) {
                    throw new Error("Service type is required for all pets.");
                }
                if (pet.service_type === "boarding") {
                    const boardingPet = pet as BoardingPet;
                    if (
                        !boardingPet.check_in_date ||
                        !boardingPet.check_out_date ||
                        !boardingPet.check_in_time ||
                        !boardingPet.check_out_time ||
                        !boardingPet.room_size
                    ) {
                        throw new Error(
                            `Check-in/out dates, times, and room size are required for boarding pet "${pet.name}".`
                        );
                    }
                } else if (pet.service_type === "grooming") {
                    const groomingPet = pet as GroomingPet;
                    if (!groomingPet.service_date || !groomingPet.service_variant) {
                        throw new Error(
                            `Service date and variant are required for grooming pet "${pet.name}".`
                        );
                    }
                }
            });

            const result = await onConfirm();

            if (result?.success) {
                setBookingId(result.bookingId);
                setShowSuccess(true);
            } else {
                setFormErrors({
                    confirmation: result?.bookingId
                        ? `Booking failed: ${result.bookingId}`
                        : "Failed to process booking. Please try again.",
                });
            }
        } catch (err) {
            const error = err as Error;
            setFormErrors({
                confirmation: error.message || "Failed to process booking. Please try again.",
            });
        } finally {
            clearTimeout(id);
            setIsSubmitting(false);
        }
    };

    const handleSuccessModalClose = (id?: string) => {
        setShowSuccess(false);
        if (id) {
            window.location.href = `/customer/history?bookingId=${id}`;
        } else {
            window.location.href = "/customer/history";
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-8">
            <BookingSuccessModal
                showSuccess={showSuccess}
                bookingId={bookingId}
                onClose={handleSuccessModalClose}
            />

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-gray-200 shadow-lg">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-purple-100 text-purple-600 p-3 rounded-full mr-4 text-xl">
                        <FiClipboard className="h-6 w-6" />
                    </span>
                    Review Your Booking
                </h3>

                {(errors.confirmation || formErrors.confirmation) && (
                    <ErrorMessage
                        message={errors.confirmation || formErrors.confirmation || ""}
                    />
                )}

                <OwnerInfoSection ownerDetails={ownerDetails} />

                <div className="mb-8 space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                            <FaPaw className="h-5 w-5" />
                        </span>
                        Pets & Services
                    </h3>
                    <div className="space-y-5">
                        {pets.map((pet, index) => {
                            const priceDetails = calculatePrice(pet);
                            const isBoardingService = pet.service_type === "boarding";

                            return (
                                <PetServiceCard
                                    key={pet.id || index}
                                    pet={pet}
                                    index={index}
                                    priceDetails={priceDetails}
                                    isBoarding={isBoardingService}
                                    surchargeAmount={priceDetails.surcharge}
                                    surchargeNote="Before or after normal working hours (9AM-7PM)"
                                />
                            );
                        })}
                    </div>
                </div>

                <ConfirmationCheckbox
                    confirmedInfo={confirmedInfo}
                    onConfirmChange={onConfirmChange}
                    errors={errors}
                    policyContent={policyContent}
                    serviceType={serviceType}
                />

                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                    <button
                        onClick={onBack}
                        className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center text-base shadow-sm"
                    >
                        <FiChevronLeft className="mr-2 text-lg" />
                        Back
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!confirmedInfo || isSubmitting}
                        className={`
                            w-full sm:w-auto font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center text-base shadow-md
                            ${
                                !confirmedInfo || isSubmitting
                                    ? "bg-purple-300 text-white cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 text-white"
                            }
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <div
                                    className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                >
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                        Loading...
                                    </span>
                                </div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                Confirm Booking
                                <FiChevronRight className="ml-2 text-lg" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewStep;