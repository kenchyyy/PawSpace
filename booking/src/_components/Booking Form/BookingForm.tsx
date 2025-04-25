'use client';
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import CustomerForm from './CustomerForm';
import PetStep from './PetStep';
import ReviewStep from './ReviewStep';
import Step from './Step';
import { Booking, OwnerDetails, Pet, pricing, DogSize } from './types';

interface BookingFormProps {
  onConfirmBooking: (bookings: Booking[]) => void;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onConfirmBooking, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'customer' | 'pet' | 'review'>('customer');
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetails>({
    name: '',
    address: '',
    contactNumber: ''
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPetIndex, setCurrentPetIndex] = useState<number>(-1);
  const [confirmedInfo, setConfirmedInfo] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const calculatePetPrice = (pet: Pet): number => {
    if (pet.type === 'cat') return pricing.grooming.cat.cat;
    if (pet.serviceType === 'grooming') {
      const variant = pet.serviceVariant as 'basic' | 'deluxe';
      const size = pet.size as DogSize;
      return pricing.grooming.dog[variant][size];
    }
    return pricing.overnight.dog[pet.serviceVariant as 'small' | 'medium' | 'large'];
  };

  const canAddNewPet = (): boolean => {
    if (currentPetIndex === -1) return true;
    const currentPet = pets[currentPetIndex];
    return !!(
      currentPet.name && 
      currentPet.age && 
      currentPet.type && 
      currentPet.breed && 
      currentPet.vaccinated && 
      currentPet.size && 
      currentPet.mealTime && 
      currentPet.serviceType && 
      currentPet.serviceVariant &&
      currentPet.serviceDate &&
      currentPet.serviceTime
    );
  };

  const handleOwnerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setOwnerDetails(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePetDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setPets(prev => {
      const updatedPets = [...prev];
      const updatedPet = { 
        ...updatedPets[currentPetIndex], 
        [name]: value,
      };

      if (name === 'type' || name === 'serviceType' || name === 'size') {
        updatedPet.serviceVariant = name === 'type' && value === 'cat' ? 'cat' : 
                                  updatedPet.serviceType === 'overnight' ? 
                                  (['teacup','small'].includes(value) ? 'small' : 
                                   value === 'medium' ? 'medium' : 'large') : 
                                  'basic';
      }

      updatedPet.completed = validateCurrentPet(updatedPet);
      updatedPets[currentPetIndex] = updatedPet;
      return updatedPets;
    });
  };

  const handlePetScheduleChange = (date: Date | null, time: string): void => {
    setPets(prev => {
      const updatedPets = [...prev];
      const updatedPet = { 
        ...updatedPets[currentPetIndex], 
        serviceDate: date,
        serviceTime: time,
      };
      updatedPet.completed = validateCurrentPet(updatedPet);
      updatedPets[currentPetIndex] = updatedPet;
      return updatedPets;
    });
  };

  const validateCurrentPet = (pet: Pet): boolean => {
    return !!(
      pet.name?.trim() && 
      pet.age?.trim() && 
      pet.type && 
      pet.breed?.trim() && 
      pet.vaccinated?.trim() && 
      pet.size && 
      pet.mealTime?.trim() &&
      pet.serviceType &&
      pet.serviceVariant &&
      pet.serviceDate &&
      pet.serviceTime
    );
  };

  const validateCustomerForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!ownerDetails.name.trim()) {
      errors.name = 'Name is required';
    } else if (ownerDetails.name.trim().length < 2) {
      errors.name = 'Name is too short';
    }
    
    if (!ownerDetails.contactNumber.trim()) {
      errors.contactNumber = 'Contact number is required';
    } else if (!/^\d+$/.test(ownerDetails.contactNumber)) {
      errors.contactNumber = 'Must contain only numbers';
    } else if (ownerDetails.contactNumber.length < 10) {
      errors.contactNumber = 'Phone number is too short';
    }
    
