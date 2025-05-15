"use client"

import AdminSideBookingDialog from "@/_components/admin/AdminSideBookingDialog"
import ManageBookingScrollArea from "@/_components/admin/ManageBookingScrollArea";
import { useEffect, useState } from "react";
import { fetchBookingDataByStatus, FormattedBooking } from "@/_components/serverSide/BookDataFetching";
import AlertMessage from "@/_components/AlertMessage";

export default function manageBookingsPage() {
    const [booking, setBooking] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [page, setPage] = useState(0)

    function showMessage(msg: string) {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 5000);

    }

    const getBooking = async () => {
        setLoading(true);

        const from = page * 10
        const to = from + 9

        const {message, returnData} = await fetchBookingDataByStatus(from, to, "pending");

        if (!returnData) {
            setLoading(false);
            showMessage(message);
            return;
        }

        setBooking(returnData);
        setLoading(false);
    }

    useEffect(() => {
        getBooking();
    }, [])
    
    return (
        <ManageBookingScrollArea>

            {booking && booking.map((booking: FormattedBooking) => (
                <AdminSideBookingDialog
                    key={booking.bookingUUID}
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
                />
            ))}
            {message && <AlertMessage message={message} borderColor="green"/>}
        </ManageBookingScrollArea>
        
    )
}