// components/BookingCard.tsx
'use client';
import React, { useState } from 'react';
import { BookingRecord } from './types/bookingRecordType';
import { format } from 'date-fns';

interface BookingCardProps {
    booking: BookingRecord;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelMessage, setCancelMessage] = useState('');
    const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
    const [showCancelSuccessToast, setShowCancelSuccessToast] = useState(false);
    const [showCancelErrorToast, setShowCancelErrorToast] = useState(false);
    const [cancelErrorMessage, setCancelErrorMessage] = useState('');

    const publishDate = booking.date_booked instanceof Date ? format(booking.date_booked, 'yyyy-MM-dd') : booking.date_booked;
    const checkInDate = booking.service_date_start instanceof Date ? format(booking.service_date_start, 'yyyy-MM-dd') : booking.service_date_start;
    const checkOutDate = booking.service_date_end instanceof Date ? format(booking.service_date_end, 'yyyy-MM-dd') : booking.service_date_end;
    const today = new Date();
    const checkIn = booking.service_date_start instanceof Date ? booking.service_date_start : new Date(booking.service_date_start);
    const threeDaysBefore = new Date(checkIn);
    threeDaysBefore.setDate(checkIn.getDate() - 3);
    const isBeforeOrDuringStay = today <= (booking.service_date_end instanceof Date ? booking.service_date_end : new Date(booking.service_date_end));
    const canCancelBeforeThreeDays = booking.approvalStatus === 'approved' && today < threeDaysBefore;
    const isAfterStay = today > (booking.service_date_end instanceof Date ? booking.service_date_end : new Date(booking.service_date_end));
    const isPending = booking.status === 'pending';

    const accent = 'text-white';
    const textPrimary = 'text-white';
    const textSecondary = 'text-gray-300';

    const statusColor = () => {
        switch (booking.status) {
            case 'pending': return 'text-yellow-400';
            case 'confirmed': return 'text-green-400';
            case 'completed': return 'text-blue-300';
            case 'cancelled': return 'text-red-400';
            case 'onGoing': return 'text-orange-400';
            default: return textSecondary;
        }
    };

    const interactionIndicatorClass = () => {
        if (isBeforeOrDuringStay) {
            return 'border-l-4 border-green-500';
        } else if (isAfterStay) {
            return 'border-l-4 border-gray-500';
        }
        return '';
    };

    const toggleExpansion = () => {
        if (!showCancelModal) {
            setIsExpanded(!isExpanded);
        }
    };

    const openCancelModal = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setCancelMessage('');
    };

    const showCancelSuccessToastMessage = () => {
        setShowCancelSuccessToast(true);
        setTimeout(() => {
            setShowCancelSuccessToast(false);
            window.location.reload();
        }, 2000);
    };

    const showCancelErrorToastMessage = (message: string) => {
        setCancelErrorMessage(message);
        setShowCancelErrorToast(true);
        setTimeout(() => {
            setShowCancelErrorToast(false);
        }, 3000);
    };

    const handleConfirmCancelBooking = async () => {
        setIsSubmittingCancel(true);
        try {
            const response = await fetch('/api/history/cancel-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingId: booking.booking_uuid, cancelMessage: cancelMessage }),
            });

            const data = await response.json();

            if (response.ok) {
                showCancelSuccessToastMessage();
            } else {
                showCancelErrorToastMessage(data.message);
            }
        } catch (error: unknown) {
            console.error("Cancellation error:", error);
            showCancelErrorToastMessage('An unexpected error occurred during cancellation.');
        } finally {
            setIsSubmittingCancel(false);
            closeCancelModal();
        }
    };

    return (
        <div
            className={`
                bg-blue-900 rounded-lg font-sans shadow-lg cursor-pointer
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'p-6' : 'p-4'}
                ${interactionIndicatorClass()}
            `}
            onClick={toggleExpansion}
        >
            <h3 className={`${accent} ${isExpanded ? 'text-xl' : 'text-lg'} font-semibold mb-2`}>
                Booking ID: {booking.booking_uuid}
            </h3>

            {isExpanded && (
                <div className="space-y-2">
                    <p className={`${textSecondary} text-sm`}>Booked On: <span className={textPrimary}>{publishDate}</span></p>
                    <p className={`${textSecondary} text-sm`}>Check-in: <span className={textPrimary}>{checkInDate}</span></p>
                    <p className={`${textSecondary} text-sm`}>Check-out: <span className={textPrimary}>{checkOutDate}</span></p>
                    <p className={`${textSecondary} text-sm`}>Status: <span className={`${statusColor()} font-medium`}>{booking.status}</span></p>
                    {booking.approvalStatus && (
                        <p className={`${textSecondary} text-sm`}>Approval Status: <span className={`${booking.approvalStatus === 'approved' ? 'text-green-400' : 'text-yellow-400'} font-medium`}>{booking.approvalStatus}</span></p>
                    )}
                    {booking.cancellationReason && (
                        <p className={`${textSecondary} text-sm`}>Cancellation Reason: <span className={textPrimary}>{booking.cancellationReason}</span></p>
                    )}
                    <p className={`${textSecondary} text-sm`}>Special Requests: <span className={textPrimary}>{booking.special_requests || 'No special requests'}</span></p>
                    <p className={`${textSecondary} text-sm`}>Total Amount: <span className={`${accent} font-medium`}>{typeof booking.total_amount === 'number' ? `₱${booking.total_amount.toFixed(2)}` : booking.total_amount}</span></p>
                    {typeof booking.discount_applied === 'number' && (
                        <p className={`${textSecondary} text-sm`}>Discount Applied: <span className={textPrimary}>Yes</span></p>
                    )}
                    {booking.discount_applied === null && (
                        <p className={`${textSecondary} text-sm`}>Discount Applied: <span className={textPrimary}>No</span></p>
                    )}

                    {booking.owner_details && (
                        <div className="pt-2 border-t border-blue-800">
                            <h4 className={`${accent} text-lg font-semibold mb-1`}>Owner Details</h4>
                            <p className={`${textSecondary} text-sm`}>ID: <span className={textPrimary}>{booking.owner_details.id}</span></p>
                            <p className={`${textSecondary} text-sm`}>Name: <span className={textPrimary}>{booking.owner_details.name}</span></p>
                            <p className={`${textSecondary} text-sm`}>Address: <span className={textPrimary}>{booking.owner_details.address}</span></p>
                            <p className={`${textSecondary} text-sm`}>Contact: <span className={textPrimary}>{booking.owner_details.contact_number}</span></p>
                            <p className={`${textSecondary} text-sm`}>Email: <span className={textPrimary}>{booking.owner_details.email}</span></p>
                        </div>
                    )}

                    {booking.pets && booking.pets.length > 0 && (
                        <div className="pt-2 border-t border-blue-800">
                            <h4 className={`${accent} text-lg font-semibold mb-1`}>Pet Details</h4>
                            {booking.pets.map((pet) => (
                                <div key={pet.pet_uuid} className="mb-2 p-2 rounded-md bg-blue-800 last:mb-0"> {/* last:mb-0 removes margin from last pet */}
                                    <p className={`${textSecondary} text-sm`}>Pet ID: <span className={textPrimary}>{pet.pet_uuid}</span></p>
                                    <p className={`${textSecondary} text-sm`}>Name: <span className={textPrimary}>{pet.name}</span></p>
                                    <p className={`${textSecondary} text-sm`}>Type: <span className={textPrimary}>{pet.pet_type}</span></p>
                                    {pet.groom_service?.service_variant && (
                                        <p className={`${textSecondary} text-sm`}>Grooming: <span className={textPrimary}>{pet.groom_service.service_variant} (ID: {pet.groom_service.id})</span></p>
                                    )}
                                    {!pet.groom_service?.service_variant && pet.grooming_id && (
                                        <p className={`${textSecondary} text-sm`}>Grooming ID: <span className={textPrimary}>{pet.grooming_id} (Details not available)</span></p>
                                    )}
                                    {!pet.groom_service && !pet.grooming_id && (
                                        <p className={`${textSecondary} text-sm`}>Grooming: <span className={textPrimary}>Not applicable</span></p>
                                    )}
                                    {pet.boarding_pet?.boarding_type && (
                                        <p className={`${textSecondary} text-sm`}>Boarding: <span className={textPrimary}>{pet.boarding_pet.boarding_type} (ID: {pet.boarding_pet.id})</span></p>
                                    )}
                                    {!pet.boarding_pet?.boarding_type && pet.boarding_id_extension && (
                                        <p className={`${textSecondary} text-sm`}>Boarding ID: <span className={textPrimary}>{pet.boarding_id_extension} (Details not available)</span></p>
                                    )}
                                    {!pet.boarding_pet && !pet.boarding_id_extension && (
                                        <p className={`${textSecondary} text-sm`}>Boarding: <span className={textPrimary}>Not applicable</span></p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {(isPending || (isBeforeOrDuringStay && !isPending && canCancelBeforeThreeDays)) && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={openCancelModal}
                                disabled={isSubmittingCancel}
                                className={`bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmittingCancel ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmittingCancel ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showCancelModal && (
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
            )}

            {showCancelSuccessToast && (
                <div className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-4 rounded-md shadow-lg transition-opacity duration-300 ease-in-out">
                    Booking cancelled successfully!
                </div>
            )}

            {showCancelErrorToast && (
                <div className="fixed bottom-5 right-5 bg-red-500 text-white py-3 px-4 rounded-md shadow-lg transition-opacity duration-300 ease-in-out">
                    Cancellation failed: {cancelErrorMessage}
                </div>
            )}
        </div>
    );
};

export default BookingCard;