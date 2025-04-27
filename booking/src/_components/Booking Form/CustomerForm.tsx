'use client';
import React from 'react';
import { OwnerDetails } from './types';

interface CustomerFormProps {
  ownerDetails: OwnerDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  isValidating?: boolean;
  onNext: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  ownerDetails, 
  onChange, 
  errors,
  isValidating = false, 
  onNext 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              name="name"
              value={ownerDetails.name}
              onChange={onChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isValidating}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
            <input
              type="text"
              name="contactNumber"
              value={ownerDetails.contactNumber}
              onChange={onChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.contactNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isValidating}
            />
            {errors.contactNumber && <p className="text-red-600 text-sm mt-1">{errors.contactNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <input
              type="text"
              name="address"
              value={ownerDetails.address}
              onChange={onChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isValidating}
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={isValidating}
          className={`px-5 py-2.5 rounded-lg transition-colors flex items-center ${
            isValidating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerForm;