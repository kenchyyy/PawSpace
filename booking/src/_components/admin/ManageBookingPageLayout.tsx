"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import BoardingDialog from "@/_components/admin/BoardingDialog";
import ManageBookingScrollArea from "@/_components/admin/ManageBookingScrollArea";
import { GetBookingDataByStatus, FormattedBooking } from "@/_components/serverSide/BookDataFetching";
import AlertMessage from "@/_components/AlertMessage";
import { Skeleton } from "@/_components/ui/skeleton";
import GroomingPetDialog from "./Grooming/GroomingPetDialog";

interface ManageBookingPageLayoutProps {
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed" | "ongoing";
  bookingServiceType: "boarding" | "grooming" ;
}

export default function ManageBookingsPageLayout({ bookingStatus, bookingServiceType }: ManageBookingPageLayoutProps) {
  const [bookings, setBookings] = useState<FormattedBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  }, []);

  const getBookings = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const from = page * 10;
      const to = from + 9;

      const { message, returnData } = await GetBookingDataByStatus(
        from, 
        to, 
        bookingStatus, 
        {field: bookingServiceType === "grooming" ? "grooming_id" : "boarding_id_extension", hasField: true}
      );

      if (!returnData) {
        showMessage(message);
        setHasMore(false);
        return;
      }

      if (returnData.length === 0) {
        setHasMore(false);
      } else {
        setBookings((prev) => [...prev, ...returnData]);
        setPage((prev) => prev + 1);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page, hasMore, bookingStatus, showMessage]);

  const lastBookingRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingRef.current) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            getBookings();
          }
        },
        { threshold: 0.1 }
      );

      if (node) observerRef.current.observe(node);
    },
    [getBookings, hasMore]
  );

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  function removeBooking(bookingIdToDelete: any) {
    setBookings((prev) => prev.filter((book) => book.bookingUUID !== bookingIdToDelete));
  }

  return (
    <ManageBookingScrollArea className={
      bookingServiceType === 'boarding' ? 
      "bg-purple-800 rounded-lg border border-purple-600 shadow-inner p-4 h-full"
      :
      "bg-indigo-800 rounded-lg border border-indigo-600 shadow-inner p-4 h-full"
    }>
      {bookings.length === 0 && !loading && (
        <div className="py-8 text-center text-purple-300 font-semibold">No Bookings to show here</div>
      )}

      {bookings.map((booking, index) => {
        const isLast = index === bookings.length - 1;
        return (
          <div key={booking.bookingUUID} ref={isLast ? lastBookingRef : undefined} className="mb-4 last:mb-0">
            {bookingServiceType === 'boarding' ?
            
            <BoardingDialog
              bookingUUID={booking.bookingUUID}
              publishDateTime={booking.dateBooked}
              ownerName={booking.ownerDetails.name}
              address={booking.ownerDetails.address}
              email={booking.ownerDetails.email}
              contactNumber={booking.ownerDetails.contactNumber}
              checkInDate={booking.serviceDateStart.split("T")[0]}
              checkInTime={booking.serviceDateStart.split("T")[1].split(".")[0]}
              checkOutDate={booking.serviceDateEnd.split("T")[0]}
              checkOutTime={booking.serviceDateEnd.split("T")[1].split(".")[0]}
              status={booking.status}
              specialRequest={booking.specialRequests}
              ondelete={removeBooking}
              totalAmount={booking.totalAmount}
              ownerId={booking.ownerDetails.id}
              bookingType={bookingServiceType}
            >
              
            </BoardingDialog>

            :

            <GroomingPetDialog
              bookingUUID={booking.bookingUUID}
              publishDateTime={booking.dateBooked}
              ownerName={booking.ownerDetails.name}
              address={booking.ownerDetails.address}
              email={booking.ownerDetails.email}
              contactNumber={booking.ownerDetails.contactNumber}
              checkInDate={booking.serviceDateStart.split("T")[0]}
              checkInTime={booking.serviceDateStart.split("T")[1].split(".")[0]}
              checkOutDate={booking.serviceDateEnd.split("T")[0]}
              checkOutTime={booking.serviceDateEnd.split("T")[1].split(".")[0]}
              status={booking.status}
              specialRequest={booking.specialRequests}
              ondelete={removeBooking}
              totalAmount={booking.totalAmount}
              ownerId={booking.ownerDetails.id}
              bookingType={bookingServiceType}
            />
          
          }

          </div>
        );
      })}

      {loading && (
        <div className="flex justify-start pr-20">
          <Skeleton className="h-40 w-full rounded-lg shadow-lg" />
        </div>
      )}

      {!hasMore && !loading && bookings.length > 0 && (
        <div className="py-4 text-center text-orange-400 font-medium">No more bookings to load</div>
      )}

      {message && <AlertMessage message={message} borderColor="orange" />}
    </ManageBookingScrollArea>
  );
}
