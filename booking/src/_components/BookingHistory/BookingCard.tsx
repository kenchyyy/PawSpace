'use client';
import React, { useState } from 'react';
import { BookingCardProps } from './types/bookingRecordsInterface';
import { format } from 'date-fns';

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null); // State for rating

  const publishDate = booking.dateBooked instanceof Date ? format(booking.dateBooked, 'yyyy-MM-dd') : booking.dateBooked;
  const checkInDate = booking.checkInDate instanceof Date ? format(booking.checkInDate, 'yyyy-MM-dd') : booking.checkInDate;
  const checkOutDate = booking.checkOutDate instanceof Date ? format(booking.checkOutDate, 'yyyy-MM-dd') : booking.checkOutDate;
  const today = new Date();
  const checkIn = booking.checkInDate instanceof Date ? booking.checkInDate : new Date(booking.checkInDate);
  const threeDaysBefore = new Date(checkIn);
  threeDaysBefore.setDate(checkIn.getDate() - 3);

  const isBeforeOrDuringStay = today <= (booking.checkOutDate instanceof Date ? booking.checkOutDate : new Date(booking.checkOutDate));
  const canCancelBeforeThreeDays = booking.approvalStatus === 'approved' && today < threeDaysBefore;
  const isWithinThreeDays = booking.approvalStatus === 'approved' && today >= threeDaysBefore && today <= checkIn;
  const isAfterStay = today > (booking.checkOutDate instanceof Date ? booking.checkOutDate : new Date(booking.checkOutDate));
  const isPendingApproval = booking.approvalStatus === 'pending';
  const isTransferred = booking.status === 'transferred';
  const isCompleted = booking.status === 'completed';

  const accent = 'text-white';
  const textPrimary = 'text-white';
  const textSecondary = 'text-gray-300';

  const statusColor = () => {
    switch (booking.status) {
      case 'pending':
        return 'text-yellow-400';
      case 'accepted':
        return 'text-green-400';
      case 'completed':
        return 'text-blue-300';
      case 'cancelled':
        return 'text-red-400';
      case 'transferred':
        return 'text-purple-400';
      case 'pending_transfer':
        return 'text-orange-400';
      default:
        return textSecondary;
    }
  };

  const interactionIndicatorClass = () => {
    if (isTransferred) {
      return 'border-l-4 border-purple-500';
    } else if (isBeforeOrDuringStay) {
      return 'border-l-4 border-green-500';
    } else if (isAfterStay) {
      return 'border-l-4 border-gray-500';
    }
    return '';
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason !== null) {
      const response = await fetch('/api/history/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId: booking.bookingId, cancellationReason: reason }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        window.location.reload();
      } else {
        alert(`Cancellation failed: ${data.message}`);
      }
    }
    setIsCancelling(false);
  };

  const handleRequestTransfer = async () => {
    setIsTransferring(true);
    const reason = prompt('Please provide a reason for transfer/reschedule:');
    if (reason !== null) {
      const response = await fetch('/api/history/request-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId: booking.bookingId, transferDetails: { reason } }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        window.location.reload();
      } else {
        alert(`Transfer request failed: ${data.message}`);
      }
    }
    setIsTransferring(false);
  };

  const handleSendFeedbackWithRating = async () => {
    setIsSubmittingFeedback(true);
    if (feedbackText.trim() !== '' && selectedRating !== null) {
      const response = await fetch('/api/history/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback_booking_uuid: booking.bookingId,
          feedback_message: feedbackText,
          rating_score: selectedRating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setShowFeedbackInput(false);
        setFeedbackText('');
        setSelectedRating(null);
        // Optionally, update the UI or refetch data
      } else {
        alert(`Failed to submit feedback: ${data.message}`);
      }
    } else {
      alert('Please provide both feedback and a rating.');
    }
    setIsSubmittingFeedback(false);
  };

  const handleDeleteBooking = async () => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/history/delete-booking?bookingId=${booking.bookingId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          let errorMessage = `Failed to delete booking (status: ${response.status})`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage += `: ${errorData.message}`;
            }
          } catch (e) {
            console.error("Error parsing error JSON:", e);
          }
          alert(errorMessage);
        } else {
          try {
            const data = await response.json();
            alert(data.message || 'Booking deleted successfully');
            window.location.reload();
          } catch (e) {
            console.error("Error parsing success JSON:", e);
            alert('Booking deleted successfully');
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert('An error occurred while trying to delete the booking.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`bg-blue-900 rounded-lg p-6 shadow-lg ${interactionIndicatorClass()}`}>
      <h3 className={`${accent} text-xl font-semibold mb-2`}>Booking ID: {booking.bookingId}</h3>
      <p className={`${textSecondary} text-sm mb-1`}>Booked On: <span className={textPrimary}>{publishDate}</span></p>
      <p className={`${textSecondary} text-sm mb-1`}>Check-in: <span className={textPrimary}>{checkInDate}</span></p>
      <p className={`${textSecondary} text-sm mb-1`}>Check-out: <span className={textPrimary}>{checkOutDate}</span></p>
      <p className={`${textSecondary} text-sm mb-2`}>Status: <span className={`${statusColor()} font-medium`}>{booking.status}</span></p>
      {booking.approvalStatus && (
        <p className={`${textSecondary} text-sm mb-2`}>Approval Status: <span className={`${booking.approvalStatus === 'approved' ? 'text-green-400' : 'text-yellow-400'} font-medium`}>{booking.approvalStatus}</span></p>
      )}
      <p className={`${textSecondary} text-sm mb-1`}>Special Requests: <span className={textPrimary}>{booking.notes || 'No special requests'}</span></p>
      <p className={`${textSecondary} text-sm mb-1`}>Total Amount: <span className={`${accent} font-medium`}>{typeof booking.totalPrice === 'number' ? `₱${booking.totalPrice.toFixed(2)}` : booking.totalPrice}</span></p>
      <p className={`${textSecondary} text-sm mb-1`}>Discount Applied: <span className={textPrimary}>{booking.discountApplied ? 'Yes' : 'No'}</span></p>
      <p className={`${textSecondary} text-sm`}>Owner Details: <span className={textPrimary}>{booking.ownerDetails || 'No owner details'}</span></p>

      {isBeforeOrDuringStay && !isTransferred && (
        <div className="mt-4 flex space-x-2">
          {canCancelBeforeThreeDays && (
            <button
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isCancelling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
          {isWithinThreeDays && !isTransferred && (
            <button
              onClick={handleRequestTransfer}
              disabled={isTransferring}
              className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isTransferring ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isTransferring ? 'Requesting...' : 'Request Transfer/Reschedule'}
            </button>
          )}
        </div>
      )}

      {isAfterStay && !isTransferred && isCompleted && (
        <div className="mt-4">
          <button onClick={() => setShowFeedbackInput(true)} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmittingFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isSubmittingFeedback ? 'Submitting...' : 'Send Feedback'}
          </button>
          {showFeedbackInput && (
            <div className="mt-4">
              <h3>Rate your experience:</h3>
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="mr-4">
                    <input
                      type="radio"
                      name={`rating_${booking.bookingId}`}
                      value={rating}
                      checked={selectedRating === rating}
                      onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                      className="mr-1"
                    />
                    {rating}
                  </label>
                ))}
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Please provide your feedback:"
                className="w-full p-2 border rounded text-black"
              />
              <div className="mt-2 flex space-x-2">
                <button onClick={handleSendFeedbackWithRating} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Submit Feedback
                </button>
                <button onClick={() => setShowFeedbackInput(false)} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Cancel
                </button>
              </div>
            </div>
          )}
          <button
            onClick={handleDeleteBooking}
            disabled={isDeleting}
            className={`mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}

      {isPendingApproval && (
        <div className="mt-4">
          <button
            onClick={handleCancelBooking}
            disabled={isCancelling}
            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isCancelling ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        </div>
      )}

      {isTransferred && (
        <div className="mt-4">
          <span className="text-purple-400 font-semibold">Transferred</span>
        </div>
      )}
    </div>
  );
};

export default BookingCard;