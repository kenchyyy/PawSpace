"use client"

import ManageBookingsPageLayout from "@/_components/admin/ManageBookingPageLayout"


export default function ManageBookingsPage() {
    return (
        <ManageBookingsPageLayout bookingStatus="ongoing" bookingServiceType="grooming"></ManageBookingsPageLayout>
    )
}