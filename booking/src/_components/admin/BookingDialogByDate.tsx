"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import BoardingDialog from "@/_components/admin/BoardingDialog";
import { GetBookingDataByDateRange, FormattedBooking } from "@/_components/serverSide/BookDataFetching";
import AlertMessage from "@/_components/AlertMessage";
import { Skeleton } from "@/_components/ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { truncate } from "./helper";
import GroomingPetDialog from "./Grooming/GroomingPetDialog";

interface BookingDialogByDateProps {
  Date: Date;
  onRemoveBooking?: (bookingId: string) => void;
  bookingType: "boarding" | "grooming";
  bookingStatusFilter: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing' | 'confirmed&ongoing' ;
}

export default function BookingDialogByDate({Date, onRemoveBooking, bookingType, bookingStatusFilter}: BookingDialogByDateProps) {
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

      const { message, returnData } = await GetBookingDataByDateRange(from, to, Date, bookingStatusFilter, {field : bookingType === 'boarding'? 'boarding_id_extension' : 'grooming_id', hasField :true});

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
  }, [page, hasMore, Date, showMessage]);

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

  function removeBooking(bookingIdToDelete: string) {
    setBookings(prev => prev.filter(b => b.bookingUUID !== bookingIdToDelete));
    onRemoveBooking?.(bookingIdToDelete); // Call grandparent if provided
  }

  return (
    <ScrollArea className="bg-purple-900 rounded-lg border border-purple-600 shadow-inner p-0.5 h-full w-full pt-4">
        <div className="flex flex-col gap-1 px-2 text-white">
            {bookings.length === 0 && !loading && (
                <div className="py-8 text-center text-purple-300 font-semibold">No Bookings to show here</div>
            )}

            {bookings.map((booking, index) => {
                const isLast = index === bookings.length - 1;
                return (
                <div key={booking.bookingUUID} ref={isLast ? lastBookingRef : undefined} className="mb-4 last:mb-0">
                  {bookingType === "boarding" && (
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
                    bookingType={bookingType}
                    discountApplied={booking.discountApplied}
                    >
                      
                      <div className={`w-full h-20 ${booking.status === "ongoing" ? "bg-violet-700 hover:bg-violet-800":"bg-indigo-700 hover:bg-indigo-800"} flex flex-col items-start p-1 rounded-sm `}>
                          <span>{truncate(booking.ownerDetails.name, 20)}</span>
                          <span className="text-xs text-gray-200">{booking.status}</span>
                      </div>

                    </BoardingDialog>
                  )}

                  {bookingType === "grooming" && (
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
                      bookingType={bookingType}
                      discountApplied={booking.discountApplied}
                      >

                      <div className={`w-full h-20 ${booking.status === "ongoing" ? "bg-violet-700 hover:bg-violet-800":"bg-indigo-700 hover:bg-indigo-800"} flex flex-col items-start p-1 rounded-sm border-2 `}>
                          <span>{truncate(booking.ownerDetails.name, 20)}</span>
                          <span className="text-xs text-gray-200">{booking.status}</span>
                      </div>
                      </GroomingPetDialog>
                  )}
                    
                </div>
                );
            })}

            {loading && (
                <div className="flex justify-start ">
                <Skeleton className="h-20 mt-2 w-full rounded-lg shadow-lg" />
                </div>
            )}

            {!hasMore && !loading && bookings.length > 0 && (
                <div className="py-4 text-center text-orange-400 font-medium">No more bookings to load</div>
            )}

            {message && <AlertMessage message={message} borderColor="orange" />}
        </div>
    </ScrollArea>
  );
}
