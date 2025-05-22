import React, { useState, useEffect } from "react";
import {
  OwnerDetails,
  Pet,
  ServiceType,
  BoardingPet,
  GroomingPet,
  calculateNights,
  PetType,
  RoomSize,
  BoardingType,
  GroomingVariant,
  VaccinationStatus,
  MealInstruction,
  Pricing,
  pricing,
} from "../types";
import { FiChevronLeft, FiChevronRight, FiCheckCircle } from "react-icons/fi";

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

type PriceDetails = {
  basePrice: number;
  total: number;
  discount: number;
  nights?: number;
  hours?: number;
  boarding_type?: BoardingType;
};

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
  isSubmitting = false,
  errors = {},
}) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getGroomingPrice = (
    petType: PetType,
    variant: GroomingVariant,
    size?: string
  ): number => {
    if (petType === "cat") {
      return pricing.grooming.cat.standard;
    } else if (petType === "dog" && variant === "basic" && size) {
      return pricing.grooming.dog.basic[
        size as keyof typeof pricing.grooming.dog.basic
      ] || 0;
    } else if (petType === "dog" && variant === "deluxe" && size) {
      return pricing.grooming.dog.deluxe[
        size as keyof typeof pricing.grooming.dog.deluxe
      ] || 0;
    }
    return 0;
  };

  const getBoardingPrice = (boardingPet: BoardingPet): PriceDetails => {
    const checkInDate = boardingPet.check_in_date ? new Date(boardingPet.check_in_date) : null;
    const checkOutDate = boardingPet.check_out_date ? new Date(boardingPet.check_out_date) : null;

    const nights = checkInDate && checkOutDate && boardingPet.boarding_type === "overnight"
      ? calculateNights(checkInDate, checkOutDate)
      : 0;

    let basePrice = 0;
    let discount = 0;
    let hours = 0;

    if (
      boardingPet.boarding_type === "day" &&
      boardingPet.check_in_time &&
      boardingPet.check_out_time &&
      boardingPet.room_size
    ) {
      const [checkInHourStr] = boardingPet.check_in_time.split(":");
      const [checkOutHourStr] = boardingPet.check_out_time.split(":");

      const checkInHour = parseInt(checkInHourStr, 10);
      const checkOutHour = parseInt(checkOutHourStr, 10);

      if (!isNaN(checkInHour) && !isNaN(checkOutHour)) {
        hours = checkOutHour - checkInHour;
        hours = Math.max(0, hours);

        const hourlyRate =
          pricing.boarding.day[
            boardingPet.room_size as keyof typeof pricing.boarding.day
          ];

        if (hourlyRate !== undefined) {
          basePrice = hourlyRate * hours;
        }
      }
    } else if (
      boardingPet.boarding_type === "overnight" &&
      boardingPet.room_size
    ) {
      basePrice =
        pricing.boarding.overnight[
          boardingPet.room_size as keyof typeof pricing.boarding.overnight
        ] * nights;

      if (nights >= 15) {
        discount = 20;
      } else if (nights >= 7) {
        discount = 10;
      }
    }

    const total = basePrice * (1 - discount / 100);
    return {
      basePrice,
      total,
      discount,
      nights,
      hours,
      boarding_type: boardingPet.boarding_type,
    };
  };

  const calculatePrice = (pet: Pet): PriceDetails => {
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
        discount: 0
      };
    } else if (pet.service_type === "boarding") {
      const boardingPet = pet as BoardingPet;
      return getBoardingPrice(boardingPet);
    }
    return {
      basePrice: 0,
      total: 0,
      discount: 0
    };
  };

  const handleConfirm = async () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      setFormErrors({
        confirmation: "Submission is taking longer than expected. Please wait...",
      });
    }, 10000);
    setTimeoutId(id);

    try {
      pets.forEach((pet) => {
        if (!pet.service_type) {
          throw new Error("Service type is required");
        }
        if (pet.service_type === "boarding") {
          const boardingPet = pet as BoardingPet;
          if (!boardingPet.check_in_date || !boardingPet.check_out_date) {
            throw new Error(
              "Check-in and check-out dates are required for boarding"
            );
          }
        } else {
          const groomingPet = pet as GroomingPet;
          if (!groomingPet.service_date) {
            throw new Error("Service date is required for grooming");
          }
          if (!groomingPet.service_variant) {
            throw new Error("Service variant is required for grooming");
          }
        }
      });

      const result = await onConfirm();

      if (result?.success) {
        setShowSuccess(true);
        setTimeout(() => {
          window.location.href = `/customer/history?bookingId=${result.bookingId}`;
        }, 1500);
      }
    } catch (err) {
      const error = err as Error;
      setFormErrors({
        confirmation:
          error.message || "Failed to process booking. Please try again.",
      });
    } finally {
      clearTimeout(id);
    }
  };

  const formatDate = (date: Date | string | null): string => {
    if (!date) return "None";
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatMealTime = (time: string): string => {
    if (!time) return "None";
    const [hours, minutes] = time.split(":");
    let period = "AM";
    let formattedHours = parseInt(hours, 10);
    if (formattedHours === 0) {
      formattedHours = 12;
    } else if (formattedHours === 12) {
      period = "PM";
    } else if (formattedHours > 12) {
      formattedHours -= 12;
      period = "PM";
    }
    return `${formattedHours}:${minutes} ${period}`;
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <FiCheckCircle className="text-green-500 text-5xl mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 mb-4">
                Your pet&apos;s reservation has been successfully created.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full animate-progress"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
          </span>
          Review Your Booking
        </h2>

        {(errors.confirmation || formErrors.confirmation) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a11 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {errors.confirmation || formErrors.confirmation}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="bg-purple-100 text-purple-800 p-1.5 rounded-full mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            Owner Information
          </h3>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                <p className="font-semibold text-gray-800">
                  {ownerDetails.name || "None"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 font-medium">
                  Contact Number
                </p>
                <p className="font-semibold text-gray-800">
                  {ownerDetails.contact_number || "None"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="font-semibold text-gray-800">
                  {ownerDetails.email || "None"}
                </p>
              </div>
              <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 font-medium">Address</p>
                <p className="font-semibold text-gray-800">
                  {ownerDetails.address || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 p-1.5 rounded-full mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </span>
            Pets & Services
          </h3>
          <div className="space-y-5">
            {pets.map((pet, index) => {
              const priceDetails = calculatePrice(pet);
              const isBoarding = pet.service_type === "boarding";
              const boardingPet = pet as BoardingPet;
              const groomingPet = pet as GroomingPet;

              return (
                <div
                  key={pet.id || index}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4"
                >
                  <h4 className="font-semibold text-gray-900 text-lg flex justify-between items-center">
                    <span>
                      <span className="text-blue-600">Pet {index + 1}:</span>{" "}
                      {pet.name || `Unnamed ${pet.pet_type}`}
                    </span>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
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
                  </h4>

                  {/* Pet Details Partition */}
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Pet Details
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium">
                          Pet Type
                        </p>
                        <p className="font-semibold text-gray-800">
                          {pet.pet_type || "None"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium">Breed</p>
                        <p className="font-semibold text-gray-800">
                          {pet.breed || "None"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium">
                          Vaccination Status
                        </p>
                        <p className="font-semibold text-gray-800">
                          {pet.vaccinated === "yes" ? "Vaccinated" : "Not Vaccinated"}
                        </p>
                      </div>
                      {pet.size && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 font-medium">Size</p>
                          <p className="font-semibold text-gray-800">
                            {pet.size || "None"}
                          </p>
                        </div>
                      )}
                      {pet.allergies && (
                        <div className="bg-gray-50 p-3 rounded-lg md:col-span-3">
                          <p className="text-sm text-gray-500 font-medium">
                            Allergies
                          </p>
                          <p className="font-semibold text-gray-800">
                            {pet.allergies || "None"}
                          </p>
                        </div>
                      )}
                      {pet.special_requests && (
                        <div className="bg-gray-50 p-3 rounded-lg md:col-span-3">
                          <p className="text-sm text-gray-500 font-medium">
                            Special Needs
                          </p>
                          <p className="font-semibold text-gray-800">
                            {pet.special_requests || "None"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service Specific Details */}
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Service Details
                    </h5>
                    {isBoarding ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 font-medium">
                            Boarding Type
                          </p>
                          <p className="font-semibold text-gray-800">
                            {boardingPet.boarding_type === "day"
                              ? "Day Boarding"
                              : "Overnight Boarding"}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 font-medium">
                            Check-in Date
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formatDate(boardingPet.check_in_date) || "None"}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 font-medium">
                            Check-out Date
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formatDate(boardingPet.check_out_date) || "None"}
                          </p>
                        </div>
                        {boardingPet.boarding_type === "day" && (
                          <>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-500 font-medium">
                                Check-in Time
                              </p>
                              <p className="font-semibold text-gray-800">
                                {boardingPet.check_in_time || "None"}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-500 font-medium">
                                Check-out Time
                              </p>
                              <p className="font-semibold text-gray-800">
                                {boardingPet.check_out_time || "None"}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-500 font-medium">
                                Room Size
                              </p>
                              <p className="font-semibold text-gray-800">
                                {boardingPet.room_size || "None"}
                              </p>
                            </div>
                          </>
                        )}
                        {boardingPet.meal_instructions && (
                          <div className="bg-gray-50 p-3 rounded-lg md:col-span-3">
                            <p className="text-sm text-gray-500 font-medium">
                              Meal Instructions
                            </p>
                            <div className="space-y-2">
                              {Object.entries(boardingPet.meal_instructions).map(([mealType, meal]) => (
                                <div
                                  key={mealType}
                                  className="p-2 rounded-md bg-white border border-gray-200"
                                >
                                  <p className="font-semibold text-gray-800">
                                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Time:{" "}
                                    <span className="font-medium text-gray-800">
                                      {formatMealTime(meal.time) || "None"}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Food:{" "}
                                    <span className="font-medium text-gray-800">
                                      {meal.food || "None"}
                                    </span>
                                  </p>
                                  {meal.notes && (
                                    <p className="text-sm text-gray-500">
                                      Notes:{" "}
                                      <span className="font-medium text-gray-800">
                                        {meal.notes || "None"}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 font-medium">
                            Service Date
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formatDate(groomingPet.service_date) || "None"}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 font-medium">
                            Service Time
                          </p>
                          <p className="font-semibold text-gray-800">
                            {groomingPet.service_time || "None"}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 font-medium">
                            Service Variant
                          </p>
                          <p className="font-semibold text-gray-800">
                            {groomingPet.service_variant || "None"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Details */}
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Price Details
                    </h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {isBoarding ? (
                        <>
                          <p className="text-sm text-gray-500">
                            {boardingPet.boarding_type === "overnight"
                              ? `Base Price (${priceDetails.nights} night${priceDetails.nights !== 1 ? "s" : ""
                              })`
                              : `Base Price (${priceDetails.hours} hour${priceDetails.hours !== 1 ? "s" : ""
                              })`}
                          </p>
                          <p className="font-semibold text-gray-900 mb-2">
                            ${priceDetails.basePrice.toFixed(2)}
                          </p>
                          {priceDetails.discount > 0 && (
                            <>
                              <p className="text-sm text-gray-500">Discount</p>
                              <p className="font-semibold text-green-600 mb-2">
                                -{priceDetails.discount}%
                              </p>
                            </>
                          )}
                          <p className="text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                            Total: ${priceDetails.total.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">
                            {pet.service_type === "grooming" ? "Grooming Price" : "Service Price"}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            ${(typeof priceDetails === "number" ? priceDetails : priceDetails.total).toFixed(2)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={confirmedInfo}
              onChange={(e) => onConfirmChange(e.target.checked)}
              className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I confirm that the information above is correct.
            </span>
          </label>
          {!confirmedInfo && (
            <p className="text-red-500 text-sm mt-1">
              Please confirm the information to proceed.
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 flex items-center"
          >
            <FiChevronLeft className="mr-2" />
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmedInfo || isSubmitting}
            className={`
              ${
                isSubmitting
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }
              font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 flex items-center
            `}
          >
            {isSubmitting ? (
              <>
                <span>Loading...</span>
              </>
            ) : (
              <>
                Confirm Booking
                <FiChevronRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
