'use client';
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CalendarComponentProps {
    date: Date;
    setDate: (date: Date | null) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ date, setDate }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date());

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
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setDate(selectedDate);
    };

    const renderDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        const days = [];
        
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isSelected = date && 
                date.getDate() === day && 
                date.getMonth() === month && 
                date.getFullYear() === year;
            const isPast = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            days.push(
                <button
                    key={`day-${day}`}
                    onClick={() => !isPast && handleDateClick(day)}
                    disabled={isPast}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                        isSelected 
                            ? 'bg-purple-600 text-white' 
                            : isPast 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-800 hover:bg-gray-100'
                    }`}
                >
                    {day}
                </button>
            );
        }
        
        return days;
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <button 
                    onClick={handlePrevMonth}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-800"
                >
                    <FiChevronLeft size={20} />
                </button>
                <h3 className="font-medium text-gray-900">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                    onClick={handleNextMonth}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-800"
                >
                    <FiChevronRight size={20} />
                </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-800">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
                {renderDays()}
            </div>
        </div>
    );
};

export default CalendarComponent;