'use client';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { OwnerDetails, Pet } from './types';

interface ReviewStepProps {
  ownerDetails: OwnerDetails;
  pets: Pet[];
  confirmedInfo: boolean;
  onConfirmChange: (confirmed: boolean) => void;
  onBack: () => void;
  onConfirm: () => void;
  calculatePetPrice: (pet: Pet) => number;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  ownerDetails,
  pets,
  confirmedInfo,
  onConfirmChange,
  onBack,
  onConfirm,
  calculatePetPrice
}) => {
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
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">
                    Pet {index + 1}: {pet.name || `Unnamed ${pet.type}`}
                  </h4>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {pet.serviceType === 'grooming' ? 'Grooming' : 'Overnight Stay'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="capitalize">{pet.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Breed</p>
                    <p>{pet.breed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="capitalize">{pet.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vaccinated</p>
                    <p>{pet.vaccinated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service Variant</p>
                    <p className="capitalize">{pet.serviceVariant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Appointment Date</p>
                    <p>{pet.serviceDate?.toLocaleDateString() || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Appointment Time</p>
                    <p>{pet.serviceTime || 'Not set'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Special Requests</p>
                    <p className="text-gray-800 whitespace-pre-line">
                      {pet.specialRequests || 'None'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Pricing Summary</h3>
          <div className="space-y-2">
            {pets.map((pet) => (
              <div key={pet.id} className="flex justify-between">
                <span className="text-gray-700">
                  {pet.name || `Unnamed ${pet.type}`} ({pet.serviceType} - {pet.serviceVariant})
                </span>
                <span className="font-medium">₱{calculatePetPrice(pet).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>₱{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start mt-6">
          <input
            type="checkbox"
            id="confirmInfo"
            checked={confirmedInfo}
            onChange={(e) => onConfirmChange(e.target.checked)}
            className="h-5 w-5 mt-0.5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="confirmInfo" className="ml-3 block text-sm text-gray-700">
            I confirm that all information provided is accurate and complete. I understand that 
            incorrect information may affect the services provided to my pet(s).
          </label>
        </div>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto"
        >
          <FiChevronLeft className="mr-1" /> Back to Pets
        </button>
        <button
          onClick={onConfirm}
          disabled={!confirmedInfo}
          className={`px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto ${
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

export default ReviewStep;