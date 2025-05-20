// booking/src/_components/Booking Form/BaseBookingForm.tsx
'use client';
import React, { useState, ChangeEvent, ReactNode } from 'react';
import { FiX } from 'react-icons/fi';
import CustomerStep from '../Steps/CustomerStep';
import PetStep from '../Steps/PetStep';
import ReviewStep from '../Steps/ReviewStep';
import StepIndicator from '../Form Components/StepIndicator';
import {
    // Removed 'Booking' from this list as we are not creating Booking objects directly here for the server action
    OwnerDetails,
    Pet,
    ServiceType,
    BoardingPet,
    GroomingPet,
    pricing,
    calculateNights,
    isBoardingPet,
    isGroomingPet,
    BookingResult,
    ScheduleChangeHandler,
    BaseBookingFormProps,
    PetType,
    GroomingVariant,
    PetSize,
    DogGroomingVariant,
    RoomSize,
    BoardingType,
    MealInstruction,
} from '../types';

const BaseBookingForm: React.FC<BaseBookingFormProps> = ({
    onConfirmBooking, // This is now expected to match the createBooking signature
    onClose,
    serviceType,
    isSubmitting = false,
    children,
    unavailableDates = [],
    unavailableTimes = [],
}) => {
    const [currentStep, setCurrentStep] = useState<'customer' | 'pet' | 'review'>('customer');
    const [completedSteps, setCompletedSteps] = useState<('customer' | 'pet')[]>([]);
    const [ownerDetails, setOwnerDetails] = useState<OwnerDetails>({
        name: '',
        email: '',
        address: '',
        contact_number: ''
    });
    const [pets, setPets] = useState<Pet[]>([]);
    const [currentPetIndex, setCurrentPetIndex] = useState(-1);
    const [confirmedInfo, setConfirmedInfo] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOwnerDetails(prev => ({ ...prev, [name]: value }));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePetChange = (updatedPet: Pet) => {
        setPets(prev => {
            const newPets = prev.map((pet, index) =>
                index === currentPetIndex ? updatedPet : pet
            );
            return newPets;
        });
    };

    const handleScheduleChange: ScheduleChangeHandler = (type, date, time) => {
        setPets(prev => {
            const updatedPets = [...prev];

            if (currentPetIndex < 0 || currentPetIndex >= updatedPets.length) {
                console.warn('Invalid currentPetIndex in handleScheduleChange');
                return prev;
            }

            const currentPet = updatedPets[currentPetIndex];

            let updatedPetInstance: Pet;

            if (isBoardingPet(currentPet)) {
                updatedPetInstance = {
                    ...currentPet,
                    check_in_date: type === 'checkIn' ? date : currentPet.check_in_date,
                    check_in_time: type === 'checkIn' ? time : currentPet.check_in_time,
                    check_out_date: type === 'checkOut' ? date : currentPet.check_out_date,
                    check_out_time: type === 'checkOut' ? time : currentPet.check_out_time,
                };
            } else if (isGroomingPet(currentPet)) {
                updatedPetInstance = {
                    ...currentPet,
                    service_date: type === 'service' ? date : currentPet.service_date,
                    service_time: type === 'service' ? time : currentPet.service_time,
                };
            } else {
                return prev;
            }

            updatedPets[currentPetIndex] = updatedPetInstance;
            return updatedPets;
        });
    };

    const validateCustomerForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!ownerDetails.name.trim()) errors.name = 'Name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerDetails.email)) errors.email = 'Valid email is required';
        if (!ownerDetails.contact_number.trim()) errors.contactNumber = 'Contact number is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // You might want to add a validatePetForm function here
    const validatePetForm = (pet: Pet): boolean => {
        const errors: Record<string, string> = {};
        let isValid = true;

        if (!pet.name.trim()) { errors.name = 'Pet name is required'; isValid = false; }
        if (!pet.age.trim()) { errors.age = 'Pet age is required'; isValid = false; }
        // Add more validations specific to pet types if needed
        if (isBoardingPet(pet)) {
            if (!pet.check_in_date) { errors.check_in_date = 'Check-in date is required'; isValid = false; }
            if (!pet.check_out_date) { errors.check_out_date = 'Check-out date is required'; isValid = false; }
            if (pet.check_in_date && pet.check_out_date && pet.check_in_date > pet.check_out_date) {
                errors.check_out_date = 'Check-out date must be after check-in date'; isValid = false;
            }
        } else if (isGroomingPet(pet)) {
            if (!pet.service_date) { errors.service_date = 'Service date is required'; isValid = false; }
            if (!pet.service_time) { errors.service_time = 'Service time is required'; isValid = false; }
        }

        // Set form errors for the *current* pet being edited
        setFormErrors(prev => ({ ...prev, [`pet-${pet.id}`]: JSON.stringify(errors) })); // Store errors specific to this pet
        return isValid;
    };

    const createNewPet = (): Pet => {
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const basePet = {
            id: uniqueId, // Used as a temporary unique key for frontend state management
            name: '',
            age: '',
            pet_type: 'dog' as const, // Default to 'dog'
            breed: '',
            vaccinated: 'unknown' as const,
            size: '',
            vitamins_or_medications: '',
            allergies: '',
            special_requests: '',
            completed: false,
            service_type: serviceType
        };

        if (serviceType === 'boarding') {
            return {
                ...basePet,
                service_type: 'boarding',
                room_size: 'small', // Default value
                boarding_type: 'day', // Default value
                check_in_date: null,
                check_in_time: '',
                check_out_date: null,
                check_out_time: '',
                meal_instructions: {
                    breakfast: { time: '', food: '', notes: '' },
                    lunch: { time: '', food: '', notes: '' },
                    dinner: { time: '', food: '', notes: '' }
                },
                special_feeding_request: ''
            } as BoardingPet;
        } else {
            return {
                ...basePet,
                service_type: 'grooming',
                service_variant: 'basic', // Default value
                service_date: null,
                service_time: ''
            } as GroomingPet;
        }
    };

    const handleNextFromCustomer = () => {
        if (!validateCustomerForm()) return;
        setCompletedSteps(prev => [...prev, 'customer']);
        setCurrentStep('pet');
        if (pets.length === 0) {
            setPets([createNewPet()]);
            setCurrentPetIndex(0);
        } else {
            setCurrentPetIndex(0); // Go to the first pet if pets already exist
        }
    };

    const handleNextFromPet = () => {
        if (pets.length === 0) {
            setFormErrors({ ...formErrors, pets: 'Please add at least one pet' });
            return;
        }

        // Validate all pets before proceeding
        const allPetsValid = pets.every(pet => validatePetForm(pet));
        if (!allPetsValid) {
            // If any pet is invalid, we will not proceed and display errors in PetStep
            setFormErrors(prev => ({ ...prev, general: 'Please correct pet details before proceeding.' }));
            return;
        }


        setCompletedSteps(prev => [...prev, 'pet']);
        setCurrentStep('review');
    };

    const handleStepClick = (stepId: 'customer' | 'pet' | 'review') => {
        const stepOrder = ['customer', 'pet', 'review'];
        const clickedIndex = stepOrder.indexOf(stepId);
        const currentIndex = stepOrder.indexOf(currentStep);

        if (clickedIndex < currentIndex) {
            setCurrentStep(stepId);
        } else if (clickedIndex > currentIndex) {
            if (currentStep === 'customer' && validateCustomerForm()) {
                setCompletedSteps(prev => [...prev, 'customer']);
                setCurrentStep('pet');
            } else if (currentStep === 'pet') {
                // If trying to jump to review from pet, validate all pets
                const allPetsValid = pets.every(pet => validatePetForm(pet));
                if (allPetsValid) {
                    setCompletedSteps(prev => [...prev, 'pet']);
                    setCurrentStep('review');
                } else {
                    setFormErrors(prev => ({ ...prev, general: 'Please correct pet details before proceeding.' }));
                }
            }
        }
    };

    const handleConfirmBooking = async (): Promise<BookingResult> => {
        if (!confirmedInfo) {
            setFormErrors({ ...formErrors, confirmation: 'Please confirm the information is correct' });
            return { success: false, error: 'Confirmation required' };
        }

        try {
            const totalAmounts: number[] = [];
            const discountsApplied: number[] = [];

            // Calculate total amounts and discounts for each pet
            pets.forEach(pet => {
                let petTotalAmount = 0;
                let petDiscount = 0;

                if (isGroomingPet(pet)) {
                    const groomingPet = pet as GroomingPet;
                    petTotalAmount = getGroomingPrice(
                        groomingPet.pet_type,
                        groomingPet.service_variant,
                        groomingPet.size as PetSize
                    );
                } else if (isBoardingPet(pet)) {
                    const boardingPet = pet as BoardingPet;
                    const checkInDate = boardingPet.check_in_date;
                    const checkOutDate = boardingPet.check_out_date;
                    const nights = calculateNights(checkInDate, checkOutDate);

                    let basePrice = 0;
                    let discount = 0;
                    let roomSizeKey = boardingPet.room_size;

                    if (boardingPet.boarding_type === 'day') {
                        basePrice = pricing.boarding.day[roomSizeKey] || 0;
                    } else { // Overnight
                        basePrice = (pricing.boarding.overnight[roomSizeKey] || 0) * nights;
                        if (nights >= 15) discount = 0.2;
                        else if (nights >= 7) discount = 0.1;
                    }
                    petTotalAmount = basePrice * (1 - discount);
                    petDiscount = discount;
                }

                totalAmounts.push(petTotalAmount);
                discountsApplied.push(petDiscount);
            });

            // This is the CRITICAL change: Pass ownerDetails, pets, totalAmounts, and discountsApplied
            return await onConfirmBooking(ownerDetails, pets, totalAmounts, discountsApplied);

        } catch (error) {
            console.error('Booking error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Booking failed';
            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const getGroomingPrice = (
        petType: PetType,
        variant: GroomingVariant,
        size?: PetSize
    ): number => {
        if (petType === 'dog') {
            return pricing.grooming.dog[variant as DogGroomingVariant]?.[size as PetSize] || 0;
        } else if (petType === 'cat') {
            return pricing.grooming.cat.cat;
        }
        return 0;
    };

    return (
        <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close form"
                disabled={isSubmitting}
            >
                <FiX size={24} />
            </button>

            <div className="mb-8 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {serviceType === 'grooming' ? 'Grooming Booking' : 'Boarding Booking'}
                </h1>
                <p className="text-gray-600">
                    {serviceType === 'grooming'
                        ? 'Schedule your pet\'s grooming session'
                        : 'Book your pet\'s stay'}
                </p>
            </div>

            <StepIndicator
                currentStep={currentStep}
                serviceType={serviceType}
                completedSteps={completedSteps}
                onStepClick={handleStepClick}
            />

            <div className="flex-grow overflow-y-auto">
                {currentStep === 'customer' && (
                    <CustomerStep
                        ownerDetails={ownerDetails}
                        onChange={handleOwnerChange}
                        errors={formErrors}
                        onNext={handleNextFromCustomer}
                        isSubmitting={isSubmitting}
                    />
                )}

                {currentStep === 'pet' && (
                    <PetStep
                        pets={pets}
                        currentPetIndex={currentPetIndex}
                        serviceType={serviceType}
                        onAddPet={() => {
                            const newPet = createNewPet();
                            setPets(prevPets => [...prevPets, newPet]);
                            setCurrentPetIndex(pets.length); // Set index to the newly added pet
                        }}
                        onEditPet={(index: number) => setCurrentPetIndex(index)}
                        onRemovePet={(index: number) => {
                            setPets(prevPets => {
                                const updatedPets = prevPets.filter((_, i) => i !== index);

                                let newIndex = currentPetIndex;
                                if (index === currentPetIndex) {
                                    newIndex = Math.max(0, index - 1);
                                } else if (index < currentPetIndex) {
                                    newIndex = currentPetIndex - 1;
                                }

                                if (updatedPets.length === 0) {
                                    newIndex = -1; // No pets left
                                }
                                setCurrentPetIndex(newIndex);
                                return updatedPets;
                            });
                        }}
                        onBack={() => setCurrentStep('customer')}
                        onNext={handleNextFromPet}
                        isSubmitting={isSubmitting}
                        errors={formErrors} // Pass form errors to PetStep
                        onPetChange={handlePetChange}
                        onScheduleChange={handleScheduleChange}
                    >
                        {children &&
                            ((pet, onChange, onScheduleChange, errors) =>
                                children({
                                    pet,
                                    onChange,
                                    onScheduleChange,
                                    errors,
                                    serviceType,
                                    onAddPet: () => {
                                        const newPet = createNewPet();
                                        setPets(prevPets => [...prevPets, newPet]);
                                        setCurrentPetIndex(pets.length);
                                    },
                                    onRemovePet: (index: number) => {
                                        setPets(prevPets => {
                                            const updatedPets = prevPets.filter((_, i) => i !== index);
                                            let newIndex = currentPetIndex;
                                            if (index === currentPetIndex) {
                                                newIndex = Math.max(0, index - 1);
                                            } else if (index < currentPetIndex) {
                                                newIndex = currentPetIndex - 1;
                                            }
                                            if (updatedPets.length === 0) {
                                                newIndex = -1;
                                            }
                                            setCurrentPetIndex(newIndex);
                                            return updatedPets;
                                        });
                                    },
                                    currentPetIndex,
                                }))}
                    </PetStep>
                )}

                {currentStep === 'review' && (
                    <ReviewStep
                        ownerDetails={ownerDetails}
                        pets={pets}
                        serviceType={serviceType}
                        confirmedInfo={confirmedInfo}
                        onConfirmChange={setConfirmedInfo}
                        onBack={() => setCurrentStep('pet')}
                        onConfirm={handleConfirmBooking}
                        isSubmitting={isSubmitting}
                        errors={formErrors}
                    />
                )}
            </div>
        </div>
    );
};

export default BaseBookingForm;