'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay, getDay, startOfDay } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface DatePickerProps {
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
    unavailableDates: Date[];
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    placeholder?: string;
    name: string;
    className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    selectedDate,
    onChange,
    unavailableDates,
    minDate,
    maxDate,
    disabled = false,
    placeholder = "Select a date",
    name,
    className
}) => {
    const [currentMonth, setCurrentMonth] = useState(startOfDay(selectedDate || new Date()));
    const [isOpen, setIsOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const sanitizedMinDate = useMemo(() => {
        return minDate ? startOfDay(minDate) : startOfDay(new Date());
    }, [minDate]);

    const sanitizedUnavailableDates = useMemo(() => {
        return unavailableDates.map(d => startOfDay(d));
    }, [unavailableDates]);

    useEffect(() => {
        if (isOpen && selectedDate && !isSameMonth(selectedDate, currentMonth)) {
            setCurrentMonth(startOfDay(selectedDate));
        }
    }, [isOpen, selectedDate]);

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const isDateDisabled = (date: Date) => {
        const comparableDate = startOfDay(date);
        return comparableDate < sanitizedMinDate ||
            (maxDate && comparableDate > startOfDay(maxDate)) ||
            sanitizedUnavailableDates.some(d => isSameDay(d, comparableDate));
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
        const disablePrevMonth = () => {
            const prevMonth = subMonths(currentMonth, 1);
            return prevMonth < new Date(sanitizedMinDate.getFullYear(), sanitizedMinDate.getMonth(), 1);
        };

        const disableNextMonth = () => {
            if (!maxDate) return false;
            const nextMonth = addMonths(currentMonth, 1);
            const maxDateMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
            return nextMonth > maxDateMonth;
        };

        return (
            <div className="flex justify-between items-center p-2 border-b">
                <button
                    onClick={prevMonth}
                    disabled={disablePrevMonth()}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                    <FiChevronLeft />
                </button>
                <h2 className="font-medium">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                    onClick={nextMonth}
                    disabled={disableNextMonth()}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                    <FiChevronRight />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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
        const monthStart = startOfDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1));
        const numEmptyCellsAtStart = getDay(monthStart);

        const cells = [];
        let day = new Date(monthStart);
        day.setDate(monthStart.getDate() - numEmptyCellsAtStart);

        for (let i = 0; i < 42; i++) {
            const cloneDay = startOfDay(new Date(day));
            const isOutOfMonth = !isSameMonth(cloneDay, currentMonth);
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
                        ${isOutOfMonth ? 'text-gray-400 opacity-40 cursor-default' : ''}
                    `}
                    onClick={() => {
                        if (!isDisabled && !isOutOfMonth) {
                            onChange(cloneDay);
                            setIsOpen(false);
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

        return <div className="grid grid-cols-7">{cells}</div>;
    };

    return (
        <div className="relative" ref={datePickerRef}>
            <input
                type="text"
                id={name}
                name={name}
                value={selectedDate ? format(selectedDate, 'MMM d, yyyy') : ''}
                onClick={() => {
                    if (!disabled) {
                        if (selectedDate) {
                            setCurrentMonth(startOfDay(selectedDate));
                        }
                        setIsOpen(!isOpen);
                    }
                }}
                readOnly
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full p-3 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm cursor-pointer ${className || ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />

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