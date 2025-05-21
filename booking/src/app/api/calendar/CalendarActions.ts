"use server";

import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { EventInput } from "@fullcalendar/core";

type MealInstruction = {
  food: string;
  notes?: string;
  mealType: string;
  time: string;
};

type PetWithDetails = {
  petName: string;
  petBreed: string;
  petType: string;
  mealInstructions: MealInstruction | null;
};

type BookingEvent = EventInput & {
  extendedProps: {
    bookingId: string;
    ownerName: string;
    contactNumber: string;
    status: string;
    specialRequests: string;
    totalAmount: number;
    serviceType: string;
    pets: PetWithDetails[];
    checkIn?: string | null;
    checkOut?: string | null;
  };
};

export async function fetchBookings(): Promise<BookingEvent[]> {
  const supabase = createClientSideClient();

  try {
    const { data: bookings, error: bookingsError } = await supabase
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
          boarding_id_extension,
          grooming_id,
          BoardingPet:boarding_id_extension(
            id
          )
        ),
        special_requests,
        total_amount
      `
      )
      .neq("status", "pending")
      .order("service_date_start", { ascending: true });

    if (bookingsError) {
      console.error("Supabase error:", bookingsError);
      throw bookingsError;
    }
    if (!bookings || bookings.length === 0) {
      console.log("No bookings found");
      return [];
    }

    // Extract all BoardingPet IDs
    const boardingPetIds: string[] = [];
    bookings.forEach((booking) => {
      const pets = Array.isArray(booking.pet_uuid)
        ? booking.pet_uuid
        : [booking.pet_uuid];
      pets.forEach((pet) => {
        if (pet?.BoardingPet?.[0]?.id) {
          boardingPetIds.push(pet.BoardingPet[0].id);
        }
      });
    });

    // Fetch MealInstructions for BoardingPet IDs
    let mealInstructionsMap: Record<
      string,
      {
        food: string;
        notes?: string;
        meal_type: string;
        time: string;
      }
    > = {};

    if (boardingPetIds.length > 0) {
      const { data: mealInstructions, error: mealError } = await supabase
        .from("MealInstructions")
        .select(
          "food, notes, meal_type, time, boarding_pet_meal_instructions_id"
        )
        .in("boarding_pet_meal_instructions_id", boardingPetIds);

      if (mealError) {
        console.error("Supabase error fetching meal instructions:", mealError);
        throw mealError;
      }

      if (mealInstructions) {
        for (const mi of mealInstructions) {
          mealInstructionsMap[mi.boarding_pet_meal_instructions_id] = mi;
        }
      }
    }

    const events: BookingEvent[] = [];

    bookings.forEach((booking) => {
      const owner = Array.isArray(booking.owner_details)
        ? booking.owner_details[0]
        : booking.owner_details;
      if (!owner) {
        console.warn("Booking missing owner, skipping:", booking.booking_uuid);
        return;
      }

      const startDate = new Date(booking.service_date_start);
      const endDate = booking.service_date_end
        ? new Date(booking.service_date_end)
        : null;

      if (isNaN(startDate.getTime())) {
        console.warn("Invalid start date, skipping:", booking.booking_uuid);
        return;
      }
      if (endDate && isNaN(endDate.getTime())) {
        console.warn("Invalid end date, skipping:", booking.booking_uuid);
        return;
      }

      const pets = Array.isArray(booking.pet_uuid)
        ? booking.pet_uuid
        : [booking.pet_uuid];
      if (pets.length === 0) {
        console.warn("Booking has no pets, skipping:", booking.booking_uuid);
        return;
      }

      // Determine service types present (e.g. boarding or grooming)
      const serviceTypes = new Set<string>();

      // Build pets array with meal instructions
      const petsWithDetails: PetWithDetails[] = pets.map((pet) => {
        if (pet.boarding_id_extension) {
          serviceTypes.add("Boarding");
          const boardingPetId = pet.BoardingPet?.[0]?.id;
          const mi = boardingPetId ? mealInstructionsMap[boardingPetId] : null;
          return {
            petName: pet.name,
            petBreed: pet.breed,
            petType: pet.pet_type,
            mealInstructions: mi
              ? {
                  food: mi.food,
                  notes: mi.notes,
                  mealType: mi.meal_type,
                  time: mi.time,
                }
              : null,
          };
        } else if (pet.grooming_id) {
          serviceTypes.add("Grooming");
          return {
            petName: pet.name,
            petBreed: pet.breed,
            petType: pet.pet_type,
            mealInstructions: null,
          };
        } else {
          return {
            petName: pet.name,
            petBreed: pet.breed,
            petType: pet.pet_type,
            mealInstructions: null,
          };
        }
      });

      const serviceTypeString =
        Array.from(serviceTypes).join(", ") || "Unknown";

      // Aggregate pet names for title
      const petNames = petsWithDetails.map((p) => p.petName).join(", ");

      events.push({
        id: booking.booking_uuid,
        title: `${petNames} - ${owner.name}`,
        start: startDate,
        end: endDate || undefined,
        allDay: false,
        extendedProps: {
          bookingId: booking.booking_uuid,
          ownerName: owner.name,
          contactNumber: owner.contact_number,
          status: booking.status,
          specialRequests: booking.special_requests,
          totalAmount: booking.total_amount,
          serviceType: serviceTypeString,
          pets: petsWithDetails,
          checkIn: booking.service_date_start,
          checkOut: booking.service_date_end,
        },
      });
    });

    return events;
  } catch (error) {
    console.error("Error in fetchBookings:", error);
    return [];
  }
}
