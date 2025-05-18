import { BookingRecord } from './bookingRecordType';

export interface BookingCardProps {
    booking: BookingRecord;
}

export interface BookingHistoryClientProps {
    bookings: BookingRecord[] | null | undefined;
    loading: boolean;
    error: Error | null;
    totalCount: number | null;
}