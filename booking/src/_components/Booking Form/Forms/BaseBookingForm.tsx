// BaseBookingForm.tsx
'use client';
import React, { useState, ChangeEvent, ReactNode } from 'react';
import { FiX } from 'react-icons/fi';
import CustomerStep from '../Steps/CustomerStep';
import PetStep from '../Steps/PetStep';
import ReviewStep from '../Steps/ReviewStep';
import StepIndicator from '../Form Components/StepIndicator';
import {
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
    BasePetDetailsProps, 
    parseDate, 
} from '../types';

function getNextDay(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}

function getPreviousDay(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

function clampTimeToRange(time: string): string {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    if (h < 9) return '09:00';
    if (h > 19 || (h === 19 && m > 0)) return '19:00';
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function formatDateToString(date: Date | string | null): string | null {
    if (!date) return null;
    if (typeof date === 'string') return date; 
    return date.toISOString().split('T')[0];
}


const BaseBookingForm: React.FC<BaseBookingFormProps> = ({
    onConfirmBooking,
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

            let formattedDate: string | null = null;
            if (date) {
                formattedDate = formatDateToString(date);
            }
       
            if (time) time = clampTimeToRange(time);
            if (isBoardingPet(currentPet)) {
                let updatedPetInstance = { ...currentPet };
                
                if (currentPet.boarding_type === 'day') {
                    if (type === 'checkIn' || type === 'checkOut') {
                        updatedPetInstance.check_in_date = formattedDate ? new Date(formattedDate) : null;
                        updatedPetInstance.check_out_date = formattedDate ? new Date(formattedDate) : null;
                    }
                    if (type === 'checkIn') updatedPetInstance.check_in_time = time;
                    if (type === 'checkOut') updatedPetInstance.check_out_time = time;
                }
              
                else if (currentPet.boarding_type === 'overnight') {
                    if (type === 'checkIn') {
                        updatedPetInstance.check_in_date = formattedDate ? new Date(formattedDate) : null;
                        if (formattedDate && updatedPetInstance.check_out_date && formattedDate === formatDateToString(updatedPetInstance.check_out_date)) {
                            updatedPetInstance.check_out_date = new Date(getNextDay(formattedDate));
                        }
                    }
                    if (type === 'checkOut') {
                        updatedPetInstance.check_out_date = formattedDate ? new Date(formattedDate) : null;
                        if (formattedDate && updatedPetInstance.check_in_date && formattedDate === formatDateToString(updatedPetInstance.check_in_date)) {
                            updatedPetInstance.check_in_date = new Date(getPreviousDay(formattedDate));
                        }
                    }        
                    if (time) { 
                        updatedPetInstance.check_in_time = time;
                        updatedPetInstance.check_out_time = time;
                    }
                }
                updatedPets[currentPetIndex] = updatedPetInstance;
                return updatedPets;
            }

            if (isGroomingPet(currentPet)) {
                const updatedPetInstance = {
                    ...currentPet,
                    service_date: type === 'service' && formattedDate ? new Date(formattedDate) : currentPet.service_date,
                    service_time: type === 'service' ? time : currentPet.service_time,
                };
                updatedPets[currentPetIndex] = updatedPetInstance;
                return updatedPets;
            }
            return prev;
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


    const validatePetForm = (pet: Pet): boolean => {
        const errors: Record<string, string> = {};
        let isValid = true;

        if (!pet.name.trim()) { errors.name = 'Pet name is required'; isValid = false; }
        if (!pet.age.trim()) { errors.age = 'Pet age is required'; isValid = false; }

        if (isBoardingPet(pet)) {
            const checkInDate = parseDate(pet.check_in_date);
            const checkOutDate = parseDate(pet.check_out_date);

            if (!checkInDate) { errors.check_in_date = 'Check-in date is required'; isValid = false; }
            if (!checkOutDate) { errors.check_out_date = 'Check-out date is required'; isValid = false; }
            
            if (checkInDate && checkOutDate && checkInDate.getTime() > checkOutDate.getTime()) {
                errors.check_out_date = 'Check-out date must be after check-in date'; isValid = false;
            }          
            if (pet.boarding_type === 'overnight' && checkInDate && checkOutDate && checkInDate.getTime() === checkOutDate.getTime()) {
                errors.check_out_date = 'Check-out date must be different for overnight boarding.';
                isValid = false;
            }

        } else if (isGroomingPet(pet)) {
            const serviceDate = parseDate(pet.service_date);
            if (!serviceDate) { errors.service_date = 'Service date is required'; isValid = false; }
            if (!pet.service_time) { errors.service_time = 'Service time is required'; isValid = false; }
        }

       
        setFormErrors(prev => ({ ...prev, [`pet-${pet.id}`]: JSON.stringify(errors) })); 
        return isValid;
    };

    const createNewPet = (): Pet => {
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const basePet = {
            id: uniqueId, 
            name: '',
            age: '',
            pet_type: 'dog' as const, 
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
                room_size: 'small', 
                boarding_type: 'day', 
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
                service_variant: 'basic', 
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
            setCurrentPetIndex(0); 
        }
    };

    const handleNextFromPet = () => {
        if (pets.length === 0) {
            setFormErrors({ ...formErrors, pets: 'Please add at least one pet' });
            return;
        }

        const allPetsValid = pets.every(pet => validatePetForm(pet));
        if (!allPetsValid) {
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
        <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] text-gray-900 overflow-hidden flex flex-col">
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
                            setCurrentPetIndex(pets.length); 
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
                                    newIndex = -1; 
                                }
                                setCurrentPetIndex(newIndex);
                                return updatedPets;
                            });
                        }}
                        onBack={() => setCurrentStep('customer')}
                        onNext={handleNextFromPet}
                        isSubmitting={isSubmitting}
                        errors={formErrors} 
                        onPetChange={handlePetChange}
                        onScheduleChange={handleScheduleChange}
                        dateHighlight={undefined} 
                        dateDefaultMessage={undefined} 
                        unavailableDates={unavailableDates}
                        unavailableTimes={unavailableTimes}
                    >
                        {children &&
                            ((childrenProps) => 
                                children({
                                    ...childrenProps, 
                                })
                            )}
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