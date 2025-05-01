
/* 
MESSAGE FROM CLYDE

WARNING: THIS FILE IS A TEMPORARY FIX. IT WILL BE CHANGED AND REFACTORED IN THE FUTURE ONCE IT IS FULLY CONNECTED TO THE DATABASE. 
DO NOT USE THIS AS A REFERENCE FOR FUTURE CODE.
 */

'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Booking } from '@/_components/Booking Form/types';
import BookingHistory from '@/_components/Booking History/BookingHistory';

export default function CustomerHistoryPage() {
  const searchParams = useSearchParams();

  const bookings: Booking[] = useMemo(() => {
    const raw = searchParams.get('bookings');
    if (!raw) return [];
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch (e) {
      console.error("Failed to parse bookings:", e);
      return [];
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingHistory bookings={bookings} />
    </div>
  );
}
