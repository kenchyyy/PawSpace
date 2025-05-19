// src/app/actions/calendar-actions.ts
"use server";

import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { EventInput } from "@fullcalendar/core";

type Booking = {
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
    serviceType: string;
    mealInstructions?:
      | {
          food: string;
          notes?: string;
          mealType: string;
          time: string;
        }
      | string
      | null;
  };
};

export async function fetchBookings(): Promise<BookingEvent[]> {
  const supabase = createClientSideClient();

  try {
    const { data, error } = await supabase
      .from("Booking")
      .select(
        `
        booking_uuid,
        service_date_start,
        service_date_end,
        status,
        owner_details:Owner(name, contact_number),
        pet_uuid:Pet(
            name, 
            pet_type, 
            breed,
            boarding_id_extention,
            grooming_id,
            BoardingPet(
                meal_instructions,
                meal_instructions_ref:meal_instructions!inner(food, notes, meal_type, time)
                )
            ),
        special_requests,
        total_amount
      `
      )
      .neq("status", "pending")
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
            console.warn(
              "Invalid booking data - missing owner or pet:",
              booking
            );
            return null;
          }

          // Convert dates and validate
          const startDate = new Date(booking.service_date_start);
          const endDate = booking.service_date_end
            ? new Date(booking.service_date_end)
            : null;

          if (isNaN(startDate.getTime())) {
            console.warn("Invalid start date:", booking.service_date_start);
            return null;
          }

          if (endDate && isNaN(endDate.getTime())) {
            console.warn("Invalid end date:", booking.service_date_end);
            return null;
          }

          let serviceType = "";
          let mealInstructions: { food: string; notes?: string; mealType: string; time: string; } | null = null;
          if (pet.boarding_id_extention) {
            serviceType = "Boarding";
            mealInstructions = {
                food: pet.BoardingPet?.[0]?.meal_instructions_ref?.[0]?.food,
                notes: pet.BoardingPet?.[0]?.meal_instructions_ref?.[0]?.notes,
                mealType: pet.BoardingPet?.[0]?.meal_instructions_ref?.[0]?.meal_type,
                time: pet.BoardingPet?.[0]?.meal_instructions_ref?.[0]?.time,
            }
          } else if (pet.grooming_id) {
            serviceType = "Grooming";
          }
          return {
            id: booking.booking_uuid,
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
              totalAmount: booking.total_amount,
              serviceType: serviceType,
              mealInstructions: mealInstructions,
            },
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
      .from("Booking")
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
      .from("Booking")
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
