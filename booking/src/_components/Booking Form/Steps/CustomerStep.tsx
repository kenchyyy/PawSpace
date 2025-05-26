'use client';
import React, { useState } from 'react';
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
    const [touched, setTouched] = useState<Record<string, boolean>>({
        name: false,
        email: false,
        contact_number: false,
        address: false,
    });

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prevTouched) => ({
            ...prevTouched,
            [name]: true,
        }));
    };

    const getErrorClass = (fieldName: string) => {
        return touched[fieldName] && errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300';
    };

    const hasCustomerErrors = Object.keys(errors).some(key =>
        ['name', 'email', 'address', 'contact_number'].includes(key) && errors[key] !== ''
    );

    const areAllFieldsFilled =
        !!ownerDetails.name.trim() &&
        !!ownerDetails.email.trim() &&
        !!ownerDetails.contact_number.trim() &&
        !!ownerDetails.address.trim();

    const isNextButtonDisabled = isSubmitting || hasCustomerErrors || !areAllFieldsFilled;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center">
                    <span className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                        <FaUserCircle className="h-5 w-5" />
                    </span>
                    Customer Information
                </h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                            <FaUserCircle className="inline-block mr-2 text-purple-600" />
                            Full Name <span className="text-gray-900"> *</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={ownerDetails.name}
                                onChange={onChange}
                                onBlur={handleBlur}
                                className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getErrorClass('name')}`}
                                disabled={isSubmitting}
                                placeholder="Enter your full name"
                            />
                        </div>
                        {touched.name && errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                            <FaEnvelope className="inline-block mr-2 text-purple-600" />
                            Email <span className="text-gray-900"> *</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={ownerDetails.email}
                                onChange={onChange}
                                onBlur={handleBlur}
                                className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getErrorClass('email')}`}
                                disabled={isSubmitting}
                                placeholder="your@email.com"
                            />
                        </div>
                        {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="contact_number" className="text-sm font-medium text-gray-700 flex items-center">
                            <FaPhone className="inline-block mr-2 text-purple-600" />
                            Contact Number <span className="text-gray-900"> *</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="contact_number"
                                id="contact_number"
                                value={ownerDetails.contact_number}
                                onChange={onChange}
                                onBlur={handleBlur}
                                className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getErrorClass('contact_number')}`}
                                disabled={isSubmitting}
                                placeholder="e.g., 09123456789"
                            />
                        </div>
                        {touched.contact_number && errors.contact_number && <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>}
                    </div>
                    <div>
                        <label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
                            <FaMapMarkerAlt className="inline-block mr-2 text-purple-600" />
                            Address <span className="text-gray-900"> *</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={ownerDetails.address}
                                onChange={onChange}
                                onBlur={handleBlur}
                                className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getErrorClass('address')}`}
                                disabled={isSubmitting}
                                placeholder="Your street address, city, state/province, zip code"
                            />
                        </div>
                        {touched.address && errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button
                    onClick={onNext}
                    disabled={isNextButtonDisabled}
                    className={`px-6 py-3 rounded-xl text-white transition-colors duration-200 ${
                        isSubmitting
                            ? 'bg-purple-400 cursor-wait'
                            : isNextButtonDisabled
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