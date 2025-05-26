// // components/BookingCard.tsx
// 'use client';
// import React, { useState } from 'react';
// import { BookingRecord } from './types/bookingRecordType';
// import { format } from 'date-fns';
// import OwnerDetails from './OwnerDetails';
// import PetDetails from './PetDetails';
// import ServiceDetails from './ServiceDetails';
// import MealInstructions from './MealInstructions';
// import CancellationModal from './CancellationModal';
// import ToastMessage from './ToastMessage'; 

// interface BookingCardProps {
//     booking: BookingRecord;
// }

// const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [showCancelModal, setShowCancelModal] = useState(false);
//     const [cancelMessage, setCancelMessage] = useState('');
//     const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
//     const [showCancelSuccessToast, setShowCancelSuccessToast] = useState(false);
//     const [showCancelErrorToast, setShowCancelErrorToast] = useState(false);
//     const [cancelErrorMessage, setCancelErrorMessage] = useState('');

//     const toDate = (dateValue: Date | string | undefined | null): Date | null => {
//         if (!dateValue) return null;
//         if (dateValue instanceof Date) return dateValue;
//         const parsedDate = new Date(dateValue);
//         return isNaN(parsedDate.getTime()) ? null : parsedDate;
//     };

//     const rawBookedDate = toDate(booking.date_booked);
//     const rawServiceStart = toDate(booking.service_date_start);
//     const rawServiceEnd = toDate(booking.service_date_end);
//     const publishDate = rawBookedDate ? format(rawBookedDate, 'MMMM dd, yyyy') : 'N/A';

//     const checkInDateTime = (() => {
//         if (rawServiceStart) {
//             const formattedDate = format(rawServiceStart, 'MMM dd');
//             const checkInTime = booking.pets?.[0]?.boarding_pet?.check_in_time;
//             let formattedTime = '';
//             if (checkInTime) {
//                 try {
//                     formattedTime = format(new Date(`2000-01-01T${checkInTime}`), 'h:mm a');
//                 } catch {
//                     formattedTime = checkInTime;
//                 }
//             }
//             return formattedTime ? `${formattedDate} ${formattedTime}` : formattedDate;
//         }
//         return 'N/A';
//     })();

//     const checkOutDateTime = (() => {
//         if (rawServiceEnd) {
//             const formattedDate = format(rawServiceEnd, 'MMM dd, yyyy');
//             const checkOutTime = booking.pets?.[0]?.boarding_pet?.check_out_time;
//             let formattedTime = '';
//             if (checkOutTime) {
//                 try {
//                     formattedTime = format(new Date(`2000-01-01T${checkOutTime}`), 'h:mm a');
//                 } catch {
//                     formattedTime = checkOutTime;
//                 }
//             }
//             return formattedTime ? `${formattedDate} ${formattedTime}` : formattedDate;
//         }
//         return 'N/A';
//     })();

//     const now = new Date();

//     const daysBetween = (d1: Date, d2: Date) => {
//         const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
//         const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
//         return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
//     };

//     const isPending = booking.status === 'pending';
//     const isPastBooking = rawServiceStart ? daysBetween(rawServiceStart, now) < 0 : false;
//     const isCheckInLessThan3Days = rawServiceStart ? daysBetween(rawServiceStart, now) < 3 : false;
//     const disableCancel = isPending && (isPastBooking || isCheckInLessThan3Days);

//     const isBeforeOrDuringStay = rawServiceEnd ? now <= rawServiceEnd : false;
//     const isAfterStay = rawServiceEnd ? now > rawServiceEnd : false;
//     const accent = 'text-white';
//     const textPrimary = 'text-white';
//     const textSecondary = 'text-yellow-300';

//     const statusDotColor =
//         booking.status === 'pending' ? 'bg-amber-500' :
//         booking.status === 'confirmed' ? 'bg-green-500' :
//         booking.status === 'completed' ? 'bg-blue-500' :
//         booking.status === 'cancelled' ? 'bg-red-500' :
//         booking.status === 'ongoing' ? 'bg-orange-400' :
//         'bg-gray-400';

//     let serviceType = '';
//     if (booking.pets && booking.pets.length > 0) {
//         const hasGroom = booking.pets.some(pet => pet.groom_service);
//         const boardingPets = booking.pets.filter(pet => pet.boarding_pet);
//         const hasBoard = boardingPets.length > 0;

//         let boardingTypeLabel = '';
//         if (hasBoard) {
//             const boardingType = boardingPets[0].boarding_pet?.boarding_type?.toLowerCase() || '';
//             if (boardingType === 'overnight') {
//                 boardingTypeLabel = 'Overnight Boarding';
//             } else if (boardingType === 'day') {
//                 boardingTypeLabel = 'Day Boarding';
//             } else {
//                 boardingTypeLabel = 'Boarding';
//             }
//         }

//         if (hasGroom && hasBoard) {
//             serviceType = `Grooming & ${boardingTypeLabel}`;
//         } else if (hasGroom) {
//             serviceType = 'Grooming';
//         } else if (hasBoard) {
//             serviceType = boardingTypeLabel;
//         } else {
//             serviceType = 'Other';
//         }
//     }

//     const interactionIndicatorClass = () => {
//         if (isBeforeOrDuringStay) {
//             return 'border-l-4 border-green-500';
//         } else if (isAfterStay) {
//             return 'border-l-4 border-gray-500';
//         }
//         return '';
//     };

//     const toggleExpansion = () => {
//         if (!showCancelModal) {
//             setIsExpanded(!isExpanded);
//         }
//     };

//     const openCancelModal = (event: React.MouseEvent) => {
//         event.stopPropagation();
//         setShowCancelModal(true);
//     };

//     const closeCancelModal = () => {
//         setShowCancelModal(false);
//         setCancelMessage('');
//     };

//     const showCancelSuccessToastMessage = () => {
//         setShowCancelSuccessToast(true);
//         setTimeout(() => {
//             setShowCancelSuccessToast(false);
//             window.location.reload();
//         }, 2000);
//     };

//     const showCancelErrorToastMessage = (message: string) => {
//         setCancelErrorMessage(message);
//         setShowCancelErrorToast(true);
//         setTimeout(() => {
//             setShowCancelErrorToast(false);
//         }, 3000);
//     };

//     const handleConfirmCancelBooking = async () => {
//         setIsSubmittingCancel(true);
//         try {
//             const response = await fetch('/api/history/cancel-booking', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ bookingId: booking.booking_uuid, cancelMessage: cancelMessage }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 showCancelSuccessToastMessage();
//             } else {
//                 showCancelErrorToastMessage(data.message);
//             }
//         } catch (error: unknown) {
//             console.error("Cancellation error:", error);
//             showCancelErrorToastMessage('An unexpected error occurred during cancellation.');
//         } finally {
//             setIsSubmittingCancel(false);
//             closeCancelModal();
//         }
//     };

//     const formattedGroomServiceTime = (() => {
//         const serviceTime = booking.pets?.[0]?.groom_service?.service_time;
//         if (serviceTime) {
//             try {
//                 return format(new Date(`2000-01-01T${serviceTime}`), 'h:mm a');
//             } catch {
//                 return serviceTime;
//             }
//         }
//         return 'N/A';
//     })();


//     return (
//         <div
//             className={`
//                 bg-purple-900 rounded-lg font-sans shadow-lg cursor-pointer
//                 overflow-hidden transition-all duration-300 ease-in-out
//                 ${isExpanded ? 'p-6' : 'p-4'}
//                 ${interactionIndicatorClass()}
//             `}
//             onClick={toggleExpansion}
//         >
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 min-w-0">
//                 <div className="flex flex-col md:flex-row items-start md:items-center min-w-0 w-full md:w-auto">
//                     <div className="w-full md:w-36 flex-shrink-0 flex justify-center md:justify-center mb-2 md:mb-0">
//                         {serviceType && (
//                             <div
//                                 className={
//                                     "px-2 py-1 rounded-full text-xs font-bold shadow w-full text-center " +
//                                     (serviceType === "Grooming & Overnight Boarding"
//                                         ? "bg-blue-600 text-white"
//                                         : serviceType === "Grooming & Day Boarding"
//                                         ? "bg-blue-500 text-white"
//                                         : serviceType === "Grooming"
//                                         ? "bg-pink-500 text-white"
//                                         : serviceType === "Overnight Boarding"
//                                         ? "bg-green-600 text-white"
//                                         : serviceType === "Day Boarding"
//                                         ? "bg-green-400 text-white"
//                                         : serviceType === "Boarding"
//                                         ? "bg-green-500 text-white"
//                                         : "bg-gray-400 text-white")
//                                 }
//                             >
//                                 {serviceType}
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex flex-col leading-tight md:ml-2 min-w-0 flex-grow w-full md:w-auto">
//                         <div className="text-yellow-200 text-sm font-semibold truncate">
//                             <p className='text-2xl'> {booking.pets && booking.pets.length > 0 ? booking.pets[0].name : "N/A"} </p>
//                         </div>

