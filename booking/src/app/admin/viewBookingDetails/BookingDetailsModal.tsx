
import React, { useRef, useEffect, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-200/75 flex justify-center items-center z-50 p-4 overflow-y-auto" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-lg relative" ref={modalRef}>
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 tracking-wide">Booking Details</h2>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;