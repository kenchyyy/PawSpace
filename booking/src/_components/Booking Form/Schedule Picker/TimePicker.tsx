'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FiClock } from 'react-icons/fi';
import { isSameDay } from 'date-fns';

interface TimePickerProps {
    selectedTime: string;
    onChange: (time: string) => void;
    unavailableTimes?: string[];
    disabled?: boolean;
    sameDayCheckInTime?: string;
    serviceDate: Date | null;
    name: string;
    className?: string;
    serviceType?: 'grooming' | 'daycare' | 'boarding';
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
    serviceType,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const timePickerRef = useRef<HTMLDivElement>(null);

    const allOperatingHours = useMemo(() => {
        const hours: string[] = [];
        if (serviceType === 'grooming') {
            for (let i = 9; i <= 18; i++) {
                hours.push(`${i.toString().padStart(2, '0')}:00`);
            }
        } else {
            for (let i = 6; i <= 22; i++) {
                hours.push(`${i.toString().padStart(2, '0')}:00`);
            }
        }
        return hours;
    }, [serviceType]);

    const timeToNumber = (timeStr: string): number => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 100 + minutes;
    };

    const isTimeDisabled = (time: string): boolean => {
        if (unavailableTimes.includes(time)) {
            return true;
        }

        const actualServiceDate = serviceDate instanceof Date ? serviceDate : (serviceDate ? new Date(serviceDate) : null);

        if (actualServiceDate && isSameDay(actualServiceDate, new Date())) {
            const now = new Date();
            const currentHourMinuteNum = now.getHours() * 100 + now.getMinutes();
            const selectedTimeNum = timeToNumber(time);
            
            if (selectedTimeNum < currentHourMinuteNum + 15) { 
                return true;
            }
        }

        if (name === 'check_out_time' && sameDayCheckInTime) {
            const selectedTimeNum = timeToNumber(time);
            const checkInTimeNum = timeToNumber(sameDayCheckInTime);
            if (selectedTimeNum <= checkInTimeNum) {
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

    const getSurchargeText = (time: string): string => {
        if (serviceType === 'grooming' || (name !== 'check_in_time' && name !== 'check_out_time')) {
            return '';
        }

        const [hour] = time.split(':').map(Number);

        if ((hour >= 6 && hour < 9) || (hour >= 20 && hour <= 22)) {
            return 'Surcharge applies';
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
                className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm cursor-pointer text-left flex items-center justify-between space-x-2 ${
                    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${className || ''}`}
            >
                <div className="flex items-center space-x-2">
                    <FiClock className="text-gray-500" />
                    <span className={selectedTime ? 'text-gray-800' : 'text-gray-500'}>
                        {selectedTime ? formatDisplayTime(selectedTime) : 'Select time'}
                    </span>
                </div>
                {selectedTime && getSurchargeText(selectedTime) && (
                    <span className="text-xs text-gray-600 font-semibold flex-shrink-0">
                        {getSurchargeText(selectedTime)}
                    </span>
                )}
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg w-full max-h-60 overflow-y-auto custom-scrollbar">
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
                            {!isTimeDisabled(time) && getSurchargeText(time) && (
                                <span className="text-xs text-gray-600 ml-2">
                                    {getSurchargeText(time)}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimePicker;