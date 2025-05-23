// BoardingBookingForm.tsx
'use client';
import React, { useState } from 'react';
import BaseBookingForm from './BaseBookingForm';
import { Booking, BoardingPet, parseDate, isSameDay, calculateNights, pricing, BookingResult, OwnerDetails, Pet } from '../types';
import { toast } from 'sonner';
import MealInstructions from '../Form Components/MealInstructions';
import { FiSun, FiMoon } from 'react-icons/fi';
import DateDropdown from '../Schedule Picker/DatePicker';
import TimeDropdown from '../Schedule Picker/TimePicker';
import BasePetDetails from '../Form Components/BasePetDetails';
import { useRouter } from 'next/navigation';
import { createBooking } from '../bookingService';
import { isBoardingPet } from '../types';
import RoomAvailabilityDisplay from '../Form Components/RoomAvailabilityDisplay';

interface BoardingBookingFormProps {
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

const BoardingBookingForm: React.FC<BoardingBookingFormProps> = ({
    onConfirmBooking,
    onClose,
    unavailableDates = [],
    unavailableTimes = [],
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [showAvailability, setShowAvailability] = useState(false);

    const validateBoardingData = (pet: BoardingPet): string[] => {
        const errors: string[] = [];
        if (!pet.check_in_date) errors.push('Check-in date is required');
        if (!pet.check_out_date) errors.push('Check-out date is required');
        if (!pet.room_size) errors.push('Room size is required');
        if (!pet.boarding_type) errors.push('Boarding type is required');

        const checkIn = parseDate(pet.check_in_date);
        const checkOut = parseDate(pet.check_out_date);

        if (!checkIn || !checkOut) errors.push('Invalid date format');
        if (pet.boarding_type === 'overnight' && checkIn && checkOut && checkIn >= checkOut) {
            errors.push('Check-out date must be after check-in date for overnight boarding');
        }
        if (pet.boarding_type === 'day' && checkIn && checkOut && !isSameDay(checkIn, checkOut)) {
            errors.push('Check-in and check-out must be on the same day for day boarding');
        }
        return errors;
    };

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
                    if (!isBoardingPet(pet)) {
                        throw new Error('Invalid pet type for boarding');
                    }

                    const petErrors = validateBoardingData(pet);
                    if (petErrors.length > 0) throw new Error(petErrors.join(', '));

                    const checkInDate = parseDate(pet.check_in_date)!;
                    const checkOutDate = parseDate(pet.check_out_date)!;
                    const nights = calculateNights(checkInDate, checkOutDate);
                    const roomSizeKey = pet.pet_type === 'cat'
                        ? pet.room_size === 'cat_small' ? 'cat_small' : 'cat_large'
                        : pet.room_size;

                    const basePrice = pet.boarding_type === 'day'
                        ? pricing.boarding.day[roomSizeKey] || 0
                        : (pricing.boarding.overnight[roomSizeKey] || 0) * nights;

                    let discount = 0;
                    if (pet.boarding_type === 'overnight') {
                        if (nights >= 15) discount = 0.2;
                        else if (nights >= 7) discount = 0.1;
                    }

                    const currentTotalAmount = totalAmounts[index] !== undefined ? totalAmounts[index] : (basePrice * (1 - discount));
                    const currentDiscountApplied = discountsApplied && discountsApplied[index] !== undefined ? discountsApplied[index] : discount;

                    return await createBooking(
                        ownerDetails,
                        [pet],
                        [currentTotalAmount],
                        [currentDiscountApplied]
                    );
                })
            );

            const allSuccessful = bookingResults.every(result => result.success);

            if (allSuccessful && bookingResults.length > 0) {
                toast.success('Boarding reservation created successfully!');
                router.push('/customer/history');
                return { success: true, bookingId: bookingResults[0]?.bookingId };
            } else {
                const firstError = bookingResults.find(result => !result.success)?.error || 'Failed to create one or more bookings.';
                toast.error(`Reservation failed: ${firstError}`);
                return { success: false, error: firstError };
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(`Reservation failed: ${errorMsg}`);
            return { success: false, error: errorMsg };
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    };

    return (
        <BaseBookingForm
            onConfirmBooking={onConfirmBooking || handleConfirmBooking}
            onClose={onClose}
            serviceType="boarding"
            isSubmitting={isSubmitting}
            unavailableDates={unavailableDates}
            unavailableTimes={unavailableTimes}
        >
            {({ pet, onChange, onScheduleChange, errors }) => {
                if (!isBoardingPet(pet)) return null;

                const getError = (fieldName: string) => errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300';

                const handleDateChange = (type: 'checkIn' | 'checkOut', date: Date | null) => {
                    const timeToPass = type === 'checkIn' ? pet.check_in_time : pet.check_out_time;
                    onScheduleChange(type, date, timeToPass);
                };

                const handleTimeChange = (type: 'checkIn' | 'checkOut', time: string) => {
                    const dateToPass = type === 'checkIn' ? parseDate(pet.check_in_date) : parseDate(pet.check_out_date);
                    onScheduleChange(type, dateToPass, time);
                };

                const getMinDate = (): Date | undefined => {
                    if (pet.boarding_type === 'day') {
                        return parseDate(pet.check_in_date) || undefined;
                    }
                    const checkInDate = parseDate(pet.check_in_date);
                    return checkInDate ? new Date(checkInDate.getTime() + 86400000) : new Date();
                };

                return (
                    <div className="space-y-6">
                        <BasePetDetails
                            pet={pet}
                            onChange={onChange}
                            errors={errors}
                            onScheduleChange={onScheduleChange}
                            serviceType="boarding"
                            unavailableDates={unavailableDates}
                            unavailableTimes={unavailableTimes}
                        />

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="font-medium text-gray-800 text-lg">Appointment Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Boarding Type *</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="dayBoarding"
                                                name="boarding_type"
                                                value="day"
                                                checked={pet.boarding_type === 'day'}
                                                onChange={(e) => {
                                                    onChange(e);
                                                    setShowAvailability(false);
                                                }}
                                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                                required
                                            />
                                            <label htmlFor="dayBoarding" className="ml-3 flex items-center text-sm font-medium text-gray-700">
                                                <FiSun className="mr-2" /> Day Boarding (Hourly Rate)
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="overnight"
                                                name="boarding_type"
                                                value="overnight"
                                                checked={pet.boarding_type === 'overnight'}
                                                onChange={(e) => {
                                                    onChange(e);
                                                    setShowAvailability(false);
                                                }}
                                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                                required
                                            />
                                            <label htmlFor="overnight" className="ml-3 flex items-center text-sm font-medium text-gray-700">
                                                <FiMoon className="mr-2" /> Overnight (24-hour Rate)
                                            </label>
                                        </div>
                                    </div>
                                    {errors.boarding_type && <p className="mt-1 text-sm text-red-600">{errors.boarding_type}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Room Size *</label>
                                    <select
                                        name="room_size"
                                        value={pet.room_size}
                                        onChange={(e) => {
                                            onChange(e);
                                            setShowAvailability(true);
                                        }}
                                        className={`block w-full px-3 py-2 border ${errors.room_size ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                                        required
                                    >
                                        <option value="">Select room size</option>
                                        {pet.pet_type === 'dog' && (
                                            <>
                                                <option value="small">Small (P65/hr or P450/night)</option>
                                                <option value="medium">Medium (P75/hr or P600/night)</option>
                                                <option value="large">Large (P110/hr or P800/night)</option>
                                            </>
                                        )}
                                        {pet.pet_type === 'cat' && (
                                            <>
                                                <option value="cat_small">Cat - Small (P65/hr or P450/night)</option>
                                                <option value="cat_big">Cat - Big (P65/hr or P600/night)</option>
                                            </>
                                        )}
                                    </select>
                                    {errors.room_size && <p className="mt-1 text-sm text-red-600">{errors.room_size}</p>}
                                </div>

                                

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Check-In Date *</label>
                                        <DateDropdown
                                            name="check_in_date" 
                                            selectedDate={parseDate(pet.check_in_date)}
                                            onChange={(date) => {
                                                handleDateChange('checkIn', date);
                                                setShowAvailability(true);
                                            }}
                                            unavailableDates={unavailableDates}
                                            minDate={new Date()}
                                        />
                                        {errors.check_in_date && <p className="mt-1 text-sm text-red-600">{errors.check_in_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Check-In Time *</label>
                                        <TimeDropdown
                                            name="check_in_time" 
                                            selectedTime={pet.check_in_time}
                                            onChange={(time) => {
                                                handleTimeChange('checkIn', time);
                                                setShowAvailability(true);
                                            }}
                                            unavailableTimes={unavailableTimes}
                                            disabled={!pet.check_in_date}
                                        />
                                        {errors.check_in_time && <p className="mt-1 text-sm text-red-600">{errors.check_in_time}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Check-Out Date *</label>
                                        <DateDropdown
                                            name="check_out_date" 
                                            selectedDate={parseDate(pet.check_out_date)}
                                            onChange={(date) => {
                                                handleDateChange('checkOut', date);
                                                setShowAvailability(true);
                                            }}
                                            unavailableDates={unavailableDates}
                                            minDate={getMinDate()}
                                        />
                                        {errors.check_out_date && <p className="mt-1 text-sm text-red-600">{errors.check_out_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Check-Out Time *</label>
                                        <TimeDropdown
                                            name="check_out_time"
                                            selectedTime={pet.check_out_time}
                                            onChange={(time) => {
                                                handleTimeChange('checkOut', time);
                                                setShowAvailability(true);
                                            }}
                                            unavailableTimes={unavailableTimes}
                                            disabled={!pet.check_out_date}
                                            sameDayCheckInTime={pet.boarding_type === 'day' && pet.check_in_date && isSameDay(parseDate(pet.check_in_date), parseDate(pet.check_out_date)) ? pet.check_in_time : undefined}
                                        />
                                        {errors.check_out_time && <p className="mt-1 text-sm text-red-600">{errors.check_out_time}</p>}
                                    </div>     
                                </div>
                                {/* Room Availability Display */}
                                {showAvailability && pet.room_size && (
                                    <RoomAvailabilityDisplay
                                        roomSize={pet.room_size}
                                        checkIn={parseDate(pet.check_in_date)}
                                        checkOut={parseDate(pet.check_out_date)}
                                        checkInTime={pet.check_in_time || ''}
                                        checkOutTime={pet.check_out_time || ''}
                                    />
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <MealInstructions
                                    pet={pet}
                                    onChange={onChange}
                                    errors={errors}
                                />
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                                    <textarea
                                        name="special_requests"
                                        value={pet.special_requests}
                                        onChange={onChange}
                                        className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${getError('special_requests')}`}
                                        rows={3}
                                    />
                                    {errors.special_requests && (
                                        <p className="text-red-500 text-xs mt-1">{errors.special_requests}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }}
        </BaseBookingForm>
    );
};

export default BoardingBookingForm;