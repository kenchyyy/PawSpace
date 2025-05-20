import React from 'react';
import { Pet } from '../../Booking Form/types';

interface PetDetailsProps {
  pet: Pet;
}

const PetDetails: React.FC<PetDetailsProps> = ({ pet }) => {
  return (
    <div className="md:col-span-2 border-t pt-4 mt-2">
      <h4 className="font-medium text-gray-900 mb-2">Pet Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-gray-900">{pet.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Type</p>
          <p className="text-gray-900">{pet.pet_type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Breed</p>
          <p className="text-gray-900">{pet.breed}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Age</p>
          <p className="text-gray-900">{pet.age}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Size</p>
          <p className="text-gray-900">{pet.size}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Vaccinated</p>
          <p className="text-gray-900">{pet.vaccinated}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500">Special Requests</p>
          <p className="text-gray-900">{pet.special_requests || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;