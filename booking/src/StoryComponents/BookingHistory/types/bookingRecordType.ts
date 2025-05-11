export type BookingRecord = {
  bookingId: string;
  serviceType: string; // Will be populated after joining with the 'services' table
  petName: string;     // Will be populated after joining with the 'pets' table
  checkInDate: Date | string;
  checkOutDate: Date | string;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled' | 'Transferred';
  totalPrice: number | string;
  notes?: string;
  discountApplied?: boolean;
  dateBooked: Date | string; // Date the booking was made
  // Optional: Transfer Details
  transferDetails?: {
    newLocation?: string;
    transferDate?: Date | string;
    reason?: string;
  };
  // Optional: Cancellation Reason (could be in notes, or a separate field)
  cancellationReason?: string;
};