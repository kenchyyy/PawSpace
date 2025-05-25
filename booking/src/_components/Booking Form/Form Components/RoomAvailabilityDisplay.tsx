'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { checkAvailability, AvailabilityResponse } from '../availability';
import { RoomSize } from '../types';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa'; 

interface AvailabilityDisplayProps {
  roomSize: RoomSize | null;
  checkIn: Date | null;
  checkOut: Date | null;
  checkInTime: string;
  checkOutTime: string;
}

const RoomAvailabilityDisplay: React.FC<AvailabilityDisplayProps> = ({
  roomSize,
  checkIn,
  checkOut,
  checkInTime,
  checkOutTime
}) => {
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!roomSize || !checkIn || !checkOut) {
      setAvailability(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setAvailability(null);

    try {
      const result = await checkAvailability({
        roomSize,
        start: checkIn.toISOString(),
        end: checkOut.toISOString()
      });

      setAvailability(result);
    } catch (err) {
      console.error('Availability check failed:', err);
      setError('Failed to check availability. Please try again.');
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  }, [roomSize, checkIn, checkOut]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAvailability();
    }, 500);

    return () => clearTimeout(timer);
  }, [roomSize, checkIn, checkOut, fetchAvailability]);

  if (!roomSize) return null;

  return (
    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md mt-6 border border-blue-100 animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
        Room Availability
      </h3>

      {loading && (
        <div className="flex items-center text-indigo-600 animate-pulse">
          <FaSpinner className="animate-spin mr-2 text-xl" />
          <p className="text-gray-600 font-medium">Checking availability...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
          <FaExclamationTriangle className="text-3xl mb-2" />
          <p className="text-center font-medium">{error}</p>
          <button
            onClick={fetchAvailability}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200"
          >
            Retry Check
          </button>
        </div>
      )}

      {availability && !loading && !error && (
        <div className="flex items-center gap-3">
          {availability.availableRooms > 0 ? (
            <FaCheckCircle className="text-green-500 text-2xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-2xl" />
          )}

          <p className="text-lg font-medium text-gray-700">
            {availability.availableRooms > 0
              ? <span className="text-green-600">{availability.availableRooms} {roomSize.replace('_', ' ')} room(s) available</span>
              : <span className="text-red-600">No {roomSize.replace('_', ' ')} rooms available</span>
            }
            <span className="text-sm text-gray-500 ml-1">({availability.occupiedCount} occupied / {availability.totalRooms} total)</span>
          </p>
        </div>
      )}

      {!roomSize && !loading && !error && !availability && (
        <p className="text-gray-500 italic">Select a room size and dates to check availability.</p>
      )}
    </div>
  );
};

export default RoomAvailabilityDisplay;