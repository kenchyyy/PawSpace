"use client"

import AdminSideBookingDialog from "@/_components/admin/AdminSideBookingDialog"
import ManageBookingScrollArea from "@/_components/admin/ManageBookingScrollArea";
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchBookingDataByStatus, FormattedBooking } from "@/_components/serverSide/BookDataFetching";
import AlertMessage from "@/_components/AlertMessage";
import { Skeleton } from "@/_components/ui/skeleton";

interface ManageBookingPageLayoutProps {
    bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'onGoing' ;
}

export default function ManageBookingsPageLayout({bookingStatus} : ManageBookingPageLayoutProps) {
    const [bookings, setBookings] = useState<FormattedBooking[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver>(undefined);
    const loadingRef = useRef(false); // Track loading state with ref
    

    function showMessage(msg: string) {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }

    const getBookings = useCallback(async () => {
        // Prevent duplicate calls
        if (loadingRef.current || !hasMore) return;
        
        loadingRef.current = true;
        setLoading(true);

        try {
            const from = page * 10;
            const to = from + 9;

            const { message, returnData } = await fetchBookingDataByStatus(from, to, bookingStatus);

            if (!returnData) {
                showMessage(message);
                setHasMore(false);
                return;
            }

            if (returnData.length === 0) {
                setHasMore(false);
            } else {
                // Use functional update to ensure we get latest state
                setBookings(prev => [...prev, ...returnData]);
                setPage(prev => prev + 1);
            }
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [page, hasMore]);

    // Intersection Observer callback
    const lastBookingRef = useCallback((node: HTMLDivElement) => {
        if (loadingRef.current) return;
        
        // Disconnect previous observer
        if (observerRef.current) observerRef.current.disconnect();
        
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
                    getBookings();
                }
            },
            { threshold: 0.1 } // Trigger when 10% visible
        );
        
        if (node) observerRef.current.observe(node);
    }, [getBookings, hasMore]);

    // Initial load
    useEffect(() => {
        getBookings();
    }, []);

    // Cleanup observer on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    function removeBooking(bookingIdToDelete : any) {
        setBookings(prev => prev.filter(book => book.bookingUUID !== bookingIdToDelete))
    }

    return (
        <ManageBookingScrollArea ref={scrollAreaRef}>
            {bookings.map((booking, index) => {
                const isLast = index === bookings.length - 1;
                return (
                    <div 
                        key={booking.bookingUUID} 
                        ref={isLast ? lastBookingRef : undefined}
                    >
                        <AdminSideBookingDialog
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
                            ownerId={booking.ownerDetails.id}
                        />
                    </div>
                );
            })}
            
            {loading && (
                <div className="h-40 w-full flex">
                    <Skeleton className="h-40 w-full mr-20" />
                </div>
            )}
            
            {!hasMore && !loading && bookings.length > 0 && (
                <div className="py-4 text-center text-gray-500">
                    No more bookings to load
                </div>
            )}

            {(bookings.length === 0 && !loading)&& 
                <div className="py-4 text-center text-gray-500">
                    No Bookings to show here
                </div>
            }
            
            {message && <AlertMessage message={message} borderColor="green"/>}
        </ManageBookingScrollArea>
    )
}