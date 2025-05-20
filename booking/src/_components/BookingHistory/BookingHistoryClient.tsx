// src/StoryComponents/BookingHistory/BookingHistoryClient.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import BookingCard from './BookingCard';
import { BookingRecord } from './types/bookingRecordType';
import { BookingHistoryClientProps } from './types/bookingRecordsInterface'; // Import the interface

const BookingHistoryClient: React.FC<BookingHistoryClientProps> = ({ bookings: initialBookings, loading: initialLoading, error: initialError, totalCount }) => {
  const [bookings, setBookings] = useState<BookingRecord[] | undefined | null>(initialBookings);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);
  const [page, setPage] = useState(2); // Start from page 2 for subsequent loads
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const allItemsLoaded = totalCount !== null && bookings !== undefined && bookings !== null && bookings.length >= totalCount;

  const fetchNextPage = useCallback(async () => {
    if (loading || error || allItemsLoaded || !page) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/history/load-more?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.bookings) {
        setBookings((prevBookings) => (prevBookings ? [...prevBookings, ...data.bookings] : data.bookings));
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err: unknown) {
      console.error('Error fetching next page:', err);
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, [page, loading, error, allItemsLoaded]);

  useEffect(() => {
    if (initialError) {
      setError(initialError);
      setLoading(false);
      return;
    }
    if (initialLoading) {
      setLoading(true);
      setError(null);
      return;
    }
    setLoading(false);
    setError(null);
  }, [initialError, initialLoading, initialBookings]);

  useEffect(() => {
    if (loadMoreRef.current) {
      observer.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && !error && !allItemsLoaded) {
            fetchNextPage();
          }
        });
      });
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [fetchNextPage, loading, error, allItemsLoaded]);

  if (loading && !bookings) {
    return <div>Loading booking history...</div>;
  }

  if (error) {
    return <div>Error loading booking history: {error.message}</div>;
  }

  if (!bookings || bookings.length === 0) {
    return <div>No booking history found.</div>;
  }

  return (
    <div className={`bg-indigo-900 flex flex-col font-sans gap-5 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
      <div className="flex justify-end">
        <p className="text-yellow-300 text-sm font-sans mb-4">
          Past booking data is retained for 3 months after the service date ends.
        </p>
      </div>
      {bookings?.map((booking) => (
        <div key={booking.booking_uuid}>
          <BookingCard booking={booking} />
        </div>
      ))}
      {!allItemsLoaded && (
        <div ref={loadMoreRef}>
          {loading ? <div className="text-white text-center">Loading more bookings...</div> : <div></div>}
        </div>
      )}
      {allItemsLoaded && <div className="text-gray-400 text-center">No more bookings to load.</div>}
    </div>
  );
};

export default BookingHistoryClient;