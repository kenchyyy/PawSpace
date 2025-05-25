// components/CancellationModal.tsx
import React from 'react';

interface CancellationModalProps {
    showCancelModal: boolean;
    cancelMessage: string;
    setCancelMessage: (message: string) => void;
    isSubmittingCancel: boolean;
    closeCancelModal: () => void;
    handleConfirmCancelBooking: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
    showCancelModal,
    cancelMessage,
    setCancelMessage,
    isSubmittingCancel,
    closeCancelModal,
    handleConfirmCancelBooking,
}) => {
    if (!showCancelModal) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="absolute inset-0 bg-black opacity-30 backdrop-filter blur-sm"></div>
            <div className="bg-white rounded-lg p-8 w-full max-w-md relative z-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Cancel Booking</h2>
                <p className="text-gray-700 mb-2">Please tell us why you are cancelling this booking:</p>
                <textarea
                    value={cancelMessage}
                    onChange={(e) => setCancelMessage(e.target.value)}
                    className="w-full p-2 border rounded text-gray-700 mb-4"
                    rows={4}
                    placeholder="Your reason for cancellation"
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={closeCancelModal}
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleConfirmCancelBooking}
                        disabled={isSubmittingCancel || cancelMessage.trim() === ''}
                        className={`bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmittingCancel || cancelMessage.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmittingCancel ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancellationModal;