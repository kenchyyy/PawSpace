"use server";

import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { EventInput } from "@fullcalendar/core";


type Booking = {
  id: string;
  booking_uuid: string;
  date_booked: string;
  service_date_start: string;
  service_date_end: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  owner_details: {
    name: string;
    contact_number: string;
  };
  pet_uuid: {
    name: string;
    pet_type: string;
    breed: string;
  };
  special_requests: string;
  total_amount: number;
};

type BookingEvent = EventInput & {
  extendedProps: {
    bookingId: string;
    petName: string;
    petType: string;
    ownerName: string;
    contactNumber: string;
    status: string;
    specialRequests: string;
    totalAmount: number;
  };
};

export async function fetchBookings(): Promise<BookingEvent[]> {
  const supabase = createClientSideClient();

  try {
    const { data, error } = await supabase
      .from("booking")
      .select(`
        id,
        booking_uuid,
        service_date_start,
        service_date_end,
        status,
        owner_details:owner(name, contact_number),
        pet_uuid:pet(name, pet_type, breed),
        special_requests,
        total_amount
      `)
      .order("service_date_start", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log("No bookings found");
      return [];
    }

    // Transform and validate bookings
    return data
      .map((booking): BookingEvent | null => {
        try {
          // Ensure we have at least one owner and pet
          const owner = Array.isArray(booking.owner_details) 
            ? booking.owner_details[0] 
            : booking.owner_details;
          const pet = Array.isArray(booking.pet_uuid) 
            ? booking.pet_uuid[0] 
            : booking.pet_uuid;

          if (!owner || !pet) {
            console.warn("Invalid booking data - missing owner or pet:", booking);
            return null;
          }

          // Convert dates and validate
          const startDate = new Date(booking.service_date_start);
          const endDate = booking.service_date_end ? new Date(booking.service_date_end) : null;

          if (isNaN(startDate.getTime())) {
            console.warn("Invalid start date:", booking.service_date_start);
            return null;
          }

          if (endDate && isNaN(endDate.getTime())) {
            console.warn("Invalid end date:", booking.service_date_end);
            return null;
          }

          return {
            id: booking.id,
            title: `${pet.name} (${pet.breed}) - ${owner.name}`,
            start: startDate,
            end: endDate || undefined,
            allDay: false,
            extendedProps: {
              bookingId: booking.booking_uuid,
              petName: pet.name,
              petType: pet.pet_type,
              ownerName: owner.name,
              contactNumber: owner.contact_number,
              status: booking.status,
              specialRequests: booking.special_requests,
              totalAmount: booking.total_amount
            }
          };
        } catch (err) {
          console.error("Error processing booking:", booking, err);
          return null;
        }
      })
      .filter((event): event is BookingEvent => event !== null);

  } catch (error) {
    console.error("Error in fetchBookings:", error);
    return [];
  }
}

export async function deleteBooking(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClientSideClient();

  try {
    const { error } = await supabase
      .from("booking")
      .delete()
      .eq("id", bookingId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete booking",
    };
  }
}

type UpdateBookingStatusParams = {
  bookingId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

export async function updateBookingStatus(
  params: UpdateBookingStatusParams
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClientSideClient();

  try {
    const { error } = await supabase
      .from("booking")
      .update({ status: params.status })
      .eq("id", params.bookingId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update booking status",
    };
  }
}
