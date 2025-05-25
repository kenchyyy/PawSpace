// components/PetDetails.tsx
import React from 'react';
import { Pet } from './types/bookingRecordType';

interface PetDetailsProps {
    pets: Pet[] | undefined;
}

const PetDetails: React.FC<PetDetailsProps> = ({ pets }) => {
    if (!pets || pets.length === 0) return null;

    const accent = 'text-white';
    const textPrimary = 'text-white';
    const textSecondary = 'text-yellow-300';

    return (
        <div className="flex flex-col">
            <h4 className={`${accent} text-lg font-semibold mb-2`}>Pet Details</h4>
            {pets.map((pet) => (
                <div key={pet.pet_uuid} className="mb-2 p-3 rounded-md bg-purple-800 last:mb-0 flex-grow">
                    <p className={`${textSecondary} text-sm`}>Name: <span className={textPrimary}>{pet.name}</span></p>
                    <p className={`${textSecondary} text-sm`}>Type: <span className={textPrimary}>{pet.pet_type}</span></p>
                    <p className={`${textSecondary} text-sm`}>Age: <span className={textPrimary}>{pet.age}</span></p>
                    <p className={`${textSecondary} text-sm`}>Breed: <span className={textPrimary}>{pet.breed}</span></p>
                    <p className={`${textSecondary} text-sm`}>Size: <span className={textPrimary}>{pet.size}</span></p>
                    <p className={`${textSecondary} text-sm`}>Vaccinated: <span className={textPrimary}>{pet.vaccinated ? 'Yes' : 'No'}</span></p>
                    <p className={`${textSecondary} text-sm`}>Vitamins/Medications: <span className={textPrimary}>{pet.vitamins_or_medications || 'None'}</span></p>
                    <p className={`${textSecondary} text-sm`}>Allergies: <span className={textPrimary}>{pet.allergies || 'None'}</span></p>
                </div>
            ))}
        </div>
    );
};

export default PetDetails;