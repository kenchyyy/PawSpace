import React, { useState, useEffect } from 'react';
import { Pet, ServiceType, BoardingPet, GroomingPet } from '../types';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import PetList from '../Form Components/PetList';
import BasePetDetails from '../Form Components/BasePetDetails';

interface PetStepProps {
  pets: Pet[];
  currentPetIndex: number;
  serviceType: ServiceType;
  onAddPet: () => void;
  onEditPet: (index: number) => void;
  onRemovePet: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
  onPetChange: (updatedPet: Pet) => void;
  onScheduleChange: (type: 'checkIn' | 'checkOut' | 'service', date: Date | null, time: string) => void;
  children?: (
    pet: Pet,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
    onScheduleChange: (type: 'checkIn' | 'checkOut' | 'service', date: Date | null, time: string) => void,
    errors: Record<string, string>
  ) => React.ReactNode;
}

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
  children
}) => {
  const [isCurrentPetValid, setIsCurrentPetValid] = useState<boolean>(false);

  useEffect(() => {
    if (currentPetIndex >= 0 && pets[currentPetIndex]) {
      setIsCurrentPetValid(validatePetDetails(pets[currentPetIndex], serviceType));
    } else {
      setIsCurrentPetValid(false);
    }
  }, [currentPetIndex, pets, serviceType]);

  const validatePetDetails = (pet: Pet, service: ServiceType): boolean => {
    if (!pet.name?.trim()) return false;
    if (!pet.pet_type) return false;
    if (!pet.breed?.trim()) return false;
    if (!pet.age?.trim()) return false;
    if (pet.vaccinated === 'unknown') return false;
    if (!pet.size?.trim()) return false;

    if (service === 'boarding') {
      const boardingPet = pet as BoardingPet;
      if (!boardingPet.room_size) return false;
      if (!boardingPet.boarding_type) return false;
      if (!boardingPet.check_in_date) return false;
      if (!boardingPet.check_in_time?.trim()) return false;
      if (!boardingPet.check_out_date) return false;
      if (!boardingPet.check_out_time?.trim()) return false;
    } else if (service === 'grooming') {
      const groomingPet = pet as GroomingPet;
      if (!groomingPet.service_variant) return false;
      if (!groomingPet.service_date) return false;
      if (!groomingPet.service_time?.trim()) return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('meal_instructions.')) {
      const [_, mealType, field] = name.split('.');
      const updatedPet = {
        ...pets[currentPetIndex],
        meal_instructions: {
          ...(pets[currentPetIndex] as BoardingPet)?.meal_instructions,
          [mealType]: {
            ...(pets[currentPetIndex] as BoardingPet)?.meal_instructions?.[mealType as keyof BoardingPet['meal_instructions']],
            [field]: value
          }
        }
      };
      onPetChange(updatedPet);
    }
    else {
      const updatedPet = {
        ...pets[currentPetIndex],
        [name]: value,
      };
      onPetChange(updatedPet);
    }
  };

  const handleScheduleChangeInternal = (type: 'checkIn' | 'checkOut' | 'service', date: Date | null, time: string) => {
    onScheduleChange(type, date, time); 
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-gray-200 flex-grow overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
              <FontAwesomeIcon icon={faPaw} className="h-5 w-5" />
            </span>
            Your Pets
          </h2>
          <button
            onClick={onAddPet}
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

        <div className="flex-grow overflow-y-auto">
          <PetList
            pets={pets}
            currentPetIndex={currentPetIndex}
            onEdit={onEditPet}
            onRemove={onRemovePet}
          />

          {currentPetIndex >= 0 && (
            <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                Pet Details
              </h3>
              {children ? (
                children(
                  pets[currentPetIndex],
                  handleChange,
                  handleScheduleChangeInternal,
                  errors
                )
              ) : (
                <BasePetDetails
                  pet={pets[currentPetIndex]}
                  onChange={handleChange}
                  errors={errors}
                  onScheduleChange={handleScheduleChangeInternal}
                  serviceType={serviceType}
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
          onClick={onNext}
          disabled={pets.length === 0 || (currentPetIndex >= 0 && !isCurrentPetValid) || isSubmitting}
          className={`px-6 py-3 rounded-xl flex items-center transition-all duration-200 ${
            pets.length === 0 || (currentPetIndex >= 0 && !isCurrentPetValid) || isSubmitting
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