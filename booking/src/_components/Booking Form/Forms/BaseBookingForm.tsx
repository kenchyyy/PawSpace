'use client';
import React, { useState, ChangeEvent, ReactNode, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
} from '../types';

function parseDate(dateStr: string | Date | null): Date | null {
    if (!dateStr) return null;

    if (dateStr instanceof Date) {
        const d = new Date(dateStr.getFullYear(), dateStr.getMonth(), dateStr.getDate());
        d.setHours(0, 0, 0, 0);
        return d;
    }

    const parts = dateStr.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatDateToYYYYMMDD(date: Date | null): string | null {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getNextDayDate(date: Date): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getPreviousDayDate(date: Date): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
}

function clampTimeToRange(time: string): string {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    if (h < 9) return '09:00';
    if (h > 19 || (h === 19 && m > 0)) return '19:00';
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

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
    const supabase = createClientComponentClient();
    const [currentStep, setCurrentStep] = useState<'customer' | 'pet' | 'review'>('customer');
    const [completedSteps, setCompletedSteps] = useState<('customer' | 'pet')[]>([]);
    const [ownerDetails, setOwnerDetails] = useState<OwnerDetails>({
        name: '',
        email: '',
        address: '',
        contact_number: '',
        auth_id: undefined
    });
    const [pets, setPets] = useState<Pet[]>([]);
    const [currentPetIndex, setCurrentPetIndex] = useState(-1);
    const [confirmedInfo, setConfirmedInfo] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        console.log('--- useEffect Mounted: Starting owner details fetch ---');

        const fetchOwnerDetails = async () => {
            console.log('fetchOwnerDetails: Calling supabase.auth.getSession()...');
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error('fetchOwnerDetails: Error fetching session:', sessionError);
                return;
            }

            console.log('fetchOwnerDetails: Session retrieved:', session);

            if (session?.user) {
                const user = session.user;
                const userId = user.id;
                console.log('fetchOwnerDetails: User found in session. User ID:', userId, 'User Email:', user.email, 'User Metadata:', user.user_metadata);

                console.log('fetchOwnerDetails: Querying "Owner" table for userId:', userId);
                const { data: ownerData, error: ownerError } = await supabase
                    .from('Owner')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (ownerError && ownerError.code !== 'PGRST116') {
                    console.error('fetchOwnerDetails: Error fetching owner data from database:', ownerError);
                } else if (ownerError && ownerError.code === 'PGRST116') {
                    console.log('fetchOwnerDetails: No Owner record found for this user in the database. Relying on user_metadata.');
                } else if (ownerData) {
                    console.log('fetchOwnerDetails: Owner data found in database:', ownerData);
                }

                setOwnerDetails(prevDetails => {
                    let updatedName = prevDetails.name;
                    let updatedEmail = prevDetails.email;
                    let updatedAddress = prevDetails.address;
                    let updatedContactNumber = prevDetails.contact_number;

                    console.log('fetchOwnerDetails: Current prevDetails before update:', prevDetails);

                    if (ownerData) {
                        updatedName = prevDetails.name || ownerData.name || '';
                        updatedEmail = prevDetails.email || ownerData.email || '';
                        updatedAddress = prevDetails.address || ownerData.address || '';
                        updatedContactNumber = prevDetails.contact_number || ownerData.contact_number || '';
                        console.log('fetchOwnerDetails: Using ownerData from DB for updates.');
                    } else {
                        updatedName = prevDetails.name || user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                        updatedEmail = prevDetails.email || user.email || '';
                        console.log('fetchOwnerDetails: Using user_metadata/email for updates as no ownerData found.');
                    }

                    const updatedDetails = {
                        ...prevDetails,
                        name: updatedName,
                        email: updatedEmail,
                        address: updatedAddress,
                        contact_number: updatedContactNumber,
                        auth_id: userId,
                    };
                    console.log('fetchOwnerDetails: setOwnerDetails called with updatedDetails:', updatedDetails);
                    return updatedDetails;
                });
            } else {
                console.log('fetchOwnerDetails: No active session or user found during initial fetch. session.user was NULL.');
            }
        };

        fetchOwnerDetails();

        console.log('--- Setting up onAuthStateChange listener ---');
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('onAuthStateChange: Event:', event, 'Session:', session);

                if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                    if (session?.user) {
                        const user = session.user;
                        console.log('onAuthStateChange: User found in session. User ID:', user.id, 'Email:', user.email, 'Metadata:', user.user_metadata);
                        setOwnerDetails(prevDetails => {
                            const newDetails = {
                                ...prevDetails,
                                name: prevDetails.name || user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
                                email: prevDetails.email || user.email || '',
                                auth_id: user.id,
                            };
                            console.log('onAuthStateChange: setOwnerDetails called with:', newDetails);
                            return newDetails;
                        });
                    } else {
                        // This is the log you were seeing often. It means session.user is null at this specific event.
                        console.log('onAuthStateChange: INITIAL_SESSION or SIGNED_IN but session.user is NULL. This is often transient. Keeping current form state.');
                    }
                } else if (event === 'SIGNED_OUT') {
                    console.log('onAuthStateChange: User SIGNED_OUT. Clearing ownerDetails.');
                    setOwnerDetails({ name: '', email: '', address: '', contact_number: '', auth_id: undefined });
                } else if (event === 'USER_UPDATED') {
                    console.log('onAuthStateChange: User profile updated. Consider re-fetching owner data if needed.');
                    // You might want to re-run fetchOwnerDetails() here if user_metadata is updated and you want to reflect it
                    // fetchOwnerDetails(); // Uncomment if you want to re-fetch on user updates
                } else if (event === 'PASSWORD_RECOVERY') {
                    console.log('onAuthStateChange: Password recovery initiated.');
                }
            }
        );

        return () => {
            console.log('--- useEffect Cleanup: Unsubscribing from auth listener ---');
            authListener.subscription.unsubscribe();
        };

    }, [supabase]);

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

    const handleScheduleChange: ScheduleChangeHandler = (type, value, time) => {
        setPets(prev => {
            const updatedPets = [...prev];

            if (currentPetIndex < 0 || currentPetIndex >= updatedPets.length) {
                console.warn('Invalid currentPetIndex in handleScheduleChange');
                return prev;
            }

            let currentPet = updatedPets[currentPetIndex];
            let newErrors: Record<string, string> = {};

            if (time !== undefined && time !== null && time !== '') time = clampTimeToRange(time);

            if (isBoardingPet(currentPet)) {
                let updatedPetInstance: BoardingPet = { ...currentPet };
                const petErrorsKey = `pet-${currentPet.id}`;

                try {
                    newErrors = JSON.parse(formErrors[petErrorsKey] || '{}');
                } catch (e) {
                    newErrors = {};
                }

                if (type === 'boardingType') {
                    const newBoardingType = value as unknown as BoardingType;
                    const oldBoardingType = updatedPetInstance.boarding_type;
                    updatedPetInstance.boarding_type = newBoardingType;

                    delete newErrors.check_out_date;
                    delete newErrors.check_in_date;

                    // --- FROM DAY TO OVERNIGHT ---
                    if (oldBoardingType === 'day' && newBoardingType === 'overnight') {
                        if (
                            updatedPetInstance.check_in_date &&
                            updatedPetInstance.check_out_date &&
                            updatedPetInstance.check_in_date.getTime() === updatedPetInstance.check_out_date.getTime()
                        ) {
                            updatedPetInstance.check_out_date = getNextDayDate(updatedPetInstance.check_in_date);
                            newErrors.check_out_date = 'Check-out date adjusted to be after check-in for Overnight Boarding.';

                            if (
                                updatedPetInstance.check_in_time &&
                                updatedPetInstance.check_out_time &&
                                updatedPetInstance.check_in_time !== updatedPetInstance.check_out_time
                            ) {
                                updatedPetInstance.check_out_time = updatedPetInstance.check_in_time;
                                newErrors.check_out_time = 'Check-in and Check-out time must be the same for Overnight Boarding.';
                            }
                        }
                    }

                    // --- FROM OVERNIGHT TO DAY ---
                    if (oldBoardingType === 'overnight' && newBoardingType === 'day') {
                        if (
                            updatedPetInstance.check_in_date &&
                            updatedPetInstance.check_out_date &&
                            updatedPetInstance.check_in_date.getTime() !== updatedPetInstance.check_out_date.getTime()
                        ) {
                            updatedPetInstance.check_out_date = updatedPetInstance.check_in_date;
                            newErrors.check_out_date = 'Check-out date auto-matched to Check-in date for Day Boarding.';
                        }
                    }

                    if (updatedPetInstance.check_in_date) {
                        updatedPetInstance.check_in_time = updatedPetInstance.check_in_time || '09:00';
                        updatedPetInstance.check_out_time = updatedPetInstance.check_out_time || '17:00';
                    } else {
                        updatedPetInstance.check_in_time = '';
                        updatedPetInstance.check_out_time = '';
                    }
                } else if (type === 'checkIn') {
                    const selectedDate = parseDate(value as Date | string | null);
                    updatedPetInstance.check_in_date = selectedDate;
                    updatedPetInstance.check_in_time = time !== undefined ? time : ''; 

                    delete newErrors.check_in_date;

                    if (updatedPetInstance.boarding_type === 'day') {
                        if (selectedDate) {
                            updatedPetInstance.check_out_date = selectedDate;
                            delete newErrors.check_out_date;
                            updatedPetInstance.check_in_time = updatedPetInstance.check_in_time || '09:00';
                            updatedPetInstance.check_out_time = updatedPetInstance.check_out_time || '17:00';
                        } else {
                            updatedPetInstance.check_out_date = null;
                            updatedPetInstance.check_in_time = ''; 
                            updatedPetInstance.check_out_time = ''; 
                        }
                    } else if (updatedPetInstance.boarding_type === 'overnight') {
                        if (selectedDate && updatedPetInstance.check_out_date) {
                            if (selectedDate.getTime() >= updatedPetInstance.check_out_date.getTime()) {
                                updatedPetInstance.check_out_date = getNextDayDate(selectedDate);
                                newErrors.check_out_date = 'Check-out date adjusted to be after check-in.';
                            } else {
                                delete newErrors.check_out_date;
                            }
                        } else if (selectedDate && !updatedPetInstance.check_out_date) {
                            updatedPetInstance.check_out_date = getNextDayDate(selectedDate);
                            delete newErrors.check_out_date; 
                        } else {
                            updatedPetInstance.check_out_date = null;
                            updatedPetInstance.check_in_time = ''; 
                            updatedPetInstance.check_out_time = ''; 
                        }
                    
                        updatedPetInstance.check_in_time = updatedPetInstance.check_in_time || '09:00';
                        updatedPetInstance.check_out_time = updatedPetInstance.check_out_time || '17:00';
                    }
                } else if (type === 'checkOut') {
                    const selectedDate = parseDate(value as Date | string | null);
                    updatedPetInstance.check_out_date = selectedDate;
                    updatedPetInstance.check_out_time = time !== undefined ? time : ''; 

                    delete newErrors.check_out_date;

                    if (!updatedPetInstance.check_in_date && selectedDate) {
                        updatedPetInstance.check_out_date = null; 
                        updatedPetInstance.check_out_time = '';
                        newErrors.check_out_date = 'Please select a Check-in Date first.';
                    } else if (updatedPetInstance.boarding_type === 'day') {
                        if (
                            updatedPetInstance.check_in_date &&
                            selectedDate &&
                            updatedPetInstance.check_in_date.getTime() !== selectedDate.getTime()
                        ) {
                            updatedPetInstance.check_out_date = updatedPetInstance.check_in_date;
                            newErrors.check_out_date = 'For Day Boarding, check-out date must be the same as check-in date.';
                        } else if (!selectedDate) {
                            updatedPetInstance.check_out_time = ''; 
                        }
                    } else if (updatedPetInstance.boarding_type === 'overnight') {
                        if (
                            updatedPetInstance.check_in_date &&
                            selectedDate &&
                            selectedDate.getTime() <= updatedPetInstance.check_in_date.getTime()
                        ) {
                            // Set error and do not allow invalid check-out
                            newErrors.check_out_date = 'Check-out date must be after check-in date for Overnight Boarding.';
                        } else if (!selectedDate) {
                            updatedPetInstance.check_out_time = ''; 
                        }
                    }
                } else if (type === 'checkInTime') {
                    updatedPetInstance.check_in_time = time !== undefined ? time : '';
                } else if (type === 'checkOutTime') {
                    updatedPetInstance.check_out_time = time !== undefined ? time : '';
                }

                updatedPets[currentPetIndex] = updatedPetInstance;
                // Only update formErrors if there are actual errors for this pet
                if (Object.keys(newErrors).length > 0) {
                    setFormErrors(prev => ({ ...prev, [petErrorsKey]: JSON.stringify(newErrors) }));
                } else {
                    setFormErrors(prev => {
                        const updated = { ...prev };
                        delete updated[petErrorsKey]; 
                        return updated;
                    });
                }
                return updatedPets;

            } else if (isGroomingPet(currentPet)) {
                const selectedDate = parseDate(value as Date | string | null);
                const updatedPetInstance: GroomingPet = {
                    ...currentPet,
                    service_date: type === 'service' ? selectedDate : currentPet.service_date,
                    service_time: type === 'service' ? (time !== undefined ? time : '') : currentPet.service_time, // Use empty string if time is undefined
                };
                const petErrorsKey = `pet-${currentPet.id}`;
                try {
                    newErrors = JSON.parse(formErrors[petErrorsKey] || '{}');
                } catch (e) {
                    newErrors = {};
                }
                if (type === 'service') {
                    if (selectedDate) delete newErrors.service_date;
                    if (time !== undefined && time !== '') delete newErrors.service_time;
                }
                updatedPets[currentPetIndex] = updatedPetInstance;
                if (Object.keys(newErrors).length > 0) {
                    setFormErrors(prev => ({ ...prev, [petErrorsKey]: JSON.stringify(newErrors) }));
                } else {
                    setFormErrors(prev => {
                        const updated = { ...prev };
                        delete updated[petErrorsKey];
                        return updated;
                    });
                }
                return updatedPets;
            }
            return prev;
        });
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

    const validateCustomerForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!ownerDetails.name.trim()) errors.name = 'Name is required';
        if (!ownerDetails.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerDetails.email)) errors.email = 'Valid email is required';
        if (!ownerDetails.contact_number.trim()) errors.contact_number = 'Contact number is required';
        if (!ownerDetails.address.trim()) errors.address = 'Address is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePetForm = (pet: Pet): boolean => {
        const errors: Record<string, string> = {};
        let isValid = true;

        if (!pet.name.trim()) { errors.name = 'Pet name is required'; isValid = false; }
        if (!pet.age.trim()) { errors.age = 'Pet age is required'; isValid = false; }
        if (!pet.pet_type) { errors.pet_type = 'Pet type is required.'; isValid = false; }
        if (!pet.breed?.trim()) { errors.breed = 'Breed is required.'; isValid = false; }
        if (pet.vaccinated === 'unknown' || pet.vaccinated === '') { errors.vaccinated = 'Vaccination status is required.'; isValid = false; }
        if (!pet.size) { errors.size = 'Size is required.'; isValid = false; }

        if (isBoardingPet(pet)) {
            const checkInDate = pet.check_in_date;
            const checkOutDate = pet.check_out_date;

            if (!pet.room_size) { errors.room_size = 'Room size is required.'; isValid = false; }
            if (!pet.boarding_type) { errors.boarding_type = 'Boarding type is required.'; isValid = false; }
            if (!checkInDate) { errors.check_in_date = 'Check-in date is required.'; isValid = false; }
            if (!checkOutDate) { errors.check_out_date = 'Check-out date is required.'; isValid = false; }

            if (checkInDate && checkOutDate) {
                if (pet.boarding_type === 'day') {
                    if (checkInDate.getTime() !== checkOutDate.getTime()) {
                        errors.check_out_date = 'For Day Boarding, check-out date must be the same as check-in date.';
                        isValid = false;
                    }
                } else if (pet.boarding_type === 'overnight') {
                    if (checkInDate.getTime() >= checkOutDate.getTime()) {
                        errors.check_out_date = 'For Overnight Boarding, check-out date must be after check-in date.';
                        isValid = false;
                    }
                }
            }

            if (!pet.check_in_time) { errors.check_in_time = 'Check-in time is required.'; isValid = false; }
            if (!pet.check_out_time) { errors.check_out_time = 'Check-out time is required.'; isValid = false; }

            // Validate meal instructions only if they have data
            if (pet.meal_instructions) {
                ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                    const meal = pet.meal_instructions?.[mealType as keyof BoardingPet['meal_instructions']];
                    if (meal && (meal.time?.trim() || meal.food?.trim() || meal.notes?.trim())) {
                        if (!meal.time?.trim()) { errors[`meal_instructions.${mealType}.time`] = `${mealType} time is required.`; isValid = false; }
                        if (!meal.food?.trim()) { errors[`meal_instructions.${mealType}.food`] = `${mealType} food is required.`; isValid = false; }
                    }
                });
            }

        } else if (isGroomingPet(pet)) {
            const serviceDate = pet.service_date;
            if (!pet.service_variant) { errors.service_variant = 'Service variant is required.'; isValid = false; }
            if (!serviceDate) { errors.service_date = 'Service date is required.'; isValid = false; }
            if (!pet.service_time) { errors.service_time = 'Service time is required.'; isValid = false; }
        }

        // Update errors for the specific pet
        setFormErrors(prev => ({ ...prev, [`pet-${pet.id}`]: JSON.stringify(errors) }));
        return isValid;
    };

    const createNewPet = (): Pet => {
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const basePet = {
            id: uniqueId,
            name: '',
            age: '',
            pet_type: '', // Empty string for "Select pet type"
            breed: '',
            vaccinated: 'unknown' as const,
            size: '', // Empty string for "Select size"
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
                room_size: '', // Empty string for "Select room size"
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

    const handleAddPet = () => {
        // Validate the current pet before adding a new one
        if (currentPetIndex !== -1) {
            const currentPet = pets[currentPetIndex];
            if (!validatePetForm(currentPet)) {
                return;
            }
        }
        const newPet = createNewPet();
        setPets(prevPets => [...prevPets, newPet]);
        setCurrentPetIndex(pets.length);
    };

    const handleEditPet = (index: number) => {
        setCurrentPetIndex(index);
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
            return newErrors;
        });
    };

    const handleNextFromPet = () => {
        if (pets.length === 0) {
            setFormErrors({ ...formErrors, pets: 'Please add at least one pet' });
            return;
        }

        let allPetsValid = true;
        let firstInvalidPetIndex: number | null = null;

        pets.forEach((pet, index) => {
            if (!validatePetForm(pet)) {
                allPetsValid = false;
                if (firstInvalidPetIndex === null) {
                    firstInvalidPetIndex = index;
                }
            }
        });

        if (!allPetsValid) {
            if (firstInvalidPetIndex !== null) {
                setCurrentPetIndex(firstInvalidPetIndex);
            }
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
                let allPetsValid = true;
                let firstInvalidPetIndex: number | null = null;

                pets.forEach((pet, index) => {
                    if (!validatePetForm(pet)) {
                        allPetsValid = false;
                        if (firstInvalidPetIndex === null) {
                            firstInvalidPetIndex = index;
                        }
                    }
                });

                if (allPetsValid) {
                    setCompletedSteps(prev => [...prev, 'pet']);
                    setCurrentStep('review');
                } else {
                    if (firstInvalidPetIndex !== null) {
                        setCurrentPetIndex(firstInvalidPetIndex);
                    }
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
                        petTotalAmount = basePrice;
                    } else {
                        basePrice = (pricing.boarding.overnight[roomSizeKey] || 0) * nights;
                        if (nights >= 15) discount = 20;
                        else if (nights >= 7) discount = 10;
                        petTotalAmount = basePrice * (1 - (discount / 100));
                    }
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

    const getPetErrors = (petId: string) => {
        try {
            return JSON.parse(formErrors[`pet-${petId}`] || '{}');
        } catch (e) {
            console.error("Error parsing pet errors:", e);
            return {};
        }
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