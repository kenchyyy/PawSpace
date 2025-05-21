'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';
import { isSameDay } from 'date-fns';

interface TimePickerProps {
    selectedTime: string;
    onChange: (time: string) => void;
    unavailableTimes?: string[];
    disabled?: boolean;
    sameDayCheckInTime?: string;
    serviceDate?: Date | null;
    name: string;
    className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
    selectedTime,
    onChange,
    unavailableTimes = [],
    disabled = false,
    sameDayCheckInTime,
    serviceDate,
    name,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const timePickerRef = useRef<HTMLDivElement>(null);

    const operatingHours = Array.from({ length: 11 }, (_, i) => {
        const hour = i + 7;
        return hour < 10 ? `0${hour}:00` : `${hour}:00`;
    });

    const isTimeDisabled = (time: string): boolean => {
        if (unavailableTimes.includes(time)) return true;

        if (sameDayCheckInTime && time <= sameDayCheckInTime) {
            return true;
        }

        if (serviceDate && isSameDay(serviceDate, new Date())) {
            const currentTime = new Date();
            const [selectedHour, selectedMinute] = time.split(':').map(Number);

            const compareDateTime = new Date();
            compareDateTime.setHours(selectedHour, selectedMinute, 0, 0);

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
        if (!time) return 'Select time';
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