//                         {booking.pets && booking.pets.length > 0 && booking.pets[0].groom_service?.service_time && (
//                             <div className="text-green-300 text-xs italic truncate">
//                                 Service Time: {formattedGroomServiceTime}
//                             </div>
//                         )}

//                         {booking.pets && booking.pets.length > 0 && booking.pets[0].boarding_pet && (
//                             <div className="text-green-300 text-xs italic truncate">
//                                 Check-in: {checkInDateTime} <br />
//                                 Check-out: {checkOutDateTime}
//                             </div>
//                         )}

//                         <div className="text-white text-xs truncate"> Booked Date: {publishDate}</div>
//                     </div>
//                 </div>

//                 <div className="flex items-center space-x-2 flex-shrink-0 mt-2 md:mt-0 min-w-0 max-w-[40%]">
//                     <div
//                         className={`w-3 h-3 rounded-full ${statusDotColor} shadow flex-shrink-0`}
//                         title={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                         aria-label={`Booking status: ${booking.status}`}
//                     />
//                     <div className="text-white text-xs font-semibold capitalize truncate max-w-[70px]">
//                         {booking.status}
//                     </div>
//                 </div>
//             </div>

//             {isExpanded && (
//                 <div className="pt-4 border-t border-purple-800 mt-2">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <OwnerDetails ownerDetails={booking.owner_details} />
//                         <PetDetails pets={booking.pets} />
//                         <ServiceDetails
//                             cancellationReason={booking.cancellationReason}
//                             pets={booking.pets}
//                             specialRequests={booking.special_requests}
//                         />
//                     </div>

//                     <MealInstructions pets={booking.pets} />

//                     <div className="mt-4 p-3 rounded-md bg-purple-800 flex justify-between items-center">
//                         <div>
//                             {typeof booking.discount_applied === 'number' && booking.discount_applied > 0 ? (
//                                 <p className={`${textSecondary} text-sm`}>
//                                     Discount Applied: <span className={textPrimary}>{booking.discount_applied}%</span>
//                                 </p>
//                             ) : (
//                                 <p className={`${textSecondary} text-sm`}>
//                                     Discount Applied: <span className={textPrimary}>None</span>
//                                 </p>
//                             )}
//                         </div>
//                         <div>
//                             <p className={`${textSecondary} text-lg`}>Total Amount: <span className={`${accent} font-bold text-xl`}>{typeof booking.total_amount === 'number' ? `₱${booking.total_amount.toFixed(2)}` : booking.total_amount}</span></p>
//                         </div>
//                     </div>


//                     {isPending && (
//                         <div className="mt-4 flex flex-col items-end space-y-1">
//                             <button
//                                 onClick={openCancelModal}
//                                 disabled={isSubmittingCancel || disableCancel}
//                                 className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
//                                     ${isSubmittingCancel || disableCancel ? 'opacity-50 cursor-not-allowed' : ''}
//                                 `}
//                             >
//                                 {isSubmittingCancel ? 'Cancelling...' : 'Cancel Booking'}
//                             </button>
//                             {disableCancel && (
//                                 <p className="text-red-400 text-sm italic mt-1">
//                                     {isPastBooking
//                                         ? 'This booking is already past.'
//                                         : 'Cannot cancel booking when it is less than 3 days before the booking starts.'}
//                                 </p>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             )}

//             <CancellationModal
//                 showCancelModal={showCancelModal}
//                 cancelMessage={cancelMessage}
//                 setCancelMessage={setCancelMessage}
//                 isSubmittingCancel={isSubmittingCancel}
//                 closeCancelModal={closeCancelModal}
//                 handleConfirmCancelBooking={handleConfirmCancelBooking}
//             />

//             <ToastMessage
//                 show={showCancelSuccessToast}
//                 message="Booking cancelled successfully!"
//                 type="success"
//             />
//             <ToastMessage
//                 show={showCancelErrorToast}
//                 message={`Cancellation failed: ${cancelErrorMessage}`}
//                 type="error"
//             />
//         </div>
//     );
// };

// export default BookingCard;


