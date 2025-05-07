'use client';
import React from 'react';
import { FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Pet } from '@/_components/Booking Form/types';

interface PetListProps {
  pets: Pet[];
  currentPetIndex: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

const PetList: React.FC<PetListProps> = ({ pets, currentPetIndex, onEdit, onRemove }) => {
  if (pets.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center border border-gray-200">
        <p className="text-gray-500">No pets added yet</p>
      </div>
    );
  }

  return (
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
                onClick={() => onEdit(index)}
                className="text-slate-950 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
                title="Edit"
              >
                <FiEdit2 size={18} />
              </button>
              <button 
                onClick={() => onRemove(index)}
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
  );
};

export default PetList;