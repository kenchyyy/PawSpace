export type BookingRecord = {
    bookingId: string;
    serviceType: string; 
    petName: string;
    checkInDate: Date | string;
    checkOutDate: Date | string;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'transferred';
    totalPrice: number | string;
    notes?: string;
    discountApplied?: boolean;
    dateBooked: Date | string;

    transferDetails?: {
        newLocation?: string;
        transferDate?: Date | string;
        reason?: string;
    };

    cancellationReason?: string;
    ownerDetails: string;
};