'use client';
import React from 'react';

interface OwnerDetails {
    name: string;
    address: string;
    contactNumber: string;
}

interface CustomerFormProps {
    ownerDetails: OwnerDetails;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: Record<string, string>;
    isValidating?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
    ownerDetails, 
    onChange, 
    errors,
    isValidating = false 
}) => {
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Owner Information</h2>
            
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={ownerDetails.name}
                        onChange={onChange}
                        placeholder="Vhea Asesor"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black ${
                            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        } ${isValidating ? 'opacity-75 cursor-not-allowed' : ''}`}
                        required
                        disabled={isValidating}
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input
                        type="tel"
                        name="contactNumber"
                        value={ownerDetails.contactNumber}
                        onChange={onChange}
                        placeholder="09361135195"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200 transition-all text-black ${
                            errors.contactNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        } ${isValidating ? 'opacity-75 cursor-not-allowed' : ''}`}
                        required
                        disabled={isValidating}
                    />
                    {errors.contactNumber && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.contactNumber}
                            {errors.contactNumber.includes('valid') && (
                                <span className="block text-gray-500 mt-1">
                                    Example: 09611234567 (Philippine format)
                                </span>
                            )}
                        </p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Address *</label>
                    <input
                        type="text"
                        name="address"
                        value={ownerDetails.address}
                        onChange={onChange}
                        placeholder="Block 5, Tabuc Suba, La Paz, Iloilo City"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200 transition-all text-black ${
                            errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        } ${isValidating ? 'opacity-75 cursor-not-allowed' : ''}`}
                        required
                        disabled={isValidating}
                    />
                    {errors.address && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.address}
                            {errors.address.includes('valid') && (
                                <span className="block text-gray-500 mt-1">
                                    Example: 123 Main Street, Barangay, City, Province
                                </span>
                            )}
                        </p>
                    )}
                </div>

                {isValidating && (
                    <div className="text-center py-2 text-purple-600">
                        <p>Validating information...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerForm;