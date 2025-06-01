import React from "react";
import { FiCheckCircle } from "react-icons/fi";

interface BookingSuccessModalProps {
  showSuccess: boolean;
  bookingId?: string;
  onClose: (bookingId?: string) => void;
}

const PawAnimation = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-2 animate-bounce" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="48" rx="14" ry="8" fill="#FBBF24" />
    <ellipse cx="18" cy="38" rx="4" ry="6" fill="#FBBF24" />
    <ellipse cx="46" cy="38" rx="4" ry="6" fill="#FBBF24" />
    <ellipse cx="24" cy="28" rx="3" ry="4" fill="#FBBF24" />
    <ellipse cx="40" cy="28" rx="3" ry="4" fill="#FBBF24" />
    <ellipse cx="32" cy="38" rx="6" ry="8" fill="#F59E42" />
  </svg>
);

const Sparkles = () => (
  <svg width="80" height="30" viewBox="0 0 80 30" fill="none" className="absolute top-0 left-1/2 -translate-x-1/2" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="2" fill="#FDE68A" />
    <circle cx="30" cy="5" r="1.5" fill="#FBBF24" />
    <circle cx="50" cy="12" r="2.5" fill="#FDE68A" />
    <circle cx="70" cy="8" r="1.2" fill="#FBBF24" />
    <circle cx="60" cy="20" r="1.8" fill="#FDE68A" />
  </svg>
);

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ showSuccess, bookingId, onClose }) => {
  if (!showSuccess) return null;

  const handleRedirect = () => {
    onClose(bookingId);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fade-in-modal">
      <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-8 rounded-3xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100 relative overflow-visible">
        <Sparkles />
        <div className="flex flex-col items-center text-center">
          <PawAnimation />
          <h3 className="text-2xl font-bold text-purple-700 mb-3 font-cute">Booking Confirmed!</h3>
          <p className="text-gray-700 mb-6 text-base">
            Your pet's reservation has been <span className="font-semibold text-pink-500">successfully created</span>!
            {bookingId && <span className="block mt-1 text-xs text-purple-500">Booking ID: <span className="font-semibold">{bookingId}</span></span>}
          </p>
          <button
            onClick={handleRedirect}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-400 to-yellow-300 text-purple-900 font-bold rounded-full hover:from-pink-500 hover:to-yellow-400 transition-colors duration-200 shadow-md"
          >
            Yay! Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;