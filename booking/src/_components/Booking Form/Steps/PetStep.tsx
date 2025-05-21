'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    Pet,
    ServiceType,
    BoardingPet,
    GroomingPet,
    PetStepProps,
    ScheduleChangeHandler,
    ScheduleChangeType
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
    dateHighlight,
    dateDefaultMessage,
    children
}) => {

    const [petErrors, setPetErrors] = useState<Record<string, string>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPetErrors({});
    }, [currentPetIndex, pets]);


    useEffect(() => {
        if (Object.keys(petErrors).length > 0) {
            scrollToFirstError(petErrors);
        }
    }, [petErrors]);

    const scrollToFirstError = (errors: Record<string, string>) => {
        const firstErrorField = Object.keys(errors)[0];
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
        const errors: Record<string, string> = {};

        if (!pet.name?.trim()) errors.name = 'Pet name is required.';
        if (!pet.pet_type) errors.pet_type = 'Pet type is required.';
        if (!pet.breed?.trim()) errors.breed = 'Breed is required.';
        if (!pet.age?.trim()) errors.age = 'Age is required.';
        if (pet.vaccinated === undefined || pet.vaccinated === 'unknown') errors.vaccinated = 'Vaccination status is required.';
        if (!pet.size?.trim()) errors.size = 'Size is required.';

        if (service === 'boarding') {
            const boardingPet = pet as BoardingPet;
            if (!boardingPet.room_size) errors.room_size = 'Room size is required.';
            if (!boardingPet.boarding_type) errors.boarding_type = 'Boarding type is required.';
            if (!boardingPet.check_in_date) errors.check_in_date = 'Check-in date is required.';
            if (!boardingPet.check_in_time?.trim()) errors.check_in_time = 'Check-in time is required.';
            if (!boardingPet.check_out_date) errors.check_out_date = 'Check-out date is required.';
            if (!boardingPet.check_out_time?.trim()) errors.check_out_time = 'Check-out time is required.';

            if (boardingPet.meal_instructions) {
                ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                    const meal = boardingPet.meal_instructions?.[mealType as keyof BoardingPet['meal_instructions']];
                    if (meal && (meal.time || meal.food || meal.notes)) {
                        if (!meal.time?.trim()) errors[`meal_instructions.${mealType}.time`] = `${mealType} time is required.`;
                        if (!meal.food?.trim()) errors[`meal_instructions.${mealType}.food`] = `${mealType} food is required.`;
                    }
                });
            }
        } else if (service === 'grooming') {
            const groomingPet = pet as GroomingPet;
            if (!groomingPet.service_variant) errors.service_variant = 'Service variant is required.';
            if (!groomingPet.service_date) errors.service_date = 'Service date is required.';
            if (!groomingPet.service_time?.trim()) errors.service_time = 'Service time is required.';
        }

        return errors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;


        if (petErrors[name]) {
            setPetErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        const currentPet = pets[currentPetIndex];
        let updatedPet: Pet;

        if (name.startsWith('meal_instructions.')) {
            if (!currentPet || !('meal_instructions' in currentPet)) return;

            const [_, mealType, field] = name.split('.');
            updatedPet = {
                ...currentPet,
                meal_instructions: {
                    ...(currentPet as BoardingPet).meal_instructions,
                    [mealType]: {
                        ...((currentPet as BoardingPet).meal_instructions?.[mealType as keyof BoardingPet['meal_instructions']] || { time: '', food: '', notes: '' }),
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
            type === 'checkIn' ? 'check_in_time' :
            type === 'checkOut' ? 'check_out_time' :
            'service_time';

        setPetErrors(prev => {
            const newErrors = { ...prev };
            if (prev[dateFieldName] && date !== null && date !== undefined) delete newErrors[dateFieldName];
            if (prev[timeFieldName] && time && time.trim()) delete newErrors[timeFieldName];
            return newErrors;
        });

        onScheduleChange(type, date, time);
    };


    const handleAddPetClick = () => {
        if (isSubmitting) return;

        if (currentPetIndex >= 0 && pets[currentPetIndex]) {
            const errors = validatePetDetails(pets[currentPetIndex], serviceType);
            if (Object.keys(errors).length > 0) {
                setPetErrors(errors);
                toast.error("Please complete the current pet's details before adding a new one. Missing fields are highlighted.");
                return;
            }
        }
        setPetErrors({});
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
                    setPetErrors(firstInvalidPetErrors);
                }, 0);
            } else {
                setPetErrors(firstInvalidPetErrors);
            }
            toast.error(`Please complete all details for "${pets[firstInvalidPetIndex].name || `Pet ${firstInvalidPetIndex + 1}`}". Missing fields are highlighted.`);
            return;
        }

        setPetErrors({});
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

                    {currentPetIndex >= 0 && pets[currentPetIndex] && (
                        <div key={pets[currentPetIndex].id || currentPetIndex} className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                Pet Details
                            </h3>
                            {children ? (
                                children(
                                    {
                                        pet: pets[currentPetIndex],
                                        onChange: handleChange,
                                        onScheduleChange: handleScheduleChangeInternal,
                                        errors: petErrors,
                                        serviceType: serviceType,
                                        onAddPet: onAddPet,
                                        onRemovePet: onRemovePet,
                                        currentPetIndex: currentPetIndex,
                                        dateHighlight: dateHighlight,
                                        dateDefaultMessage: dateDefaultMessage
                                    }
                                )
                            ) : (
                                <BasePetDetails
                                    pet={pets[currentPetIndex]}
                                    onChange={handleChange}
                                    errors={petErrors}
                                    onScheduleChange={handleScheduleChangeInternal}
                                    serviceType={serviceType}
                                    dateHighlight={dateHighlight}
                                    dateDefaultMessage={dateDefaultMessage}
                                />
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