'use client';
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CalendarComponentProps {
  selectedDate?: Date | null;  // For TransferModal compatibility
  date?: Date | null;          // For PetDetailsForm compatibility
  onDateChange?: (date: Date | null) => void;  // For TransferModal
  setDate?: (date: Date | null) => void;       // For PetDetailsForm
  minDate?: Date;              // Optional minimum selectable date
  maxDate?: Date;              // Optional maximum selectable date
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ 
  selectedDate,
  date,
  onDateChange,
  setDate,
  minDate,
  maxDate
}) => {
  // Determine which props to use based on what's provided
  const effectiveDate = selectedDate !== undefined ? selectedDate : date;
  const effectiveOnChange = onDateChange || setDate;
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sync current month with selected date
  React.useEffect(() => {
    if (effectiveDate) {
      setCurrentMonth(new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), 1));
    }
  }, [effectiveDate]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (effectiveOnChange) {
      effectiveOnChange(newDate);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isSelected = effectiveDate && 
        effectiveDate.getDate() === day && 
        effectiveDate.getMonth() === month && 
        effectiveDate.getFullYear() === year;
      const isPast = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isDisabled = isDateDisabled(currentDate);
      
      days.push(
        <button
          key={`day-${day}`}
          onClick={() => !isPast && !isDisabled && handleDateClick(day)}
          disabled={isPast || isDisabled}
          className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
            isSelected 
              ? 'bg-purple-600 text-white' 
              : isPast || isDisabled
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-800 hover:bg-gray-100'
          }`}
          aria-label={`Select ${currentDate.toLocaleDateString()}`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="w-full">
      {/* Month navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-800"
          aria-label="Previous month"
        >
          <FiChevronLeft size={20} />
        </button>
        <h3 className="font-medium text-gray-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button 
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-800"
          aria-label="Next month"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-800">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarComponent;