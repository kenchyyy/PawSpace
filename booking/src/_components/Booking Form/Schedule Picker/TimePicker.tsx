// TimePicker.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';
import { isToday, isSameDay, parseISO } from 'date-fns';

interface TimePickerProps {
    selectedTime: string;
    onChange: (time: string) => void;
    unavailableTimes?: string[]; // Made optional, often comes from a larger dataset
    disabled?: boolean;
    sameDayCheckInTime?: string; // For check-out time validation on the same day
    serviceDate?: Date | null; // The specific date for which time is being picked
    name: string; // Add name prop for form identification
    className?: string; // Add className prop for error styling
}

const TimePicker: React.FC<TimePickerProps> = ({
    selectedTime,
    onChange,
    unavailableTimes = [], // Default to empty array if not provided
    disabled = false,
    sameDayCheckInTime,
    serviceDate, // This is the date the time is being picked for
    name, // Destructure name prop
    className // Destructure className prop
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const timePickerRef = useRef<HTMLDivElement>(null);

    // Generate operating hours from 7:00 AM to 5:00 PM (17:00)
    const operatingHours = Array.from({ length: 11 }, (_, i) => {
        const hour = i + 7; // Starts at 7
        return hour < 10 ? `0${hour}:00` : `${hour}:00`;
    });

    const isTimeDisabled = (time: string): boolean => {
        // 1. Check if the time slot is explicitly unavailable
        if (unavailableTimes.includes(time)) return true;

        // 2. If it's the same day and a check-in time is provided, ensure check-out is later
        if (sameDayCheckInTime && time <= sameDayCheckInTime) {
            return true;
        }

        // 3. If the service date is today, disable past times
        if (serviceDate && isSameDay(serviceDate, new Date())) {
            const currentTime = new Date();
            const [selectedHour, selectedMinute] = time.split(':').map(Number);
            
            // Create a date object for comparison using today's date and the selected time
            const compareDateTime = new Date();
            compareDateTime.setHours(selectedHour, selectedMinute, 0, 0);

            // If the selected time is in the past relative to the current time, disable it
            // Add a small buffer (e.g., 1 hour) if you want to prevent last-minute bookings
            // For now, simple comparison is used.
            if (compareDateTime <= currentTime) {
                return true;
            }
        }

        return false;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatDisplayTime = (time: string): string => {
        if (!time) return 'Select time'; // Handle empty time gracefully
        const [hours, minutes] = time.split(':');
        const hourNum = parseInt(hours, 10);
        const ampm = hourNum < 12 ? 'AM' : 'PM';
        const displayHour = hourNum === 0 ? 12 : (hourNum > 12 ? hourNum - 12 : hourNum);
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="relative" ref={timePickerRef}>
           
            <button
                id={name} 
                name={name} 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm cursor-pointer text-left flex items-center space-x-2 ${
                    disabled ? 'bg-gray-100' : ''
                } ${className || ''}`} 
            >
                <FiClock className="text-gray-500" />
                <span className={selectedTime ? 'text-gray-800' : 'text-gray-500'}>
                    {formatDisplayTime(selectedTime)}
                </span>
            </button>

            {/* The dropdown list of times */}
            {isOpen && !disabled && (
                <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg w-48 p-2">
                    <div className="max-h-60 overflow-y-auto">
                        {operatingHours.map((time) => (
                            <button
                                key={time}
                                onClick={() => {
                                    onChange(time);
                                    setIsOpen(false);
                                }}
                                disabled={isTimeDisabled(time)}
                                className={`w-full p-2 rounded text-left ${
                                    selectedTime === time
                                        ? 'bg-blue-500 text-white'
                                        : isTimeDisabled(time)
                                            ? 'text-gray-400 cursor-not-allowed opacity-60'
                                            : 'hover:bg-gray-100'
                                }`}
                            >
                                {formatDisplayTime(time)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;