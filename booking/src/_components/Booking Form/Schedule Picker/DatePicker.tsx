// DatePicker.tsx
import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  unavailableDates: Date[];
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  unavailableDates,
  minDate = new Date(),
  maxDate,
  disabled = false,
  placeholder = "Select a date"
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date < minDate || 
           (maxDate && date > maxDate) || 
           unavailableDates.some(d => isSameDay(d, date)) ||
           (date < today);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center p-2 border-b">
        <button 
          onClick={prevMonth}
          disabled={isSameMonth(currentMonth, minDate)}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <FiChevronLeft />
        </button>
        <h2 className="font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={nextMonth}
          disabled={maxDate && isSameMonth(currentMonth, maxDate)}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <FiChevronRight />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'EEE';
    const days = [];
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm font-medium py-2">
          {format(new Date(startDate.setDate(i + 1)), dateFormat).charAt(0)}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        if (day.getMonth() !== monthStart.getMonth()) {
          days.push(<div key={day.toString()} className="p-2" />);
        } else {
          formattedDate = format(day, 'd');
          const cloneDay = new Date(day);
          const isDisabled = isDateDisabled(cloneDay);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const isUnavailable = unavailableDates.some(d => isSameDay(d, day));

          days.push(
            <div
              key={day.toString()}
              className={`p-2 text-center cursor-pointer rounded-full transition-all
                ${isSelected ? 'bg-blue-500 text-white shadow-md' : ''}
                ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${isToday && !isSelected ? 'border border-blue-500' : ''}
                ${isUnavailable ? 'bg-gray-100 text-gray-400' : ''}
              `}
              onClick={() => !isDisabled && !isUnavailable && onChange(cloneDay)}
            >
              {formattedDate}
              {isToday && !isSelected && (
                <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
              )}
            </div>
          );
        }
        day = new Date(day.setDate(day.getDate() + 1));
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mt-2">{rows}</div>;
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-2 border rounded text-left flex items-center space-x-2 ${
          disabled ? 'bg-gray-100' : ''
        }`}
      >
        <span className={selectedDate ? 'text-gray-800' : 'text-gray-500'}>
          {selectedDate ? format(selectedDate, 'PPP') : placeholder}
        </span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg w-64 p-2">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      )}
    </div>
  );
};

export default DatePicker;