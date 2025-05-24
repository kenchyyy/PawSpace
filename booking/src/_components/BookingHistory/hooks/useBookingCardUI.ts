// hooks/useBookingCardUI.ts
import { useState } from 'react';

export const useBookingCardUI = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelMessage, setCancelMessage] = useState('');
    const [isSubmittingCancel, setIsSubmittingCancel] = useState(false); // Managed by the API hook, but UI needs access
    const [showCancelSuccessToast, setShowCancelSuccessToast] = useState(false);
    const [showCancelErrorToast, setShowCancelErrorToast] = useState(false);
    const [cancelErrorMessage, setCancelErrorMessage] = useState('');

    const toggleExpansion = () => {
        if (!showCancelModal) { // Prevent expansion when modal is open
            setIsExpanded(prev => !prev);
        }
    };

    const openCancelModal = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent card expansion when clicking cancel button
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setCancelMessage(''); // Clear message on close
    };

    const showCancelSuccessToastMessage = () => {
        setShowCancelSuccessToast(true);
        setTimeout(() => {
            setShowCancelSuccessToast(false);
            window.location.reload(); // Reload to reflect status change
        }, 2000);
    };

    const showCancelErrorToastMessage = (message: string) => {
        setCancelErrorMessage(message);
        setShowCancelErrorToast(true);
        setTimeout(() => {
            setShowCancelErrorToast(false);
        }, 3000);
    };

    return {
        isExpanded,
        showCancelModal,
        cancelMessage,
        setCancelMessage,
        isSubmittingCancel,
        setIsSubmittingCancel, // Expose setter for the cancellation hook
        showCancelSuccessToast,
        showCancelErrorToast,
        cancelErrorMessage,
        toggleExpansion,
        openCancelModal,
        closeCancelModal,
        showCancelSuccessToastMessage,
        showCancelErrorToastMessage,
    };
};