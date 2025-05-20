'use client';
import React, { useState } from 'react';
import BaseBookingForm from './BaseBookingForm';
import {
    Booking,
    GroomingPet,
    PetSize,
    DogGroomingVariant,
    CatGroomingVariant,
    pricing,
    BookingResult,
    parseDate,
    PetType,
    OwnerDetails, // Import OwnerDetails
    Pet // Import Pet
} from '../types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import BasePetDetails from '../Form Components/BasePetDetails';
import DateDropdown from '../Schedule Picker/DatePicker';
import TimeDropdown from '../Schedule Picker/TimePicker';
import { createBooking } from '../bookingService';
import { isGroomingPet } from '../types';

interface GroomingBookingFormProps {
    // UPDATED: onConfirmBooking should match BaseBookingFormProps
    onConfirmBooking?: (
        ownerDetails: OwnerDetails,
        pets: Pet[],
        totalAmounts: number[],
        discountsApplied?: number[]
    ) => Promise<BookingResult>;
    onClose: () => void;
    unavailableDates?: Date[];
    unavailableTimes?: string[];
}

const GroomingBookingForm: React.FC<GroomingBookingFormProps> = ({
    onConfirmBooking,
    onClose,
    unavailableDates = [],
    unavailableTimes = [],
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // UPDATED: handleConfirmBooking now matches BaseBookingForm's expected arguments
    const handleConfirmBooking = async (
        ownerDetails: OwnerDetails,
        pets: Pet[],
        totalAmounts: number[],
        discountsApplied?: number[]
    ): Promise<BookingResult> => {
        setIsSubmitting(true);

        try {
            const bookingResults = await Promise.all(
                pets.map(async (pet, index) => {
                    if (!isGroomingPet(pet)) {
                        throw new Error('Invalid pet type for grooming');
                    }

                    // Validate required fields for grooming
                    if (!pet.service_date) {
                        throw new Error('Service date is required');
                    }
                    if (!pet.service_time) {
                        throw new Error('Service time is required');
                    }
                    if (!pet.service_variant) {
                        throw new Error('Service type is required');
                    }
                    // Pet size is derived from BasePetDetails, but explicitly check if it's set for dogs.
                    if (pet.pet_type === 'dog' && !pet.size) {
                        throw new Error('Pet size is required for dog grooming');
                    }


                    let basePrice = 0;
                    if (pet.pet_type === 'cat') {
                        basePrice = pricing.grooming.cat.cat;
                    } else {
                        // Ensure service_variant and size are valid keys before accessing pricing
                        const variant = pet.service_variant as DogGroomingVariant;
                        const size = pet.size as PetSize;
                        basePrice = pricing.grooming.dog[variant]?.[size] || 0;
                    }

                    // For grooming, total_amount and discount_applied might be directly derived or set to basePrice and 0.
                    // If BaseBookingForm calculates these and passes them, use them. Otherwise, use what's calculated here.
                    const currentTotalAmount = totalAmounts[index] !== undefined ? totalAmounts[index] : basePrice;
                    const currentDiscountApplied = discountsApplied && discountsApplied[index] !== undefined ? discountsApplied[index] : 0;


                    return await createBooking(
                        ownerDetails,
                        [pet], // createBooking likely expects an array of pets for each booking
                        [currentTotalAmount],
                        [currentDiscountApplied]
                    );
                })
            );

            console.log(bookingResults)

            const allSuccessful = bookingResults.every(result => result.success);

            if (allSuccessful && bookingResults.length > 0) {
                toast.success('Grooming appointment booked successfully!');
                router.push('/customer/history');
                return { success: true, bookingId: bookingResults[0]?.bookingId };
            } else {
                const firstError = bookingResults.find(result => !result.success)?.error || 'Failed to create booking';
                toast.error(`Appointment failed: ${firstError}`);
                return { success: false, error: firstError };
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to book grooming appointment';
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    };

    const getServiceVariantOptions = (petType: PetType) => {
        if (petType === 'cat') {
            return [
                { value: 'standard', label: 'Standard Grooming (P800)' }
            ];
        }
        return [
            { value: 'basic', label: 'Basic Grooming' },
            { value: 'deluxe', label: 'Deluxe Grooming' }
        ];
    };

    const getSizeDisplay = (size: string, petType: string): string => {
        if (petType === 'cat') return 'Cat';
        const sizeMap: Record<string, string> = {
            teacup: 'Teacup (under 5kg)',
            small: 'Small (up to 15kg)',
            medium: 'Medium (15-30kg)',
            large: 'Large (30kg+)',
            xlarge: 'Extra Large (45kg+)'
        };
        return sizeMap[size] || size;
    };

    // Function to get the price dynamically for display purposes
    const getPriceDisplay = (pet: GroomingPet): string => {
        if (pet.pet_type === 'cat') {
            return `P${pricing.grooming.cat.cat}`;
        } else if (pet.pet_type === 'dog' && pet.service_variant && pet.size) {
            const variant = pet.service_variant as DogGroomingVariant;
            const size = pet.size as PetSize;
            const price = pricing.grooming.dog[variant]?.[size];
            return price ? `P${price}` : 'Select options for price';
        }
        return 'Select options for price';
    };

    return (
        <BaseBookingForm
            onConfirmBooking={onConfirmBooking || handleConfirmBooking} // This now correctly matches the types
            onClose={onClose}
            serviceType="grooming"
            isSubmitting={isSubmitting}
            unavailableDates={unavailableDates}
            unavailableTimes={unavailableTimes}
        >
            {({ pet, onChange, onScheduleChange, errors }) => {
                if (!isGroomingPet(pet)) return null;

                const getErrorClass = (fieldName: string) =>
                    errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300';

                return (
                    <div className="space-y-6">
                        <BasePetDetails
                            pet={pet}
                            onChange={onChange}
                            errors={errors}
                            onScheduleChange={onScheduleChange}
                            serviceType="grooming"
                        />

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="font-medium text-gray-800 text-lg">Service Details</h3>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Service Type *</label>
                                    <select
                                        name="service_variant"
                                        value={pet.service_variant}
                                        onChange={onChange}
                                        className={`block w-full px-3 py-2 border ${getErrorClass('service_variant')} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                                        required
                                    >
                                        <option value="">Select service type</option>
                                        {getServiceVariantOptions(pet.pet_type).map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.service_variant && (
                                        <p className="mt-1 text-sm text-red-600">{errors.service_variant}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Pet Size and Price</label>
                                    <div className="block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md sm:text-sm">
                                        {getSizeDisplay(pet.size, pet.pet_type)} - {getPriceDisplay(pet)}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {pet.pet_type === 'dog' ? 'Size affects pricing' : 'Fixed price for all cats'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Appointment Date *</label>
                                        <DateDropdown
                                            name="service_date" // Added name prop
                                            selectedDate={parseDate(pet.service_date)}
                                            onChange={(date) => onScheduleChange('service', date, pet.service_time)}
                                            unavailableDates={unavailableDates}
                                            minDate={new Date()}
                                        />
                                        {errors.service_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.service_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Appointment Time *</label>
                                        <TimeDropdown
                                            name="service_time" // Added name prop
                                            selectedTime={pet.service_time}
                                            onChange={(time) => onScheduleChange('service', parseDate(pet.service_date), time)}
                                            unavailableTimes={unavailableTimes}
                                            disabled={!pet.service_date}
                                        />
                                        {errors.service_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.service_time}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }}
        </BaseBookingForm>
    );
};

export default GroomingBookingForm;