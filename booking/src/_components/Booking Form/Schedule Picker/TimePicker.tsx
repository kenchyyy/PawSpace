'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FiClock } from 'react-icons/fi';
import { isSameDay, setHours, setMinutes } from 'date-fns';

interface TimePickerProps {
    selectedTime: string;
    onChange: (time: string) => void;
    unavailableTimes?: string[];
    disabled?: boolean;
    sameDayCheckInTime?: string; 
    serviceDate?: Date | null; 
    name: string;
    className?: string;
    isCheckInOrCheckOut?: 'checkIn' | 'checkOut' | undefined;
}

const TimePicker: React.FC<TimePickerProps> = ({
    selectedTime,
    onChange,
    unavailableTimes = [],
    disabled = false,
    sameDayCheckInTime,
    serviceDate,
    name,
    className,
    isCheckInOrCheckOut 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const timePickerRef = useRef<HTMLDivElement>(null);

    const allOperatingHours = useMemo(() => {
        const hours: string[] = [];
        for (let i = 6; i <= 22; i++) { 
            hours.push(`${i.toString().padStart(2, '0')}:00`);
        }
        return hours;
    }, []);

    const isTimeDisabled = (time: string): boolean => {
        if (unavailableTimes.includes(time)) return true;

        if (name === 'check_out_time' && sameDayCheckInTime && selectedTimeForComparison(time) <= selectedTimeForComparison(sameDayCheckInTime)) {
            return true;
        }

        if (serviceDate && isSameDay(serviceDate, new Date())) {
            const now = new Date();
            const [selectedHour, selectedMinute] = time.split(':').map(Number);

            const compareDateTime = setMinutes(setHours(serviceDate, selectedHour), selectedMinute);

            if (compareDateTime <= now) {
                return true;
            }
        }
        return false;
    };

    const selectedTimeForComparison = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 100 + minutes;
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

    const getSurchargeNote = (time: string): string => {
        if (!isCheckInOrCheckOut) return ''; 

        const [hour] = time.split(':').map(Number);

        if (hour >= 6 && hour < 9) { 
            return '+ P200';
        }
        else if (hour > 19 && hour <= 22) { 
            return '+ P200';
        }
        return '';
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
                    {selectedTime ? formatDisplayTime(selectedTime) : 'Select time'}
                </span>
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg w-48 p-2">
                    <div className="max-h-60 overflow-y-auto">
                        {allOperatingHours.map((time) => (
                            <button
                                key={time}
                                onClick={() => {
                                    onChange(time);
                                    setIsOpen(false);
                                }}
                                disabled={isTimeDisabled(time)}
                                className={`w-full p-2 rounded text-left flex justify-between items-center ${
                                    selectedTime === time
                                        ? 'bg-blue-500 text-white'
                                        : isTimeDisabled(time)
                                            ? 'text-gray-400 cursor-not-allowed opacity-60'
                                            : 'hover:bg-gray-100'
                                }`}
                            >
                                <span>{formatDisplayTime(time)}</span>
                                <span className="text-xs text-red-500 font-semibold ml-2">
                                    {getSurchargeNote(time)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;