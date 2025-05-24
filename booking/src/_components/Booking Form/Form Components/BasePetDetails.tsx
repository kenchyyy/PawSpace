import React from 'react';
import { Pet, ServiceType, ScheduleChangeHandler, BasePetDetailsProps } from '../types'; 

const BasePetDetails: React.FC<BasePetDetailsProps> = ({
    pet,
    onChange,
    errors,
    onScheduleChange, 
    serviceType, 
    dateHighlight, 
    dateDefaultMessage,
    unavailableDates, 
    unavailableTimes, 
    
}) => {
    const getError = (fieldName: string) => errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300';

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Allows only numbers
        const numericValue = value.replace(/[^0-9]/g, '');
        onChange({ target: { name, value: numericValue } } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pet Name */}
            <div className="space-y-2 md:col-span-2">
                <label htmlFor="pet_name" className="block text-sm font-medium text-gray-700">Pet Name *</label>
                <input
                    type="text"
                    id="pet_name"
                    name="name"
                    value={pet.name}
                    onChange={onChange}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getError('name')}`}
                    required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Pet Type */}
            <div className="space-y-2">
                <label htmlFor="pet_type" className="block text-sm font-medium text-gray-700">Pet Type *</label>
                <select
                    id="pet_type"
                    name="pet_type"
                    value={pet.pet_type}
                    onChange={onChange}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getError('pet_type')}`}
                    required
                >
                    <option value="">Select pet type</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                </select>
                {errors.pet_type && <p className="text-red-500 text-xs mt-1">{errors.pet_type}</p>}
            </div>

            {/* Breed */}
            <div className="space-y-2">
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700">Breed *</label>
                <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={pet.breed}
                    onChange={onChange}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getError('breed')}`}
                    required
                />
                {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed}</p>}
            </div>

            {/* Age */}
            <div className="space-y-2">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age *</label>
                <input
                    type="text" // Keep as text to allow onChange to handle numeric conversion
                    id="age"
                    name="age"
                    value={pet.age}
                    onChange={handleNumberInputChange}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getError('age')}`}
                    required
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            {/* Vaccination Status */}
            <div className="space-y-2">
                <label htmlFor="vaccinated" className="block text-sm font-medium text-gray-700">Vaccinated *</label>
                <select
                    id="vaccinated"
                    name="vaccinated"
                    value={pet.vaccinated}
                    onChange={onChange}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getError('vaccinated')}`}
                    required
                >
                    <option value="">Select vaccination status</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                {errors.vaccinated && <p className="text-red-500 text-xs mt-1">{errors.vaccinated}</p>}
            </div>

            {/* Size */}
            <div className="space-y-2">
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size (kg) *</label>
                <select
                    id="size"
                    name="size"
                    value={pet.size}
                    onChange={onChange}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getError('size')}`}
                    required
                >
                    <option value="">Select pet size</option>
                    <option value="teacup">teacup [1-3kg]</option>
                    <option value="small">small [3.1-7kg]</option>
                    <option value="medium">medium [7.1-13kg]</option>
                    <option value="large">large [13.1-19kg]</option>
                    <option value="xlarge">xlarge [19kg-up]</option>
                </select>
                {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
            </div>

            {/* Vitamins/Medications */}
            <div className="space-y-2 md:col-span-2">
                <label htmlFor="vitamins_or_medications" className="block text-sm font-medium text-gray-700">Vitamins/Medications</label>
                <textarea
                    id="vitamins_or_medications"
                    name="vitamins_or_medications"
                    value={pet.vitamins_or_medications || ''}
                    onChange={onChange}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getError('vitamins_or_medications')}`}
                    rows={2}
                    placeholder="List any vitamins or medications your pet is taking"
                />
                {errors.vitamins_or_medications && (
                    <p className="text-red-500 text-xs mt-1">{errors.vitamins_or_medications}</p>
                )}
            </div>

            {/* Allergies */}
            <div className="space-y-2 md:col-span-2">
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
                <textarea
                    id="allergies"
                    name="allergies"
                    value={pet.allergies || ''}
                    onChange={onChange}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getError('allergies')}`}
                    rows={2}
                    placeholder="List any known allergies your pet has"
                />
                {errors.allergies && (
                    <p className="text-red-500 text-xs mt-1">{errors.allergies}</p>
                )}
            </div>

        </div>
    );
};

export default BasePetDetails;