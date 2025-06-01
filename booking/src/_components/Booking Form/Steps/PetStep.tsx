'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Pet,
    ServiceType,
    BoardingPet,
    GroomingPet,
    PetStepProps,
    ScheduleChangeHandler,
    isBoardingPet,
    isGroomingPet,
} from '../types'; 
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import PetList from '../Form Components/PetList';
import BasePetDetails from '../Form Components/BasePetDetails'; 
import toast, { Toaster } from 'react-hot-toast';

const PetStep: React.FC<PetStepProps> = ({
    pets,
    currentPetIndex,
    serviceType,
    onAddPet,
    onEditPet,
    onRemovePet,
    onBack,
    onNext,
    isSubmitting = false,
    errors = {},
    onPetChange,
    onScheduleChange,
    unavailableDates, 
    unavailableTimes, 
    dateHighlight,
    dateDefaultMessage,
    children
}) => {

    const [localPetErrors, setLocalPetErrors] = useState<Record<string, string>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    const currentPet = useMemo(() => {
        return currentPetIndex >= 0 ? pets[currentPetIndex] : undefined;
    }, [pets, currentPetIndex]);

    useEffect(() => {
        if (currentPet) {
            try {
                const specificPetErrors = errors[`pet-${currentPet.id}`];
                setLocalPetErrors(specificPetErrors ? JSON.parse(specificPetErrors) : {});
            } catch (e) {
                console.error("Failed to parse pet errors from props:", e);
                setLocalPetErrors({});
            }
        } else {
            setLocalPetErrors({});
        }
    }, [currentPet, errors]);


    useEffect(() => {
        if (Object.keys(localPetErrors).length > 0) {
            scrollToFirstError(localPetErrors);
        }
    }, [localPetErrors]);

    const scrollToFirstError = (errorsToScroll: Record<string, string>) => {
        const firstErrorField = Object.keys(errorsToScroll)[0];
        if (firstErrorField) {
            const element = document.getElementById(firstErrorField);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            } else {
                console.warn(`Element with ID '${firstErrorField}' not found for scrolling.`);
            }
        }
    };


    const validatePetDetails = (pet: Pet, service: ServiceType): Record<string, string> => {
        const currentPetErrors: Record<string, string> = {};

        // Pet Name validation
        if (!pet.name?.trim()) {
            currentPetErrors.name = 'Pet name is required.';
        } else {
            if (!/^[A-Za-z ]+$/.test(pet.name.trim())) {
                currentPetErrors.name = 'Pet name can only contain letters and spaces.';
            } else if (pet.name.trim().length > 10) {
                currentPetErrors.name = 'Pet name must not be more than 10 characters.';
            }
        }
        // Pet Breed validation
        if (!pet.breed?.trim()) {
            currentPetErrors.breed = 'Breed is required.';
        } else {
            if (!/^[A-Za-z ]+$/.test(pet.breed.trim())) {
                currentPetErrors.breed = 'Pet breed can only contain letters and spaces.';
            } else if (pet.breed.trim().length > 25) {
                currentPetErrors.breed = 'Pet breed must not be more than 25 characters.';
            }
        }
        if (!pet.pet_type) currentPetErrors.pet_type = 'Pet type is required.';
        if (!pet.age?.trim()) currentPetErrors.age = 'Age is required.';

        if (pet.vaccinated === 'unknown' || pet.vaccinated === '') {
            currentPetErrors.vaccinated = 'Vaccination status is required.';
        }
        if (!pet.size?.trim()) currentPetErrors.size = 'Size is required.';


        if (isBoardingPet(pet)) {
            const boardingPet = pet;
            if (!boardingPet.room_size) currentPetErrors.room_size = 'Room size is required.';
            if (!boardingPet.boarding_type) currentPetErrors.boarding_type = 'Boarding type is required.';
            if (!boardingPet.check_in_date) currentPetErrors.check_in_date = 'Check-in date is required.';
            if (!boardingPet.check_in_time?.trim()) currentPetErrors.check_in_time = 'Check-in time is required.';
            if (!boardingPet.check_out_date) currentPetErrors.check_out_date = 'Check-out date is required.';
            if (!boardingPet.check_out_time?.trim()) currentPetErrors.check_out_time = 'Check-out time is required.';

            if (boardingPet.check_in_date && boardingPet.check_out_date) {
                if (boardingPet.boarding_type === 'day') {
                    if (boardingPet.check_in_date.getTime() !== boardingPet.check_out_date.getTime()) {
                        currentPetErrors.check_out_date = 'For Day Boarding, check-out date must be the same as check-in date.';
                    }
                } else if (boardingPet.boarding_type === 'overnight') {
                    if (boardingPet.check_in_date.getTime() >= boardingPet.check_out_date.getTime()) {
                        currentPetErrors.check_out_date = 'For Overnight Boarding, check-out date must be after check-in date.';
                    }
                }
            }


            if (boardingPet.meal_instructions) {
                ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                    const meal = boardingPet.meal_instructions?.[mealType as keyof BoardingPet['meal_instructions']];
                    if (meal && (meal.time?.trim() || meal.food?.trim() || meal.notes?.trim())) {
                        if (!meal.time?.trim()) currentPetErrors[`meal_instructions.${mealType}.time`] = `${mealType} time is required.`;
                        if (!meal.food?.trim()) currentPetErrors[`meal_instructions.${mealType}.food`] = `${mealType} food is required.`;
                    }
                });
            }
        } else if (isGroomingPet(pet)) {
            const groomingPet = pet;
            if (!groomingPet.service_variant) currentPetErrors.service_variant = 'Service variant is required.';
            if (!groomingPet.service_date) currentPetErrors.service_date = 'Service date is required.';
            if (!groomingPet.service_time?.trim()) currentPetErrors.service_time = 'Service time is required.';
        }

        return currentPetErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (!currentPet) return;

        setLocalPetErrors(prev => {
            const newErrors = { ...prev };
            if (newErrors[name]) {
                delete newErrors[name];
            }
            if (name.startsWith('meal_instructions.')) {
                const [_, mealType, field] = name.split('.');
                if (newErrors[`meal_instructions.${mealType}.${field}`]) {
                    delete newErrors[`meal_instructions.${mealType}.${field}`];
                }
            }
            return newErrors;
        });

        let updatedPet: Pet;

        if (name.startsWith('meal_instructions.')) {
            if (!isBoardingPet(currentPet)) return;

            const [_, mealType, field] = name.split('.');
            updatedPet = {
                ...currentPet,
                meal_instructions: {
                    ...currentPet.meal_instructions,
                    [mealType]: {
                        ...(currentPet.meal_instructions?.[mealType as keyof BoardingPet['meal_instructions']] || { time: '', food: '', notes: '' }),
                        [field]: value
                    }
                }
            } as BoardingPet;
        } else {
            updatedPet = {
                ...currentPet,
                [name]: value,
            };
        }
        onPetChange(updatedPet);
    };

    const handleScheduleChangeInternal: ScheduleChangeHandler = (type, date, time) => {
        const dateFieldName =
            type === 'checkIn' ? 'check_in_date' :
            type === 'checkOut' ? 'check_out_date' :
            'service_date';

        const timeFieldName =
            type === 'checkInTime' ? 'check_in_time' :
            type === 'checkOutTime' ? 'check_out_time' :
            'service_time';

        setLocalPetErrors(prev => {
            const newErrors = { ...prev };
            if ((type === 'checkIn' || type === 'checkOut' || type === 'service') && date !== null && date !== undefined) {
                delete newErrors[dateFieldName];
            }
            if ((type === 'checkInTime' || type === 'checkOutTime' || type === 'serviceTime') && time && time.trim()) {
                delete newErrors[timeFieldName];
            }
            return newErrors;
        });

        onScheduleChange(type, date, time);
    };


    const handleAddPetClick = () => {
        if (isSubmitting) return;

        if (currentPet) {
            const errors = validatePetDetails(currentPet, serviceType);
            if (Object.keys(errors).length > 0) {
                setLocalPetErrors(errors);
                toast.error(`Please complete the current pet's details (${currentPet.name || 'Unnamed Pet'}) before adding a new one. Missing fields are highlighted.`);
                return;
            }
        }
        setLocalPetErrors({});
        onAddPet();
    };

    const handleNextClick = () => {
        if (isSubmitting) return;

        if (pets.length === 0) {
            toast.error("Please add at least one pet to proceed.");
            return;
        }

        let firstInvalidPetIndex: number | null = null;
        let firstInvalidPetErrors: Record<string, string> = {};

        for (let i = 0; i < pets.length; i++) {
            const errors = validatePetDetails(pets[i], serviceType);
            if (Object.keys(errors).length > 0) {
                firstInvalidPetIndex = i;
                firstInvalidPetErrors = errors;
                break;
            }
        }

        if (firstInvalidPetIndex !== null) {
            if (currentPetIndex !== firstInvalidPetIndex) {
                onEditPet(firstInvalidPetIndex);
                setTimeout(() => {
                    setLocalPetErrors(firstInvalidPetErrors);
                }, 0);
            } else {
                setLocalPetErrors(firstInvalidPetErrors);
            }
            toast.error(`Please complete all details for "${pets[firstInvalidPetIndex].name || `Pet ${firstInvalidPetIndex + 1}`}". Missing fields are highlighted.`);
            return;
        }

        setLocalPetErrors({});
        onNext();
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <Toaster />
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-gray-200 flex-grow overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                            <FontAwesomeIcon icon={faPaw} className="h-5 w-5" />
                        </span>
                        Your Pets
                    </h2>
                    <button
                        onClick={handleAddPetClick}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center space-x-2 disabled:bg-orange-400 transition-colors duration-200"
                    >
                        <FiPlus size={18} />
                        <span>Add Pet</span>
                    </button>
                </div>


                {errors.pets && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {errors.pets}
                    </div>
                )}

                <div ref={containerRef} className="flex-grow overflow-y-auto">
                    <PetList
                        pets={pets}
                        currentPetIndex={currentPetIndex}
                        onEdit={onEditPet}
                        onRemove={onRemovePet}
                    />

                    {currentPet && (
                        <div key={currentPet.id || currentPetIndex} className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                Pet Details
                            </h3>
                            {children ? (
                                children(
                                    {
                                        pet: currentPet,
                                        onChange: handleChange,
                                        onScheduleChange: handleScheduleChangeInternal,
                                        errors: localPetErrors,
                                        serviceType: serviceType,
                                        onAddPet: onAddPet,
                                        onRemovePet: onRemovePet,
                                        currentPetIndex: currentPetIndex,
                                        unavailableDates: unavailableDates, 
                                        unavailableTimes: unavailableTimes, 
                                        dateHighlight: dateHighlight,
                                        dateDefaultMessage: dateDefaultMessage
                                    }
                                )
                            ) : (
                                <BasePetDetails
                                    pet={currentPet}
                                    onChange={handleChange}
                                    errors={localPetErrors}
                                    onScheduleChange={handleScheduleChangeInternal}
                                    serviceType={serviceType}
                                    unavailableDates={unavailableDates} 
                                    unavailableTimes={unavailableTimes} 
                                    dateHighlight={dateHighlight}
                                    dateDefaultMessage={dateDefaultMessage}
                                />
                            )}

                            {isBoardingPet(currentPet) && (
                                <>
                                    {errors[`pet-${currentPet.id}`] && (() => {
                                        try {
                                            const parsedErrors = JSON.parse(errors[`pet-${currentPet.id}`]);
                                            return parsedErrors.check_out_date && (
                                                <div className="error" style={{ color: 'red', marginBottom: 8, marginTop: 8 }}>
                                                    {parsedErrors.check_out_date}
                                                </div>
                                            );
                                        } catch (e) {
                                            console.error("Error parsing pet errors for check-out date display:", e);
                                            return null;
                                        }
                                    })()}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center disabled:opacity-50 transition-colors duration-200"
                >
                    <FiChevronLeft className="mr-2" /> Back to Customer
                </button>
                <button
                    onClick={handleNextClick}
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-xl flex items-center transition-all duration-200 ${
                        isSubmitting
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                >
                    Review Booking <FiChevronRight className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default PetStep;