'use client';
import React, { useEffect } from 'react';
import { createClientSideClient } from '@/lib/supabase/CreateClientSideClient';
import { OwnerDetails } from '../types';
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

interface CustomerStepProps {
  ownerDetails: OwnerDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  isSubmitting: boolean;
}

const CustomerStep: React.FC<CustomerStepProps> = ({
  ownerDetails,
  onChange,
  errors,
  onNext,
  isSubmitting,
}) => {
  const supabase = createClientSideClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        onChange({
          target: {
            name: 'name',
            value: user.user_metadata?.full_name || user.email?.split('@')[0] || ''
          }
        } as React.ChangeEvent<HTMLInputElement>);
        
        onChange({
          target: {
            name: 'email',
            value: user.email || ''
          }
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    fetchUser();
  }, [onChange, supabase]);
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
          <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
            <FaUserCircle className="h-5 w-5" />
          </span>
          Customer Information
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="name"
                id="name"
                value={ownerDetails.name}
                onChange={onChange}
                className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border rounded-md py-2.5 pl-10 pr-3 ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
                placeholder="Enter your full name"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FaUserCircle />
              </div>
            </div>
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="email"
                name="email"
                id="email"
                value={ownerDetails.email}
                onChange={onChange}
                className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border rounded-md py-2.5 pl-10 pr-3 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
                placeholder="your@email.com"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FaEnvelope />
              </div>
            </div>
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="contact_number"
                id="contact_number"
                value={ownerDetails.contact_number}
                onChange={onChange}
                className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border rounded-md py-2.5 pl-10 pr-3 ${
                  errors.contactNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
                placeholder="e.g., 09361435196"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FaPhone />
              </div>
            </div>
            {errors.contactNumber && <p className="text-red-600 text-sm mt-1">{errors.contactNumber}</p>}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="address"
                id="address"
                value={ownerDetails.address}
                onChange={onChange}
                className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border rounded-md py-2.5 pl-10 pr-3 ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
                placeholder="Your street address, city, state/province, zip code"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FaMapMarkerAlt />
              </div>
            </div>
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={isSubmitting || Object.keys(errors).length > 0 || !ownerDetails.name || !ownerDetails.email || !ownerDetails.contact_number || !ownerDetails.address}
          className={`px-6 py-3 rounded-xl text-white transition-colors duration-200 ${
            isSubmitting
              ? 'bg-purple-400 cursor-wait'
              : Object.keys(errors).length > 0 || !ownerDetails.name || !ownerDetails.email || !ownerDetails.contact_number || !ownerDetails.address
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CustomerStep;