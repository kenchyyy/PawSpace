"use server"

import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";

export interface OwnerDetails {
  id: string | null;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
}

export interface FormattedBooking {
  bookingUUID: string;
  dateBooked: string;
  serviceDateStart: string;
  serviceDateEnd: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing' ;
  specialRequests: string;
  ownerDetails: OwnerDetails;
}

export async function GetBookingDataByStatus(from: number, to: number, bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing' ): Promise<{message: string; returnData?: (Array<any> | null)}> {
    const supabase = createClientSideClient();
    const { data, error } = await supabase
        .from("Booking")
        .select(`*,
            owner_details(
            id,
            name,
            address,
            contact_number,
            email)
            `)
        .range(from, to)
        .eq("status", bookingStatus)
        .order("service_date_start", { ascending: false}
        );

    if (error) {
        return {message: "Fetching Error", returnData: null};
    }
    const formattedData: FormattedBooking[] = data.map((item) => ({
        bookingUUID: item.booking_uuid,
        dateBooked: item.date_booked,
        serviceDateStart: item.service_date_start,
        serviceDateEnd: item.service_date_end,
        status: item.status,
        specialRequests: item.special_requests,
        ownerDetails: {
            id: item.owner_details?.id ?? "",
            name: item.owner_details?.name ?? "",
            address: item.owner_details?.address ?? "",
            contactNumber: item.owner_details?.contact_number ?? "",
            email: item.owner_details?.email ?? ""
        }
    }));
    return {message: "Booking data fetched successfully", returnData: formattedData };
}


export async function updateBookingStatus(bookingUUID: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing'): Promise<{message: string}> {
    const supabase = createClientSideClient();
    const { data, error } = await supabase
        .from("Booking")
        .update({ status })
        .eq("booking_uuid", bookingUUID)
    if (error) {
        return {message: "Update Error"};
    }
    return {message: "Booking data updated successfully"};
}