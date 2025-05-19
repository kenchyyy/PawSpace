'use client';
import React, { useState, ChangeEvent, ReactNode } from 'react';
import { FiX } from 'react-icons/fi';
import CustomerStep from '../Steps/CustomerStep';
import PetStep from '../Steps/PetStep';
import ReviewStep from '../Steps/ReviewStep';
import StepIndicator from '../Form Components/StepIndicator';
import {
  Booking,
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

  const handlePetChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('meal_instructions.')) {
      if (!isBoardingPet(pets[currentPetIndex])) return;

      const [_, mealType, field] = name.split('.');
      setPets(prev => {
        const updatedPets = [...prev];
        const currentPet = updatedPets[currentPetIndex] as BoardingPet;
        const updatedPet: BoardingPet = {
          ...currentPet,
          meal_instructions: {
            ...currentPet.meal_instructions,
            [mealType]: {
              ...(currentPet.meal_instructions[mealType as keyof BoardingPet['meal_instructions']] || { time: '', food: '', notes: '' }),
              [field]: value
            }
          }
        };
        updatedPets[currentPetIndex] = updatedPet;
        return updatedPets;
      });
      return;
    }

    setPets(prev => {
      const updatedPets = [...prev];
      const updatedPet = {
        ...updatedPets[currentPetIndex],
        [name]: value,
      };
      updatedPets[currentPetIndex] = updatedPet as Pet;
      return updatedPets;
    });
  };

  const handleScheduleChange: ScheduleChangeHandler = (type, date, time) => {
    setPets(prev => {
      const updatedPets = [...prev];
      const pet = updatedPets[currentPetIndex];

      if (isBoardingPet(pet)) {
        const boardingPet = pet as BoardingPet;
        if (type === 'checkIn') {
          boardingPet.check_in_date = date;
          boardingPet.check_in_time = time;
        } else if (type === 'checkOut') {
          boardingPet.check_out_date = date;
          boardingPet.check_out_time = time;
        }
      } else if (isGroomingPet(pet)) {
        const groomingPet = pet as GroomingPet;
        if (type === 'service') {
          groomingPet.service_date = date;
          groomingPet.service_time = time;
        }
      }

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

  const createNewPet = (): Pet => {
    const basePet = {
      id: Date.now().toString(),
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
    setPets([createNewPet()]);
    setCurrentPetIndex(0);
  };

  const handleNextFromPet = () => {
    if (pets.length === 0) {
      setFormErrors({ ...formErrors, pets: 'Please add at least one pet' });
      return;
    }
    setCurrentStep('review');
  };

  const handleConfirmBooking = async (): Promise<BookingResult> => {
    if (!confirmedInfo) {
      setFormErrors({ ...formErrors, confirmation: 'Please confirm the information is correct' });
      return { success: false, error: 'Confirmation required' };
    }

    try {
      const bookings = pets.map(pet => {
        const baseBooking: Booking = {
          id: `${Date.now()}-${pet.id}`,
          booking_uuid: `${Date.now()}-${pet.id}`,
          date_booked: new Date(),
          status: 'pending',
          owner_details: ownerDetails,
          pet: pet,
          special_requests: pet.special_requests || '',
          total_amount: 0,
          discount_applied: 0,
          service_date_start: null,
          service_date_end: null
        };

        if (isGroomingPet(pet)) {
          baseBooking.total_amount = getGroomingPrice(
            pet.pet_type,
            pet.service_variant,
            pet.size as PetSize
          );
          baseBooking.service_date_start = pet.service_date;
          baseBooking.service_date_end = pet.service_date;
        } else if (isBoardingPet(pet)) {
          const checkInDate = pet.check_in_date;
          const checkOutDate = pet.check_out_date;
          const nights = calculateNights(checkInDate, checkOutDate);

          let basePrice = 0;
          let discount = 0;
          let roomSizeKey = pet.room_size;

          if (pet.boarding_type === 'day') {
            basePrice = pricing.boarding.day[roomSizeKey] || 0;
          } else {
            basePrice = (pricing.boarding.overnight[roomSizeKey] || 0) * nights;
            if (nights >= 15) discount = 0.2;
            else if (nights >= 7) discount = 0.1;
          }

          baseBooking.total_amount = basePrice * (1 - discount);
          baseBooking.discount_applied = discount;
          baseBooking.service_date_start = checkInDate;
          baseBooking.service_date_end = checkOutDate;
        }

        return baseBooking;
      });

      return await onConfirmBooking(bookings);
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
      return pricing.grooming.cat.standard;
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
              setPets([...pets, newPet]);
              setCurrentPetIndex(pets.length);
            }}
            onEditPet={(index: number) => setCurrentPetIndex(index)}
            onRemovePet={(index: number) => {
              const updatedPets = [...pets];
              updatedPets.splice(index, 1);
              setPets(updatedPets);
              setCurrentPetIndex(Math.max(-1, index - 1));
            }}
            onBack={() => setCurrentStep('customer')}
            onNext={handleNextFromPet}
            isSubmitting={isSubmitting}
            errors={formErrors}
            onPetChange={(updatedPet) => {
              const updatedPets = [...pets];
              updatedPets[currentPetIndex] = updatedPet;
              setPets(updatedPets);
            }}
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
                    setPets([...pets, newPet]);
                    setCurrentPetIndex(pets.length);
                  },
                  onRemovePet: (index: number) => {
                    const updatedPets = [...pets];
                    updatedPets.splice(index, 1);
                    setPets(updatedPets);
                    setCurrentPetIndex(Math.max(-1, index - 1));
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

