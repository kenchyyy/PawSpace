// hooks/useCancelBooking.ts
// Consider using Next.js Server Actions for safer, direct DB interaction
// instead of a separate API route if applicable.
// For now, keeping the fetch to the existing API route.

interface UseCancelBookingProps {
    bookingId: string;
    cancelMessage: string;
    setIsSubmitting: (loading: boolean) => void;
    onSuccess: () => void;
    onError: (message: string) => void;
    onComplete: () => void;
}

export const useCancelBooking = ({
    bookingId,
    cancelMessage,
    setIsSubmitting,
    onSuccess,
    onError,
    onComplete,
}: UseCancelBookingProps) => {

    const confirmCancelBooking = async () => {
        setIsSubmitting(true); // Indicate submission start
        try {
            // Using your existing API route
            const response = await fetch('/api/history/cancel-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingId, cancelMessage }),
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess();
            } else {
                onError(data.message || 'Unknown error');
            }
        } catch (error: unknown) {
            console.error("Cancellation error:", error);
            onError('An unexpected error occurred during cancellation.');
        } finally {
            setIsSubmitting(false); // Indicate submission end
            onComplete();
        }
    };

    return {
        confirmCancelBooking,
    };
};