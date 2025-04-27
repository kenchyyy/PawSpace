'use client';
import React, { useEffect } from 'react';
import CalendarComponent from './Calendar';
import { Pet } from './types';

interface PetDetailsFormProps {
  pet: Pet;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onScheduleChange: (date: Date | null, time: string) => void;
  errors: Record<string, string>;
  petIndex: number;
}

const PetDetailsForm: React.FC<PetDetailsFormProps> = ({ 
  pet, 
  onChange, 
  onScheduleChange,
  errors, 
  petIndex
}) => {
  const getError = (fieldName: string) => errors[`pet_${petIndex}_${fieldName}`];

  useEffect(() => {
    if (pet.type === 'cat') {
      onChange({
        target: { name: 'serviceVariant', value: 'cat' }
      } as React.ChangeEvent<HTMLSelectElement>);
    } else if (pet.serviceType === 'overnight' && pet.size) {
      let variant = '';
      if (['teacup', 'small'].includes(pet.size)) variant = 'small';
      else if (pet.size === 'medium') variant = 'medium';
      else if (['large', 'xlarge'].includes(pet.size)) variant = 'large';
      
      if (variant && variant !== pet.serviceVariant) {
        onChange({
          target: { name: 'serviceVariant', value: variant }
        } as React.ChangeEvent<HTMLSelectElement>);
      }
    }
  }, [pet.type, pet.serviceType, pet.size]);

  const getServiceVariants = (): string[] => {
    if (pet.type === 'cat') return ['cat'];
    if (pet.serviceType === 'grooming') return ['basic', 'deluxe'];
    return ['small', 'medium', 'large']; 
  };

  const serviceVariants = getServiceVariants();
  const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Pet Name *</label>
        <input
          type="text"
          name="name"
          value={pet.name}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-200 ${
            getError('name') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Age (years) *</label>
        <input
          type="text"
          name="age"
          value={pet.age}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-200 ${
            getError('age') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Pet Type *</label>
        <select
          name="type"
          value={pet.type}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            getError('type') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select pet type</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Breed *</label>
        <input
          type="text"
          name="breed"
          value={pet.breed}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-200 ${
            getError('breed') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Size *</label>
        <select
          name="size"
          value={pet.size}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            getError('size') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select size</option>
          {pet.type === 'cat' ? (
            <>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </>
          ) : (
            <>
              <option value="teacup">Teacup</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xlarge">X-Large</option>
            </>
          )}
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Vaccinated *</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="vaccinated"
              value="Yes"
              checked={pet.vaccinated === 'Yes'}
              onChange={onChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              required
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="vaccinated"
              value="No"
              checked={pet.vaccinated === 'No'}
              onChange={onChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Service Type *</label>
        <select
          name="serviceType"
          value={pet.serviceType}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            getError('serviceType') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select service type</option>
          <option value="grooming">Grooming</option>
          <option value="overnight">Overnight Stay</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Service Variant *</label>
        <select
          name="serviceVariant"
          value={pet.serviceVariant}
          onChange={onChange}
          disabled={!!(pet.type === 'cat' || (pet.serviceType === 'overnight' && pet.size))}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            getError('serviceVariant') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select variant</option>
          {serviceVariants.map(variant => (
            <option key={variant} value={variant}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </option>
          ))}
        </select>
        {pet.type === 'cat' && (
          <p className="text-sm text-gray-500 mt-1">Service variant automatically set to 'cat'</p>
        )}
        {pet.serviceType === 'overnight' && pet.type === 'dog' && (
          <p className="text-sm text-gray-500 mt-1">
            Variant auto-selected: {['teacup','small'].includes(pet.size) ? 'small' : 
                                  pet.size === 'medium' ? 'medium' : 'large'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Vitamins/Medications</label>
        <input
          type="text"
          name="vitaminsOrMedications"
          value={pet.vitaminsOrMedications}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Allergies</label>
        <input
          type="text"
          name="allergies"
          value={pet.allergies}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Meal Schedule *</label>
        <input
          type="text"
          name="mealTime"
          value={pet.mealTime}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            getError('mealTime') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Special Requests</label>
        <textarea
          name="specialRequests"
          value={pet.specialRequests}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows={3}
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <label className="block text-sm font-medium text-gray-700">Appointment Schedule *</label>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <CalendarComponent 
            date={pet.serviceDate || new Date()}
            setDate={(date) => onScheduleChange(date, pet.serviceTime)}
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => onScheduleChange(pet.serviceDate, time)}
                  className={`p-2 rounded transition-colors ${
                    pet.serviceTime === time 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsForm;