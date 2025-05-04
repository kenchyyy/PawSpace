'use client';
import React from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PetList from './PetList';
import PetDetailsForm from './PetDetailsForm';
import { Pet } from './types';

interface PetStepProps {
  pets: Pet[];
  currentPetIndex: number;
  formErrors: Record<string, string>;
  onAddPet: () => void;
  onEditPet: (index: number) => void;
  onRemovePet: (index: number) => void;
  onPetChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onScheduleChange: (date: Date | null, time: string) => void;
  onBack: () => void;
  onNext: () => void;
  canAddNewPet: () => boolean;
}

const PetStep: React.FC<PetStepProps> = ({
  pets,
  currentPetIndex,
  formErrors,
  onAddPet,
  onEditPet,
  onRemovePet,
  onPetChange,
  onScheduleChange,
  onBack,
  onNext,
  canAddNewPet
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Pets</h2>
          <button
            onClick={onAddPet}
            disabled={!canAddNewPet()}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              !canAddNewPet() 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            <FiPlus size={18} />
            <span>Add Pet</span>
          </button>
        </div>
        
        <PetList 
          pets={pets}
          currentPetIndex={currentPetIndex}
          onEdit={onEditPet}
          onRemove={onRemovePet}
        />

        {currentPetIndex >= 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {pets[currentPetIndex].name ? `Editing ${pets[currentPetIndex].name}` : `Pet ${currentPetIndex + 1} Details`}
            </h3>
            <PetDetailsForm 
              pet={pets[currentPetIndex]} 
              onChange={onPetChange}
              onScheduleChange={onScheduleChange}
              errors={formErrors}
              petIndex={currentPetIndex}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center"
        >
          <FiChevronLeft className="mr-1" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={pets.length === 0 || !canAddNewPet()}
          className={`px-5 py-2.5 rounded-lg transition-colors flex items-center ${
            pets.length === 0 || !canAddNewPet()
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          Review Booking <FiChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PetStep;