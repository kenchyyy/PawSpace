'use client';
import React, { useState, ChangeEvent, ReactNode, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { isSameDay, addDays } from 'date-fns';
import { FiX } from 'react-icons/fi';
import CustomerStep from '../Steps/CustomerStep';
import PetStep from '../Steps/PetStep';
import ReviewStep from '../Steps/ReviewStep';
import StepIndicator from '../Form Components/StepIndicator';
import {
    OwnerDetails, Pet, ServiceType, BoardingPet, GroomingPet, pricing, calculateNights, isBoardingPet, isGroomingPet, BookingResult, ScheduleChangeHandler, BaseBookingFormProps, PetType, GroomingVariant, PetSize, DogGroomingVariant, RoomSize, BoardingType, MealInstruction,
    BasePetDetailsProps, parseDate
} from '../types';
import { getGroomingPrice, getBoardingPrice } from '../Steps/ReviewItems/Functions/pricingCalculations';

const BaseBookingForm: React.FC<BaseBookingFormProps> = ({
    onConfirmBooking,
    onClose,
    serviceType,
    isSubmitting = false,
    children,
    unavailableDates = [],
    unavailableTimes = [],
    dateHighlight,
    dateDefaultMessage,
}) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [currentStep, setCurrentStep] = useState<'customer' | 'pet' | 'review'>('customer');
    const [completedSteps, setCompletedSteps] = useState<('customer' | 'pet')[]>([]);
    const [ownerDetails, setOwnerDetails] = useState<OwnerDetails>({
        name: '',
        email: '',
        address: '',
        contact_number: '',
        auth_id: undefined,
    });
    const [pets, setPets] = useState<Pet[]>([]);
    const [currentPetIndex, setCurrentPetIndex] = useState(-1);
    const [confirmedInfo, setConfirmedInfo] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [loadingOwner, setLoadingOwner] = useState(true);

    useEffect(() => {
        setLoadingOwner(true);

        const autofillOwnerDetails = async () => {
            console.log('Attempting to autofill owner details...');
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session:', error);
                setLoadingOwner(false);
                return;
            }

            if (!session?.user) {
                console.log('No user session found. Not autofilling.');
                setLoadingOwner(false);
                return;
            }

            const user = session.user;
            console.log('Supabase user:', user); 
            console.log('User metadata:', user.user_metadata); 
            const newOwnerDetails = {
                name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
                email: user.email || '',
                address: '',
                contact_number: '',
                auth_id: user.id,
            };
            console.log('Autofilling with:', newOwnerDetails);
            setOwnerDetails(newOwnerDetails);
            setLoadingOwner(false);
        };

        autofillOwnerDetails();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state change event:', event, 'Session:', session);
            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
                const user = session.user;
                const newOwnerDetails = {
                    name: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
                    email: session.user.email || '',
                    address: '',
                    contact_number: '',
                    auth_id: session.user.id,
                };
                console.log('Auth state change - setting owner details:', newOwnerDetails);
                setOwnerDetails(newOwnerDetails);
                setLoadingOwner(false);
            } else if (event === 'SIGNED_OUT') {
                console.log('Auth state change - signed out. Clearing owner details.');
                setOwnerDetails({
                    name: '',
                    email: '',
                    address: '',
                    contact_number: '',
                    auth_id: undefined,
                });
                setLoadingOwner(false);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    if (loadingOwner) return <div>Loading your info...</div>;

    const validateCustomerForm = (details: OwnerDetails): Record<string, string> => {
        const errors: Record<string, string> = {};

        const nameRegex = /^[a-zA-Z.\-' ]{5,25}$/;
        if (!details.name.trim()) {
            errors.name = 'Full Name is required.';
        } else if (!nameRegex.test(details.name.trim())) {
            errors.name = "Full Name can only contain letters, spaces, '.', ' ’ ', and '-'.";
        } else if (details.name.trim().length > 25) {
            errors.name = 'Full Name must not be more than 25 characters.';
        } else if (details.name.trim().split(/\s+/).length < 2) {
            errors.name = 'Please enter your full name (e.g., "John Doe")';
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!details.email.trim()) {
            errors.email = 'Email is required.';
        } else if (!emailRegex.test(details.email.trim())) {
            errors.email = 'Please enter a valid email address (e.g., example@gmail.com).';
        } 

        const phContactNumberRegex = /^09\d{9}$/; 
        if (!details.contact_number.trim()) {
            errors.contact_number = 'Contact Number is required.';
        } else if (!phContactNumberRegex.test(details.contact_number.trim())) {
            errors.contact_number = 'Please enter a valid 11-digit Philippine mobile number (e.g., 09123456789).';
        } else if (details.contact_number.length > 11) {
            errors.contact_number = 'Contact number must be exactly 11 digits.';
        }

        if (!details.address.trim()) {
            errors.address = 'Address is required.';
        } else if (details.address.trim().length < 10) { 
            errors.address = 'Make sure to input a complete address.';
        }

        return errors;
    };

    const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'name') {
            formattedValue = value
                .split(' ')
                .map(part =>
                    part.length > 0
                        ? part[0].toUpperCase() + part.slice(1).toLowerCase()
                        : ''
                )
                .join(' ');
        }
        if (name === 'contact_number' && value.length > 11) {
            return;
        }
        setOwnerDetails(prev => {
            const updatedDetails = { ...prev, [name]: formattedValue };
            const newErrors = validateCustomerForm(updatedDetails);
            setFormErrors(prevErrors => {
                const currentErrors = JSON.stringify(prevErrors);
                const updatedErrors = JSON.stringify(newErrors);
                if (currentErrors !== updatedErrors) {
                    return newErrors;
                }
                return prevErrors;
            });
            return updatedDetails;
        });
    };

    const handlePetChange = (updatedPet: Pet) => {
        setPets(prev => {
            const newPets = prev.map((pet, index) =>
                index === currentPetIndex ? updatedPet : pet
            );
            return newPets;
        });
        if (formErrors[`pet-${updatedPet.id}`]) {
            const petErrors = JSON.parse(formErrors[`pet-${updatedPet.id}`] || '{}');
            const fieldName = Object.keys(updatedPet).find(key => updatedPet[key as keyof Pet] !== (pets[currentPetIndex] as any)[key]);
            if (fieldName && petErrors[fieldName]) {
                    validatePetForm(updatedPet);
            } else {
                validatePetForm(updatedPet); 
            }
        }
    };

const handleScheduleChange: ScheduleChangeHandler = (type, value, time) => {
    setPets(prevPets => {
        return prevPets.map((pet, index) => {
            if (index === currentPetIndex && isBoardingPet(pet)) {
                const updatedPet: BoardingPet = { ...pet };
                let currentPetErrors: Record<string, string> = JSON.parse(formErrors[`pet-${pet.id}`] || '{}');

                delete currentPetErrors.check_in_date;
                delete currentPetErrors.check_out_date;
                delete currentPetErrors.check_in_time;
                delete currentPetErrors.check_out_time;
                delete currentPetErrors.boarding_type;
                delete currentPetErrors.room_size;

                if (type === 'boardingType') {
                    updatedPet.boarding_type = value as BoardingType;
                    updatedPet.check_in_time = '';
                    updatedPet.check_out_time = '';
                    updatedPet.check_in_date = null;
                    updatedPet.check_out_date = null;
                    if (
                        updatedPet.boarding_type === 'day' &&
                        updatedPet.check_in_date &&
                        updatedPet.check_out_date &&
                        !isSameDay(updatedPet.check_in_date, updatedPet.check_out_date)
                    ) {
                        updatedPet.check_out_date = updatedPet.check_in_date;
                    }
                } else if (type === 'checkIn') {
                    updatedPet.check_in_date = parseDate(value);
                    if (time !== undefined) updatedPet.check_in_time = time;
                    else if (!updatedPet.check_in_date) updatedPet.check_in_time = '';
                    if (updatedPet.boarding_type === 'day' && updatedPet.check_in_date) {
                        updatedPet.check_out_date = updatedPet.check_in_date;
                    }
                } else if (type === 'checkOut') {
                    updatedPet.check_out_date = parseDate(value);
                    if (time !== undefined) updatedPet.check_out_time = time;
                    else if (!updatedPet.check_out_date) updatedPet.check_out_time = '';
                } else if (type === 'checkInTime') {
                    updatedPet.check_in_time = time || '';
                } else if (type === 'checkOutTime') {
                    updatedPet.check_out_time = time || '';
                }

                const errorsAfterChange = validatePetForm(updatedPet, true);

                setFormErrors(prev => ({
                    ...prev,
                    [`pet-${pet.id}`]: JSON.stringify(errorsAfterChange)
                }));
                return updatedPet;
            }

            if (index === currentPetIndex && isGroomingPet(pet)) {
                const updatedPet = { ...pet };
                let currentPetErrors: Record<string, string> = JSON.parse(formErrors[`pet-${pet.id}`] || '{}');

                delete currentPetErrors.service_date;
                delete currentPetErrors.service_time;

                if (type === 'service') {
                    updatedPet.service_date = parseDate(value);
                    if (time !== undefined) updatedPet.service_time = time;
                } else if (type === 'serviceTime') {
                    updatedPet.service_time = time || '';
                }

                const errorsAfterChange = validatePetForm(updatedPet, true);

                setFormErrors(prev => ({
                    ...prev,
                    [`pet-${pet.id}`]: JSON.stringify(errorsAfterChange)
                }));
                return updatedPet;
            }

            return pet;
        });
    });
};


    const timeToNumber = (timeStr: string): number => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 100 + minutes;
    };

    const handleReviewConfirmChange = (checked: boolean) => {
        setConfirmedInfo(checked);
        if (formErrors.confirmedInfo) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.confirmedInfo;
                return newErrors;
            });
        }
    };

    const validatePetForm = (pet: Pet, silent: boolean = false): Record<string, string> => {
        const errors: Record<string, string> = {};
        let isValid = true; 

        if (!pet.name?.trim()) { 
            errors.name = 'Pet name is required'; 
            isValid = false; 
        }

        if (!pet.pet_type) { errors.pet_type = 'Pet type is required.'; isValid = false; }
        if (!pet.breed?.trim()) { errors.breed = 'Breed is required.'; isValid = false; }
        if (pet.vaccinated === 'unknown' || pet.vaccinated === '') { errors.vaccinated = 'Vaccination status is required.'; isValid = false; }
        if (!pet.size) { errors.size = 'Size is required.'; isValid = false; }

        const ageRegex = /^([1-9]|[1-9][0-9])\s*(month|months|year|years)$/i;
        if (!pet.age || !ageRegex.test(pet.age.trim())) {
            errors.age = 'Age is required and must be a number (1-99) followed by "months" or "years" (e.g., "6 months", "2 years").';
            isValid = false;
        }

        if (isBoardingPet(pet)) {
            const boardingPet = pet as BoardingPet;
            const checkInDate = boardingPet.check_in_date;
            const checkOutDate = boardingPet.check_out_date;
            const checkInTime = boardingPet.check_in_time;
            const checkOutTime = boardingPet.check_out_time;

            if (!boardingPet.room_size) { errors.room_size = 'Room size is required.'; isValid = false; }
            if (!boardingPet.boarding_type) { errors.boarding_type = 'Boarding type is required.'; isValid = false; }
            if (!checkInDate) { errors.check_in_date = 'Check-in date is required.'; isValid = false; }
            if (!checkOutDate) { errors.check_out_date = 'Check-out date is required.'; isValid = false; }
            if (!checkInTime) { errors.check_in_time = 'Check-in time is required.'; isValid = false; }
            if (!checkOutTime) { errors.check_out_time = 'Check-out time is required.'; isValid = false; }

            if (checkInDate && checkOutDate && checkInTime && checkOutTime) {
                if (boardingPet.boarding_type === 'day') {
                    if (!isSameDay(checkInDate, checkOutDate)) {
                        errors.check_out_date = 'For Day Boarding, check-out date must be the same as check-in date.';
                        isValid = false;
                    }
                    const inTimeNum = timeToNumber(checkInTime);
                    const outTimeNum = timeToNumber(checkOutTime);
                    if (inTimeNum >= outTimeNum) { 
                        errors.check_out_time = 'Check-out time must be after check-in time for Day Boarding.';
                        isValid = false;
                    }
                    if (inTimeNum >= timeToNumber('22:00')) {
                        errors.check_in_time = 'Day boarding check-in cannot be at 10:00 PM (22:00) or later.';
                        isValid = false;
                    }

                } else if (boardingPet.boarding_type === 'overnight') {
                    if (isSameDay(checkInDate, checkOutDate)) {
                        errors.check_out_date = 'For Overnight Boarding, check-out date must be after check-in date.';
                        isValid = false;
                    } else if (checkOutDate < checkInDate) {
                        errors.check_out_date = 'Check-out date must be after check-in date.';
                        isValid = false;
                    }
                    if (checkInTime !== checkOutTime) {
                        errors.check_in_time = 'Check-in and check-out times must be the same for Overnight Boarding.';
                        errors.check_out_time = 'Check-in and check-out times must be the same for Overnight Boarding.'; 
                        isValid = false;
                    }
                }
            }


            ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                const meal = boardingPet.meal_instructions?.[mealType as keyof BoardingPet['meal_instructions']];
                if (meal && (meal.time?.trim() || meal.food?.trim() || meal.notes?.trim())) {
                    if (!meal.time?.trim()) { errors[`meal_instructions.${mealType}.time`] = `Time is required for ${mealType}.`; isValid = false; }
                    if (!meal.food?.trim()) { errors[`meal_instructions.${mealType}.food`] = `Food is required for ${mealType}.`; isValid = false; }
                }
            });

        } else if (isGroomingPet(pet)) {
            const groomingPet = pet as GroomingPet;
            const serviceDate = groomingPet.service_date;
            if (!groomingPet.service_variant) { errors.service_variant = 'Service variant is required.'; isValid = false; }
            if (!serviceDate) { errors.service_date = 'Service date is required.'; isValid = false; }
            if (!groomingPet.service_time) { errors.service_time = 'Service time is required.'; isValid = false; }
        }

        if (!silent) {
            setFormErrors(prev => ({ ...prev, [`pet-${pet.id}`]: JSON.stringify(errors) }));
        }

        return errors; 
    };

    const createNewPet = (): Pet => {
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const basePet = {
            id: uniqueId,
            name: '',
            age: '',
            pet_type: '',
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
                room_size: '',
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
        const customerErrors = validateCustomerForm(ownerDetails);
        if (Object.keys(customerErrors).length > 0) {
            setFormErrors(customerErrors);
            return;
        }
        setCompletedSteps(prev => [...prev, 'customer']);
        setCurrentStep('pet');
        if (pets.length === 0) {
            setPets([createNewPet()]);
            setCurrentPetIndex(0);
        } else {
            setCurrentPetIndex(0); 
        }
        setFormErrors(prev => { 
            const newErrors = { ...prev };
            delete newErrors.general;
            return newErrors;
        });
    };

    const handleAddPet = () => {
        if (currentPetIndex !== -1) {
            const currentPet = pets[currentPetIndex];
            const errors = validatePetForm(currentPet); 
            if (Object.keys(errors).length > 0) {
                setFormErrors(prev => ({ ...prev, [`pet-${currentPet.id}`]: JSON.stringify(errors), general: 'Please correct pet details before adding a new pet.' }));
                return;
            }
        }
        const newPet = createNewPet();
        setPets(prevPets => [...prevPets, newPet]);
        setCurrentPetIndex(pets.length); 
        setFormErrors(prev => { 
            const newErrors = { ...prev };
            delete newErrors.general;
            return newErrors;
        });
    };

    const handleEditPet = (index: number) => {
        setCurrentPetIndex(index);
        setFormErrors(prev => { 
            const newErrors = { ...prev };
            delete newErrors.general;
            return newErrors;
        });
    };

    const handleRemovePet = (indexToRemove: number) => {
        setPets(prevPets => {
            const newPets = prevPets.filter((_, index) => index !== indexToRemove);
            if (newPets.length === 0) {
                setCurrentPetIndex(-1);
                setFormErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.pets;
                    return newErrors;
                });
            } else if (indexToRemove === currentPetIndex) {
                setCurrentPetIndex(0); 
            } else if (indexToRemove < currentPetIndex) {
                setCurrentPetIndex(prevIndex => prevIndex - 1); 
            }
            return newPets;
        });
        setFormErrors(prev => {
            const newErrors = { ...prev };
            const removedPetId = pets[indexToRemove]?.id;
            if (removedPetId) {
                delete newErrors[`pet-${removedPetId}`];
            }
            if (Object.keys(newErrors).length === 0) { 
                delete newErrors.general;
            }
            return newErrors;
        });
    };

    const handleNextFromPet = () => {
        if (pets.length === 0) {
            setFormErrors({ ...formErrors, pets: 'Please add at least one pet.' });
            return;
        }

        let allPetsValid = true;
        let firstInvalidPetIndex: number | null = null;
        const newFormErrors: Record<string, string> = {};

        pets.forEach((pet, index) => {
            const errorsForPet = validatePetForm(pet, true); 
            if (Object.keys(errorsForPet).length > 0) {
                allPetsValid = false;
                newFormErrors[`pet-${pet.id}`] = JSON.stringify(errorsForPet);
                if (firstInvalidPetIndex === null) {
                    firstInvalidPetIndex = index;
                }
            } else {
                if (formErrors[`pet-${pet.id}`]) {
                    const tempErrors = JSON.parse(formErrors[`pet-${pet.id}`] || '{}');
                    if (Object.keys(tempErrors).length === 0) {
                        delete formErrors[`pet-${pet.id}`];
                    }
                }
            }
        });

        if (!allPetsValid) {
            setFormErrors(prev => ({ ...prev, ...newFormErrors, general: 'Please correct pet details before proceeding.' }));
            if (firstInvalidPetIndex !== null) {
                setCurrentPetIndex(firstInvalidPetIndex);
            }
            return;
        }

        setFormErrors(prev => { 
            const updatedErrors = { ...prev };
            Object.keys(updatedErrors).forEach(key => {
                if (key.startsWith('pet-') || key === 'pets' || key === 'general') {
                    delete updatedErrors[key];
                }
            });
            return updatedErrors;
        });
        setCompletedSteps(prev => [...prev, 'pet']);
        setCurrentStep('review');
    };

    const handleStepClick = (stepId: 'customer' | 'pet' | 'review') => {
        const stepOrder = ['customer', 'pet', 'review'];
        const clickedIndex = stepOrder.indexOf(stepId);
        const currentIndex = stepOrder.indexOf(currentStep);

        if (clickedIndex < currentIndex) {
            setCurrentStep(stepId);
            return;
        }

        if (clickedIndex > currentIndex) {
            if (currentStep === 'customer') {
                const customerErrors = validateCustomerForm(ownerDetails);
                if (Object.keys(customerErrors).length === 0) {
                    setCompletedSteps(prev => [...prev, 'customer']);
                    setCurrentStep('pet');
                } else {
                    setFormErrors(customerErrors);
                }
            } else if (currentStep === 'pet') {
                let allPetsValid = true;
                let firstInvalidPetIndex: number | null = null;
                const newFormErrors: Record<string, string> = {};

                pets.forEach((pet, index) => {
                    const errorsForPet = validatePetForm(pet, true); 
                    if (Object.keys(errorsForPet).length > 0) {
                        allPetsValid = false;
                        newFormErrors[`pet-${pet.id}`] = JSON.stringify(errorsForPet);
                        if (firstInvalidPetIndex === null) {
                            firstInvalidPetIndex = index;
                        }
                    }
                });

                if (allPetsValid) {
                    setFormErrors(prev => { 
                        const updatedErrors = { ...prev };
                        Object.keys(updatedErrors).forEach(key => {
                            if (key.startsWith('pet-') || key === 'pets' || key === 'general') {
                                delete updatedErrors[key];
                            }
                        });
                        return updatedErrors;
                    });
                    setCompletedSteps(prev => [...prev, 'pet']);
                    setCurrentStep('review');
                } else {
                    setFormErrors(prev => ({ ...prev, ...newFormErrors, general: 'Please correct pet details before proceeding.' }));
                    if (firstInvalidPetIndex !== null) {
                        setCurrentPetIndex(firstInvalidPetIndex);
                    }
                }
            }
        }
    };

    const handleConfirmBooking = async (): Promise<BookingResult> => {
        const customerErrors = validateCustomerForm(ownerDetails);
        if (Object.keys(customerErrors).length > 0) {
            setFormErrors(customerErrors);
            setCurrentStep('customer');
            return { success: false, error: 'Validation failed: Please correct customer details.' };
        }

        let allPetsValid = true;
        let firstInvalidPetIndex: number | null = null;
        const newFormErrors: Record<string, string> = {};

        pets.forEach((pet, index) => {
            const errorsForPet = validatePetForm(pet, true); 
            if (Object.keys(errorsForPet).length > 0) {
                allPetsValid = false;
                newFormErrors[`pet-${pet.id}`] = JSON.stringify(errorsForPet);
                if (firstInvalidPetIndex === null) {
                    firstInvalidPetIndex = index;
                }
            }
        });

        if (!allPetsValid) {
            setFormErrors(prev => ({ ...prev, ...newFormErrors, general: 'Please correct pet details before confirming.' }));
            if (firstInvalidPetIndex !== null) {
                setCurrentPetIndex(firstInvalidPetIndex);
            }
            setCurrentStep('pet'); 
            return { success: false, error: 'Validation failed: Please correct pet details.' };
        }

        if (!confirmedInfo) {
            setFormErrors({ ...formErrors, confirmation: 'Please confirm the information is correct' });
            return { success: false, error: 'Confirmation required' };
        }

        setFormErrors({});

        try {
            const totalAmounts: number[] = [];
            const discountsApplied: number[] = [];

            pets.forEach(pet => {
                if (isGroomingPet(pet)) {
                    const groomingPet = pet as GroomingPet;
                    const price = getGroomingPrice(
                        groomingPet.pet_type,
                        groomingPet.service_variant,
                        groomingPet.size
                    );
                    totalAmounts.push(price);
                    discountsApplied.push(0);
                } else if (isBoardingPet(pet)) {
                    const boardingPet = pet as BoardingPet;
                    const priceDetails = getBoardingPrice(boardingPet);
                    totalAmounts.push(priceDetails.total);
                    discountsApplied.push(priceDetails.discount);
                }
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

    const hasCustomerErrors = Object.keys(formErrors).some(key =>
        ['name', 'email', 'address', 'contact_number'].includes(key) && formErrors[key] !== ''
    );
    const areCustomerFieldsFilled = !!ownerDetails.name && !!ownerDetails.email && !!ownerDetails.contact_number && !!ownerDetails.address;

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
                        onAddPet={handleAddPet}
                        onEditPet={handleEditPet}
                        onRemovePet={handleRemovePet}
                        onBack={() => setCurrentStep('customer')}
                        onNext={handleNextFromPet}
                        isSubmitting={isSubmitting}
                        errors={formErrors}
                        onPetChange={handlePetChange}
                        onScheduleChange={handleScheduleChange}
                        unavailableDates={unavailableDates}
                        unavailableTimes={unavailableTimes}
                        dateHighlight={dateHighlight}
                        dateDefaultMessage={dateDefaultMessage}
                    >
                        {children}
                    </PetStep>
                )}

                {currentStep === 'review' && (
                    <ReviewStep
                        ownerDetails={ownerDetails}
                        pets={pets}
                        serviceType={serviceType}
                        confirmedInfo={confirmedInfo}
                        onConfirmChange={handleReviewConfirmChange}
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