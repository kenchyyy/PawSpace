export type BookingRecord = {
    bookingId: string;
    checkInDate: Date | string;
    checkOutDate: Date | string;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'transferred' | 'pending_transfer';
    totalPrice: number | string;
    notes?: string;
    discountApplied?: boolean;
    dateBooked: Date | string;
    approvalStatus?: 'pending' | 'approved' | 'rejected';

    transferDetails?: {
        newLocation?: string;
        transferDate?: Date | string;
        reason?: string;
    };

    cancellationReason?: string;
    ownerDetails: string;
};