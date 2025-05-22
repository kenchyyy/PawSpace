'use client';

import React, { useState } from 'react';
import { Booking } from './types';
import BookingCard from './Booking Card/BookingCard';
import RescheduleModal from './Modals/RescheduleModal';
import CancelModal from './Modals/CancelModal';

interface BookingHistoryProps {
  bookings: Booking[];
}

export default function BookingHistory({ bookings }: BookingHistoryProps) {
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const handleToggleExpand = (bookingId: string) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  const handleEdit = (booking: Booking) => {
    setBookingToEdit(booking);
  };

  const handleCancel = (booking: Booking) => {
    setBookingToCancel(booking);
  };

  const handleReschedule = (date: Date, time: string) => {
    if (!bookingToEdit?.id) return;
    console.log('Rescheduling booking:', bookingToEdit.id, date, time);
    setBookingToEdit(null);
  };

  const handleConfirmCancel = (reason: string) => {
    if (!bookingToCancel?.id) return;
    console.log('Cancelling booking:', bookingToCancel.id, 'Reason:', reason);
    setBookingToCancel(null);
  };

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        bookings.map(booking => (
          <BookingCard
            key={booking.id || `booking-${Math.random()}`}
            booking={booking}
            isExpanded={expandedBookingId === booking.id}
            isAnyExpanded={expandedBookingId !== null}
            onToggle={() => booking.id && handleToggleExpand(booking.id)}
            onEdit={() => handleEdit(booking)}
            onCancel={() => handleCancel(booking)}
          />
        ))
      )}

      {/* Modals */}
      {bookingToEdit && (
        <RescheduleModal
          isOpen={!!bookingToEdit}
          booking={bookingToEdit}
          onClose={() => setBookingToEdit(null)}
          onReschedule={handleReschedule}
        />
      )}

      {bookingToCancel && (
        <CancelModal
          isOpen={!!bookingToCancel}
          booking={bookingToCancel}
          onClose={() => setBookingToCancel(null)}
          onCancel={handleConfirmCancel}
        />
      )}
    </div>
  );
}