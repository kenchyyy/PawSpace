'use client';
import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import PetDetailsForm from './PetDetailsForm';
import { Booking, OwnerDetails, Pet, pricing, ServiceType, PetType, PetSize, DogSize } from '../Booking Form/types';

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
    if (pet.type === 'cat') return pricing[pet.serviceType].cat.cat;
    if (pet.serviceType === 'grooming') {
      const variant = pet.serviceVariant as 'basic' | 'deluxe';
      const size = pet.size as DogSize;
      return pricing.grooming.dog[variant][size];
    } else {
      const size = pet.serviceVariant as 'small' | 'medium' | 'large';
      return pricing.overnight.dog[size];
    }
  };

  const canAddNewPet = () => {
    if (currentPetIndex === -1) return true;
    const currentPet = pets[currentPetIndex];
    return currentPet.name && currentPet.age && currentPet.type && 
           currentPet.breed && currentPet.vaccinated && currentPet.size && 
           currentPet.mealTime && currentPet.serviceType && currentPet.serviceVariant &&
           currentPet.serviceDate && currentPet.serviceTime;
  };

  const handleOwnerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerDetails(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePetDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPets(prev => {
      const updatedPets = [...prev];
      const updatedPet = { 
        ...updatedPets[currentPetIndex], 
        [name]: value,
      };

      if (name === 'type' || name === 'serviceType' || name === 'size') {
        updatedPet.serviceVariant = '';
        
        if (name === 'size' && updatedPet.serviceType === 'overnight') {
          if (value === 'teacup' || value === 'small') updatedPet.serviceVariant = 'small';
          else if (value === 'medium') updatedPet.serviceVariant = 'medium';
          else updatedPet.serviceVariant = 'large';
        }
        
        if (name === 'type' && value === 'cat') {
          updatedPet.serviceVariant = 'cat';
        }
      }

      updatedPet.completed = validateCurrentPet(updatedPet);
      updatedPets[currentPetIndex] = updatedPet;
      return updatedPets;
    });
  };

  const handlePetScheduleChange = (date: Date | null, time: string) => {
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

  const handleAddPet = () => {
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
      serviceVariant: '',
      serviceDate: null,
      serviceTime: '',
      completed: false
    };
    
    setPets([...pets, newPet]);
    setCurrentPetIndex(pets.length);
  };

  const handleEditPet = (index: number) => {
    setCurrentPetIndex(index);
  };

  const handleRemovePet = (index: number) => {
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

  const handleNextFromCustomer = () => {
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

  const handleNextFromPet = () => {
    if (pets.length === 0 || !canAddNewPet()) {
      alert('Please complete all required pet details before proceeding');
      return;
    }
    setCurrentStep('review');
  };

  const handleBackFromPet = () => {
    setCurrentStep('customer');
  };

  const handleConfirmBooking = () => {
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

  const renderCustomerStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              name="name"
              value={ownerDetails.name}
              onChange={handleOwnerDetailsChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
            <input
              type="text"
              name="contactNumber"
              value={ownerDetails.contactNumber}
              onChange={handleOwnerDetailsChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                formErrors.contactNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {formErrors.contactNumber && <p className="text-red-600 text-sm mt-1">{formErrors.contactNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <input
              type="text"
              name="address"
              value={ownerDetails.address}
              onChange={handleOwnerDetailsChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                formErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {formErrors.address && <p className="text-red-600 text-sm mt-1">{formErrors.address}</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button
          onClick={handleNextFromCustomer}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
        >
          Next <FiChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );

  const renderPetStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Pets</h2>
          <button
            onClick={handleAddPet}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              !canAddNewPet() 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
            disabled={!canAddNewPet()}
            title={!canAddNewPet() ? "Complete current pet details first" : "Add another pet"}
          >
            <FiPlus size={18} />
            <span>Add Pet</span>
          </button>
        </div>
        
        {pets.length > 0 ? (
          <div className="mb-6">
            <ul className="space-y-2">
              {pets.map((pet, index) => (
                <li 
                  key={pet.id} 
                  className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${
                    currentPetIndex === index 
                      ? 'border-purple-800 bg-purple-100' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    {pet.completed && (
                      <span className="text-purple-500 mr-2">
                        <FiCheck size={16} />
                      </span>
                    )}
                    <span className="font-medium text-gray-900">
                      {pet.name || `Pet ${index + 1}`}
                    </span>
                    {pet.type && (
                      <span className="text-gray-600 ml-2">({pet.type})</span>
                    )}
                    {pet.serviceDate && (
                      <span className="text-gray-600 ml-2">
                        - {pet.serviceDate.toLocaleDateString()} {pet.serviceTime}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditPet(index)}
                      className="text-slate-950 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleRemovePet(index)}
                      className="text-slate-950 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
                      title="Remove"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-8 text-center border border-gray-200">
            <p className="text-gray-500">No pets added yet</p>
          </div>
        )}

        {currentPetIndex >= 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {pets[currentPetIndex].name ? `Editing ${pets[currentPetIndex].name}` : `Pet ${currentPetIndex + 1} Details`}
            </h3>
            <PetDetailsForm 
              pet={pets[currentPetIndex]} 
              onChange={handlePetDetailsChange}
              onScheduleChange={handlePetScheduleChange}
              errors={formErrors}
              petIndex={currentPetIndex}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          onClick={handleBackFromPet}
          className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center"
        >
          <FiChevronLeft className="mr-1" /> Back
        </button>
        <button
          onClick={handleNextFromPet}
          className={`px-5 py-2.5 rounded-lg transition-colors flex items-center ${
            pets.length === 0 || !canAddNewPet()
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
          disabled={pets.length === 0 || !canAddNewPet()}
        >
          Review Booking <FiChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const totalAmount = pets.reduce((sum, pet) => sum + calculatePetPrice(pet), 0);

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Review Your Bookings</h2>
          <p className="text-gray-600 mb-6">Please verify all information before confirming</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Owner Information</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{ownerDetails.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="font-medium">{ownerDetails.contactNumber}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{ownerDetails.address}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Pets & Appointments</h3>
            <div className="space-y-4">
              {pets.map((pet, index) => (
                <div key={pet.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Pet {index + 1}: {pet.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p>{pet.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Breed</p>
                      <p>{pet.breed}</p>
                    </div>
          
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Pricing Summary</h3>
            <div className="space-y-2">
              {pets.map((pet, index) => (
                <div key={pet.id} className="flex justify-between">
                  <span>{pet.name} ({pet.serviceType} - {pet.serviceVariant})</span>
                  <span>₱{calculatePetPrice(pet)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 font-bold">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span>₱{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="confirmInfo"
              checked={confirmedInfo}
              onChange={(e) => setConfirmedInfo(e.target.checked)}
              className="h-5 w-5 mt-0.5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="confirmInfo" className="ml-3 block text-sm text-gray-700">
              I confirm that all information provided is accurate and complete.
            </label>
          </div>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
          <button
            onClick={() => setCurrentStep('pet')}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
          >
            <FiChevronLeft className="mr-1" /> Back to Pets
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={!confirmedInfo}
            className={`px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center ${
              confirmedInfo 
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Bookings <FiChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    );
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

      <div className="flex justify-between mb-8 px-4">
        {['customer', 'pet', 'review'].map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
              currentStep === step 
                ? 'bg-purple-600 text-white shadow-md' 
                : (['customer', 'pet', 'review'].indexOf(currentStep) >= index 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-gray-100 text-gray-400'
        )}`}>
              {index + 1}
            </div>
            <span className={`text-xs font-medium ${
              currentStep === step ? 'text-purple-600' : 'text-gray-500'
            }`}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </span>
          </div>
        ))}
      </div>

      {currentStep === 'customer' && renderCustomerStep()}
      {currentStep === 'pet' && renderPetStep()}
      {currentStep === 'review' && renderReviewStep()}
    </div>
  );
};

export default BookingForm;