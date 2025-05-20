// DatePicker.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay, getDay } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface DatePickerProps {
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
    unavailableDates: Date[];
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    placeholder?: string;
    name: string; // Crucial for form submission and ID
    className?: string; // For styling from parent (e.g., error classes)
}

const DatePicker: React.FC<DatePickerProps> = ({
    selectedDate,
    onChange,
    unavailableDates,
    minDate = new Date(),
    maxDate,
    disabled = false,
    placeholder = "Select a date",
    name, // Destructure the new name prop
    className // Destructure the new className prop
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Ensure minDate is set to the start of the day for accurate comparison
    const sanitizedMinDate = (() => {
        const d = new Date(minDate);
        d.setHours(0, 0, 0, 0);
        return d;
    })();

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const isDateDisabled = (date: Date) => {
        const comparableDate = new Date(date);
        comparableDate.setHours(0, 0, 0, 0); // Normalize to start of day

        return comparableDate < sanitizedMinDate ||
               (maxDate && comparableDate > maxDate) ||
               unavailableDates.some(d => isSameDay(d, comparableDate));
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
                    // Disable prev month if it would go before minDate's month
                    disabled={isSameMonth(currentMonth, sanitizedMinDate) && currentMonth.getMonth() === sanitizedMinDate.getMonth() && currentMonth.getFullYear() === sanitizedMinDate.getFullYear()}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                    <FiChevronLeft />
                </button>
                <h2 className="font-medium">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                    onClick={nextMonth}
                    // Disable next month if it would go past maxDate's month
                    disabled={maxDate && isSameMonth(currentMonth, maxDate) && currentMonth.getMonth() === maxDate.getMonth() && currentMonth.getFullYear() === maxDate.getFullYear()}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                    <FiChevronRight />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Short day names
        return (
            <div className="grid grid-cols-7">
                {dayNames.map((day, index) => (
                    <div key={index} className="text-center text-sm font-medium py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const firstDayOfWeek = getDay(monthStart); // 0 for Sunday, 6 for Saturday

        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

        const cells = [];
        let day = new Date(monthStart);
        day.setDate(day.getDate() - firstDayOfWeek); // Move 'day' back to the start of the week for the first row

        // Render leading empty cells for days before the 1st of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            const cloneDay = new Date(day);
            const isOutOfMonth = !isSameMonth(cloneDay, currentMonth);

            cells.push(
                <div
                    key={`empty-${cloneDay.toISOString()}`}
                    className={`p-2 text-center text-sm text-gray-400 opacity-40 cursor-default`}
                >
                    {format(cloneDay, 'd')}
                </div>
            );
            day.setDate(day.getDate() + 1);
        }

        // Render days of the current month
        for (let i = 0; i < daysInMonth; i++) {
            const cloneDay = new Date(day);
            const isDisabled = isDateDisabled(cloneDay);
            const isSelected = selectedDate && isSameDay(cloneDay, selectedDate);
            const isToday = isSameDay(cloneDay, new Date());

            cells.push(
                <div
                    key={cloneDay.toISOString()}
                    className={`p-2 text-center cursor-pointer rounded-full transition-all text-sm
                        ${isSelected ? 'bg-blue-500 text-white shadow-md' : ''}
                        ${isDisabled ? 'text-gray-400 cursor-not-allowed opacity-60' : 'hover:bg-gray-100'}
                        ${isToday && !isSelected && !isDisabled ? 'border border-blue-500' : ''}
                    `}
                    onClick={() => {
                        if (!isDisabled) {
                            onChange(cloneDay);
                            setIsOpen(false); // Close date picker on date selection
                        }
                    }}
                >
                    {format(cloneDay, 'd')}
                    {isToday && !isSelected && !isDisabled && (
                        <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
                    )}
                </div>
            );
            day.setDate(day.getDate() + 1);
        }

        // Render trailing empty cells for days after the end of the month to complete the week
        while (cells.length % 7 !== 0) {
            const cloneDay = new Date(day);
            cells.push(
                <div
                    key={`empty-${cloneDay.toISOString()}`}
                    className={`p-2 text-center text-sm text-gray-400 opacity-40 cursor-default`}
                >
                    {format(cloneDay, 'd')}
                </div>
            );
            day.setDate(day.getDate() + 1);
        }

        return <div className="grid grid-cols-7">{cells}</div>;
    };

    return (
        <div className="relative" ref={datePickerRef}>
            {/* THIS IS THE INPUT FIELD THAT WILL RECEIVE THE ID AND BE SCROLLABLE */}
            <input
                type="text" // Use text type to control formatting and prevent native picker
                id={name} // IMPORTANT: This ID will be targeted by scrollToFirstError
                name={name} // Also s
                value={selectedDate ? format(selectedDate, 'MMM d, yyyy') : ''} 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                readOnly // Make it read-only so users interact via the button
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm cursor-pointer ${className || ''}`}
                // Pass className from props to apply error styling
            />

            {/* The calendar dropdown */}
            {isOpen && !disabled && (
                <div className="absolute z-20 mt-1 bg-white border rounded-lg shadow-lg w-64 p-2">
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </div>
            )}
        </div>
    );
};

export default DatePicker;