'use client';
import React, { useState } from 'react';
import { Booking } from './types';
import BookingCard from './Booking Card/BookingCard';
import CancelModal from './Modals/CancelModal';
import TransferModal from './Modals/TransferModal';

interface BookingHistoryProps {
  bookings: Booking[];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ bookings }) => {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Booking History</h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You don't have any bookings yet.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            isExpanded={expandedBooking === booking.id}
            onToggle={() => toggleExpand(booking.id)}
          />
        ))
      )}

      <CancelModal
        isOpen={showCancelModal}
        booking={selectedBooking}
        onClose={() => setShowCancelModal(false)}
        onCancel={(reason) => {
          console.log('Cancellation reason:', reason);
          setShowCancelModal(false);
        }}
      />

      <TransferModal
        isOpen={showTransferModal}
        booking={selectedBooking}
        onClose={() => setShowTransferModal(false)}
        onTransfer={(date, time) => {
          console.log('Rescheduled to:', date.toISOString(), time);
          setShowTransferModal(false);
        }}
      />
    </div>
  );
};

export default BookingHistory;