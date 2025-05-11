import { BookingRecord } from "./bookingRecordType";

export type AcceptedBookingRowProps = {
    booking: BookingRecord;
    onCheckIn?: (bookingId: string) => void;
    onTransfer?: (bookingId: string) => void;
};

export type CancelledRowProps = {
    booking: BookingRecord;
    onViewCancellationReason?: (bookingId: string) => void;
};

export type CompletedBookingRowProps = {
    booking: BookingRecord;
    onViewDetails?: (bookingId: string) => void;
};

export type PendingBookingRowProps = {
    booking: BookingRecord;
    onAccept: (bookingId: string) => void;
    onCancel: (bookingId: string) => void;
};

export type TransferedBookingRowProps = {
    booking: BookingRecord;
    onViewTransferDetails?: (bookingId: string) => void;
};