    if (!ownerDetails.address.trim()) {
      errors.address = 'Address is required';
    } else if (ownerDetails.address.length < 5) {
      errors.address = 'Address is too short';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPet = (): void => {
    if (currentPetIndex >= 0 && !canAddNewPet()) {
      alert('Please complete current pet details before adding another pet');
      return;
    }

    const newPet: Pet = {
      id: Date.now(),
      name: '',
      age: '',
      type: 'dog',
      breed: '',
      vaccinated: '',
      size: 'small',
      vitaminsOrMedications: '',
      allergies: '',
      mealTime: '',
      specialRequests: '',
      serviceType: 'grooming',
      serviceVariant: 'basic',
      serviceDate: null,
      serviceTime: '',
      completed: false
    };
    
    setPets([...pets, newPet]);
    setCurrentPetIndex(pets.length);
  };

  const handleEditPet = (index: number): void => {
    setCurrentPetIndex(index);
  };

  const handleRemovePet = (index: number): void => {
    if (!confirm(`Are you sure you want to remove ${pets[index].name || 'this pet'}?`)) return;
    
    const updatedPets = [...pets];
    updatedPets.splice(index, 1);
    setPets(updatedPets);
    
    if (currentPetIndex === index) {
      setCurrentPetIndex(updatedPets.length > 0 ? 0 : -1);
    } else if (currentPetIndex > index) {
      setCurrentPetIndex(currentPetIndex - 1);
    }
  };

  const handleNextFromCustomer = (): void => {
    setIsValidating(true);
    if (!validateCustomerForm()) {
      setIsValidating(false);
      return;
    }
    setIsValidating(false);
    
    if (pets.length === 0) {
      handleAddPet();
    }
    setCurrentStep('pet');
  };

  const handleNextFromPet = (): void => {
    if (pets.length === 0 || !canAddNewPet()) {
      alert('Please complete all required pet details before proceeding');
      return;
    }
    setCurrentStep('review');
  };

  const handleBackFromPet = (): void => {
    setCurrentStep('customer');
  };

  const handleConfirmBooking = (): void => {
    if (!confirmedInfo) {
      alert('Please confirm that all information is correct');
      return;
    }
    
    const newBookings = pets.map(pet => ({
      id: `${Date.now()}-${pet.id}`,
      dateBooked: new Date(),
      serviceDate: pet.serviceDate!,
      serviceTime: pet.serviceTime,
      status: 'pending' as const,
      ownerDetails,
      pet,
      specialRequests: pet.specialRequests,
      totalAmount: calculatePetPrice(pet)
    }));
    
    onConfirmBooking(newBookings);
    onClose();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close form"
      >
        <FiX size={24} />
      </button>

      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Add Booking
        </h1>
        <p className="text-gray-600">
          Schedule your pet's appointment in just a few steps
        </p>
      </div>

      <Step currentStep={currentStep} />

      {currentStep === 'customer' && (
        <CustomerForm
          ownerDetails={ownerDetails}
          onChange={handleOwnerDetailsChange}
          errors={formErrors}
          isValidating={isValidating}
          onNext={handleNextFromCustomer}
        />
      )}

      {currentStep === 'pet' && (
        <PetStep
          pets={pets}
          currentPetIndex={currentPetIndex}
          formErrors={formErrors}
          onAddPet={handleAddPet}
          onEditPet={handleEditPet}
          onRemovePet={handleRemovePet}
          onPetChange={handlePetDetailsChange}
          onScheduleChange={handlePetScheduleChange}
          onBack={handleBackFromPet}
          onNext={handleNextFromPet}
          canAddNewPet={canAddNewPet}
        />
      )}

      {currentStep === 'review' && (
        <ReviewStep
          ownerDetails={ownerDetails}
          pets={pets}
          confirmedInfo={confirmedInfo}
          onConfirmChange={setConfirmedInfo}
          onBack={() => setCurrentStep('pet')}
          onConfirm={handleConfirmBooking}
          calculatePetPrice={calculatePetPrice}
        />
      )}
    </div>
  );
};

export default BookingForm;