// components/BookingCard.tsx
'use client';
import React, { useState } from 'react';
import { BookingRecord } from './types/bookingRecordType';
import { format } from 'date-fns';
import OwnerDetails from './OwnerDetails';
import PetDetails from './PetDetails';
import ServiceDetails from './ServiceDetails';
import MealInstructions from './MealInstructions';
import CancellationModal from './CancellationModal';
import ToastMessage from './ToastMessage'; 

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

    const toDate = (dateValue: Date | string | undefined | null): Date | null => {
        if (!dateValue) return null;
        if (dateValue instanceof Date) return dateValue;
        const parsedDate = new Date(dateValue);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    const rawBookedDate = toDate(booking.date_booked);
    const rawServiceStart = toDate(booking.service_date_start);
    const rawServiceEnd = toDate(booking.service_date_end);
    const publishDate = rawBookedDate ? format(rawBookedDate, 'MMMM dd, yyyy') : 'N/A';

    // NEW LOGIC FOR BOARDING CHECK-IN/CHECK-OUT DISPLAY
    const boardingPeriod = (() => {
        const checkInDate = rawServiceStart;
        const checkOutDate = rawServiceEnd;
        const checkInTime = booking.pets?.[0]?.boarding_pet?.check_in_time;
        const checkOutTime = booking.pets?.[0]?.boarding_pet?.check_out_time;

        if (checkInDate && checkOutDate) {
            let formattedCheckInTime = '';
            if (checkInTime) {
                try {
                    formattedCheckInTime = format(new Date(`2000-01-01T${checkInTime}`), 'h:mm a');
                } catch {
                    formattedCheckInTime = checkInTime;
                }
            }

            let formattedCheckOutTime = '';
            if (checkOutTime) {
                try {
                    formattedCheckOutTime = format(new Date(`2000-01-01T${checkOutTime}`), 'h:mm a');
                } catch {
                    formattedCheckOutTime = checkOutTime;
                }
            }

            const formattedCheckInDate = format(checkInDate, 'MMM dd, yyyy');
            const formattedCheckOutDate = format(checkOutDate, 'MMM dd, yyyy');

            return `${formattedCheckInDate} ${formattedCheckInTime} - ${formattedCheckOutDate} ${formattedCheckOutTime}`;
        }
        return null;
    })();

    const now = new Date();

    const daysBetween = (d1: Date, d2: Date) => {
        const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
        const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
        return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
    };

    const isPending = booking.status === 'pending';
    const isPastBooking = rawServiceStart ? daysBetween(rawServiceStart, now) < 0 : false;
    const isCheckInLessThan3Days = rawServiceStart ? daysBetween(rawServiceStart, now) < 3 : false;
    const disableCancel = isPending && (isPastBooking || isCheckInLessThan3Days);

    const isBeforeOrDuringStay = rawServiceEnd ? now <= rawServiceEnd : false;
    const isAfterStay = rawServiceEnd ? now > rawServiceEnd : false;
    const accent = 'text-white';
    const textPrimary = 'text-white';
    const textSecondary = 'text-yellow-300';

    const statusDotColor =
        booking.status === 'pending' ? 'bg-amber-500' :
        booking.status === 'confirmed' ? 'bg-green-500' :
        booking.status === 'completed' ? 'bg-blue-500' :
        booking.status === 'cancelled' ? 'bg-red-500' :
        booking.status === 'ongoing' ? 'bg-orange-400' :
        'bg-gray-400';

    let serviceType = '';
    if (booking.pets && booking.pets.length > 0) {
        const hasGroom = booking.pets.some(pet => pet.groom_service);
        const boardingPets = booking.pets.filter(pet => pet.boarding_pet);
        const hasBoard = boardingPets.length > 0;

        let boardingTypeLabel = '';
        if (hasBoard) {
            const boardingType = boardingPets[0].boarding_pet?.boarding_type?.toLowerCase() || '';
            if (boardingType === 'overnight') {
                boardingTypeLabel = 'Overnight Boarding';
            } else if (boardingType === 'day') {
                boardingTypeLabel = 'Day Boarding';
            } else {
                boardingTypeLabel = 'Boarding';
            }
        }

        if (hasGroom && hasBoard) {
            serviceType = `Grooming & ${boardingTypeLabel}`;
        } else if (hasGroom) {
            serviceType = 'Grooming';
        } else if (hasBoard) {
            serviceType = boardingTypeLabel;
        } else {
            serviceType = 'Other';
        }
    }

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

    const formattedGroomServiceDateTime = (() => {
        const serviceDate = rawServiceStart;
        const serviceTime = booking.pets?.[0]?.groom_service?.service_time;

        if (serviceDate && serviceTime) {
            try {
                const formattedDate = format(serviceDate, 'MMM dd, yyyy');
                const formattedTime = format(new Date(`2000-01-01T${serviceTime}`), 'h:mm a');
                return `${formattedDate} - ${formattedTime}`;
            } catch {
                return `${format(serviceDate, 'MMM dd, yyyy')} - ${serviceTime}`;
            }
        }
        return null; 
    })();


    return (
        <div
            className={`
                bg-purple-900 rounded-lg font-sans shadow-lg cursor-pointer
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'p-6' : 'p-4'}
                ${interactionIndicatorClass()}
            `}
            onClick={toggleExpansion}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 min-w-0">
                <div className="flex flex-col md:flex-row items-start md:items-center min-w-0 w-full md:w-auto">
                    <div className="w-full md:w-36 flex-shrink-0 flex justify-center md:justify-center mb-2 md:mb-0">
                        {serviceType && (
                            <div
                                className={
                                    "px-2 py-1 rounded-full text-xs font-bold shadow w-full text-center " +
                                    (serviceType === "Grooming & Overnight Boarding"
                                        ? "bg-blue-600 text-white"
                                        : serviceType === "Grooming & Day Boarding"
                                        ? "bg-blue-500 text-white"
                                        : serviceType === "Grooming"
                                        ? "bg-pink-500 text-white"
                                        : serviceType === "Overnight Boarding"
                                        ? "bg-green-600 text-white"
                                        : serviceType === "Day Boarding"
                                        ? "bg-green-400 text-white"
                                        : serviceType === "Boarding"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-400 text-white")
                                }
                            >
                                {serviceType}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col leading-tight md:ml-2 min-w-0 flex-grow w-full md:w-auto">
                        <div className="text-yellow-200 text-sm font-semibold truncate">
                            <p className='text-2xl'> {booking.pets && booking.pets.length > 0 ? booking.pets[0].name : "N/A"} </p>
                        </div>

                        {booking.pets && booking.pets.some(pet => pet.groom_service) && formattedGroomServiceDateTime && (
                            <div className="text-green-300 text-xs italic truncate">
                                {formattedGroomServiceDateTime}
                            </div>
                        )}

                        {booking.pets && booking.pets.some(pet => pet.boarding_pet) && boardingPeriod && (
                            <div className="text-green-300 text-xs italic truncate">
                                {boardingPeriod}
                            </div>
                        )}

                        <div className="text-white text-xs truncate"> Booked Date: {publishDate}</div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0 mt-2 md:mt-0 min-w-0 max-w-[40%]">
                    <div
                        className={`w-3 h-3 rounded-full ${statusDotColor} shadow flex-shrink-0`}
                        title={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        aria-label={`Booking status: ${booking.status}`}
                    />
                    <div className="text-white text-xs font-semibold capitalize truncate max-w-[70px]">
                        {booking.status}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="pt-4 border-t border-purple-800 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <OwnerDetails ownerDetails={booking.owner_details} />
                        <PetDetails pets={booking.pets} />
                        <ServiceDetails
                            cancellationReason={booking.cancellationReason}
                            pets={booking.pets}
                            specialRequests={booking.special_requests}
                        />
                    </div>

                    <MealInstructions pets={booking.pets} />

                    <div className="mt-4 p-3 rounded-md bg-purple-800 flex justify-between items-center">
                        <div>
                            {typeof booking.discount_applied === 'number' && booking.discount_applied > 0 ? (
                                <p className={`${textSecondary} text-sm`}>
                                    Discount Applied: <span className={textPrimary}>{booking.discount_applied}%</span>
                                </p>
                            ) : (
                                <p className={`${textSecondary} text-sm`}>
                                    Discount Applied: <span className={textPrimary}>None</span>
                                </p>
                            )}
                        </div>
                        <div>
                            <p className={`${textSecondary} text-lg`}>Total Amount: <span className={`${accent} font-bold text-xl`}>{typeof booking.total_amount === 'number' ? `₱${booking.total_amount.toFixed(2)}` : booking.total_amount}</span></p>
                        </div>
                    </div>


                    {isPending && (
                        <div className="mt-4 flex flex-col items-end space-y-1">
                            <button
                                onClick={openCancelModal}
                                disabled={isSubmittingCancel || disableCancel}
                                className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                                    ${isSubmittingCancel || disableCancel ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {isSubmittingCancel ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                            {disableCancel && (
                                <p className="text-red-400 text-sm italic mt-1">
                                    {isPastBooking
                                        ? 'This booking is already past.'
                                        : 'Cannot cancel booking when it is less than 3 days before the booking starts.'}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <CancellationModal
                showCancelModal={showCancelModal}
                cancelMessage={cancelMessage}
                setCancelMessage={setCancelMessage}
                isSubmittingCancel={isSubmittingCancel}
                closeCancelModal={closeCancelModal}
                handleConfirmCancelBooking={handleConfirmCancelBooking}
            />

            <ToastMessage
                show={showCancelSuccessToast}
                message="Booking cancelled successfully!"
                type="success"
            />
            <ToastMessage
                show={showCancelErrorToast}
                message={`Cancellation failed: ${cancelErrorMessage}`}
                type="error"
            />
        </div>
    );
};

export default BookingCard;