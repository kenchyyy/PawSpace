// components/BookingHeader.tsx
import React from 'react';

interface BookingHeaderProps {
    serviceType: string;
    petName: string;
    groomServiceDateTime: string | null;
    boardingPeriod: string | null;
    publishDate: string;
    status: string;
    statusDotColor: string;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({
    serviceType,
    petName,
    groomServiceDateTime,
    boardingPeriod,
    publishDate,
    status,
    statusDotColor,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 min-w-0">
            <div className="flex flex-col md:flex-row items-start md:items-center min-w-0 w-full md:w-auto">
                <div className="w-full md:w-36 flex-shrink-0 flex justify-center md:justify-center mb-2 md:mb-0">
                    {serviceType && (
                        <div
                            className={
                                "px-2 py-1 rounded-full text-xs font-bold shadow w-full text-center " +
                                (serviceType === "Grooming & Overnight Boarding"
                                    ? "bg-blue-600 text-white"
                                    : serviceType === "Grooming & Day Boarding"
                                    ? "bg-blue-500 text-white"
                                    : serviceType === "Grooming"
                                    ? "bg-pink-500 text-white"
                                    : serviceType === "Overnight Boarding"
                                    ? "bg-green-600 text-white"
                                    : serviceType === "Day Boarding"
                                    ? "bg-green-400 text-white"
                                    : serviceType === "Boarding"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-400 text-white")
                            }
                        >
                            {serviceType}
                        </div>
                    )}
                </div>

                <div className="flex flex-col leading-tight md:ml-2 min-w-0 flex-grow w-full md:w-auto">
                    <div className="text-yellow-200 text-sm font-semibold truncate">
                        <p className='text-2xl'> {petName} </p>
                    </div>

                    {groomServiceDateTime && (
                        <div className="text-green-300 text-xs italic truncate">
                            {groomServiceDateTime}
                        </div>
                    )}

                    {boardingPeriod && (
                        <div className="text-green-300 text-xs italic truncate">
                            {boardingPeriod}
                        </div>
                    )}

                    <div className="text-white text-xs truncate"> Booked Date: {publishDate}</div>
                </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0 mt-2 md:mt-0 min-w-0 max-w-[40%]">
                <div
                    className={`w-3 h-3 rounded-full ${statusDotColor} shadow flex-shrink-0`}
                    title={status.charAt(0).toUpperCase() + status.slice(1)}
                    aria-label={`Booking status: ${status}`}
                />
                <div className="text-white text-xs font-semibold capitalize truncate max-w-[70px]">
                    {status}
                </div>
            </div>
        </div>
    );
};

export default BookingHeader;