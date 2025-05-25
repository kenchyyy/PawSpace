import React from 'react';
import { Pet } from '../types';
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

interface PetListProps {
    pets: Pet[];
    currentPetIndex: number;
    onEdit: (index: number) => void;
    onRemove: (index: number) => void;
}

const PetList: React.FC<PetListProps> = ({ pets, currentPetIndex, onEdit, onRemove }) => {
    if (pets.length === 0) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center border border-gray-200 shadow-sm">
                <FontAwesomeIcon icon={faPaw} className="mx-auto text-gray-400 h-8 w-8 mb-2" />
                <p className="text-gray-500">No pets added yet</p>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <ul className="space-y-3">
                {pets.map((pet, index) => (
                    <li
                        key={pet.id}
                        className={`rounded-xl shadow-md border transition-colors duration-200 flex items-center p-4 ${
                            currentPetIndex === index
                                ? 'border-purple-800 bg-purple-100'
                                : 'bg-white border-gray-100'
                        }`}
                    >
                        <div className="flex-grow flex items-center min-w-0">
                            {pet.completed && (
                                <span className="text-purple-500 mr-3 flex-shrink-0">
                                    <FiCheck size={18} />
                                </span>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-baseline min-w-0">
                                <span className="font-semibold text-gray-900 truncate">
                                    {pet.name || `Pet ${index + 1}`}
                                </span>
                                {pet.pet_type && (
                                    <span className="text-gray-600 sm:ml-2 text-sm truncate">
                                        ({pet.pet_type})
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-3 flex-shrink-0 ml-4">
                            <button
                                onClick={() => onEdit(index)}
                                className="text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200"
                                title="Edit"
                            >
                                <FiEdit2 size={20} />
                            </button>
                            <button
                                onClick={() => onRemove(index)}
                                className="text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200"
                                title="Remove"
                            >
                                <FiTrash2 size={20} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PetList;