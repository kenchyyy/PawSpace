import React, { useState, useRef, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';

interface TimePickerProps {
  selectedTime: string;
  onChange: (time: string) => void;
  unavailableTimes: string[];
  disabled?: boolean;
  sameDayCheckInTime?: string;
  serviceDate?: Date | null;
}

const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  onChange,
  unavailableTimes,
  disabled = false,
  sameDayCheckInTime,
  serviceDate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  const operatingHours = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 7;
    return hour < 10 ? `0${hour}:00` : `${hour}:00`;
  });

  const isTimeDisabled = (time: string): boolean => {
    if (unavailableTimes.includes(time)) return true;
    
    if (sameDayCheckInTime && time <= sameDayCheckInTime) return true;
    
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
    const [hours] = time.split(':');
    const hourNum = parseInt(hours, 10);
    return hourNum < 12 ? `${hourNum}:00 AM` : `${hourNum === 12 ? 12 : hourNum - 12}:00 PM`;
  };

  return (
    <div className="relative" ref={timePickerRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-2 border rounded text-left flex items-center space-x-2 ${
          disabled ? 'bg-gray-100' : ''
        }`}
      >
        <FiClock />
        <span className={selectedTime ? 'text-gray-800' : 'text-gray-500'}>
          {selectedTime ? formatDisplayTime(selectedTime) : 'Select time'}
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
                      ? 'text-gray-400 cursor-not-allowed' 
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