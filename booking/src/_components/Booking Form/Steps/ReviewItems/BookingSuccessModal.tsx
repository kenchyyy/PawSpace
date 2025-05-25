import React from "react";
import { FiCheckCircle } from "react-icons/fi";

interface BookingSuccessModalProps {
  showSuccess: boolean;
  bookingId?: string;
  onClose: (bookingId?: string) => void;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ showSuccess, bookingId, onClose }) => {
  if (!showSuccess) return null;

  const handleRedirect = () => {
    onClose(bookingId);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fade-in-modal">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex flex-col items-center text-center">
          <FiCheckCircle className="text-green-500 text-6xl mb-5 animate-bounce-in" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600 mb-6 text-base">
            Your pet's reservation has been successfully created.
            {bookingId && <p>Booking ID: <span className="font-semibold">{bookingId}</span></p>}
          </p>
          <button
            onClick={handleRedirect}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;