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

function createDateTime(dateString: string, timeString: string): Date | null {
  if (!dateString || !timeString) {
    return null;
  }
  try {
    const fullDateTimeString = `${dateString}T${timeString}+08:00`;

    const date = new Date(fullDateTimeString);

    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch (e) {
    console.error("Error parsing date/time:", dateString, timeString, e);
    return null;
  }
}

export async function fetchBookings(): Promise<BookingEvent[]> {
  const supabase = createClientSideClient();

  try {
    const { data: bookings, error: bookingsError } = await supabase
      .from("Booking")
      .select(
        `
        booking_uuid,
        status,
        owner_details:Owner(name, contact_number),
        pet_uuid:Pet(
          name,
          pet_type,
          breed,
          boarding_id_extension, 
          grooming_id,
          BoardingPet:boarding_id_extension(
            id,
            check_in_date,
            check_in_time,
            check_out_date,
            check_out_time
          ),
          GroomingPet:grooming_id(
            id,
            service_date,
            service_time
          )
        ),
        special_requests,
        total_amount
        `
      )
      .neq("status", "pending")
      .order("booking_uuid", { ascending: true });

    if (bookingsError) {
      console.error("Supabase error fetching bookings:", bookingsError);
      throw bookingsError;
    }
    if (!bookings || bookings.length === 0) {
      console.log("No bookings found in Supabase.");
      return [];
    }

    // Extract all BoardingPet IDs for fetching meal instructions
    const boardingPetIds: string[] = [];
    bookings.forEach((booking) => {
      // Adjusted type here: BoardingPet is an object, not an array
      const pets = (Array.isArray(booking.pet_uuid)
        ? booking.pet_uuid
        : booking.pet_uuid
        ? [booking.pet_uuid]
        : []) as unknown as {
        BoardingPet?: { id: string } | null; // Changed to object or null
      }[];

      pets.forEach((pet) => {
        // Access BoardingPet directly, not pet.BoardingPet[0]
        if (pet?.BoardingPet?.id) {
          boardingPetIds.push(pet.BoardingPet.id);
        }
      });
    });

    // Fetch MealInstructions for relevant BoardingPet IDs
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
        .select("food, notes, meal_type, time, boarding_pet_meal_instructions")
        .in("boarding_pet_meal_instructions", boardingPetIds);

      if (mealError) {
        console.error("Supabase error fetching meal instructions:", mealError);
        throw mealError;
      }

      if (mealInstructions) {
        for (const mi of mealInstructions) {
          mealInstructionsMap[mi.boarding_pet_meal_instructions] = mi;
        }
      }
    }

    const events: BookingEvent[] = [];

    bookings.forEach((booking) => {
      const owner = (
        Array.isArray(booking.owner_details)
          ? booking.owner_details[0]
          : booking.owner_details
      ) as { name: string; contact_number: string };

      if (!owner) {
        console.warn(
          `Booking ${booking.booking_uuid}: Missing owner details, skipping.`
        );
        return;
      }

      const pets = (Array.isArray(booking.pet_uuid)
        ? booking.pet_uuid
        : booking.pet_uuid
        ? [booking.pet_uuid]
        : []) as unknown as {
        name: string;
        pet_type: string;
        breed: string;
        boarding_id_extension?: string;
        grooming_id?: string;
        BoardingPet?: {
          // Changed to object or null
          id: string;
          check_in_date: string;
          check_in_time: string;
          check_out_date: string;
          check_out_time: string;
        } | null;
        GroomingPet?: {
          // Changed to object or null
          id: string;
          service_date: string;
          service_time: string;
        } | null;
      }[];

      if (pets.length === 0) {
        console.warn(
          `Booking ${booking.booking_uuid}: Has no pets or invalid pet data, skipping.`
        );
        return;
      }

      const serviceTypes = new Set<string>();
      let overallEarliestStart: Date | null = null;
      let overallLatestEnd: Date | null = null;

      const petsWithDetails: PetWithDetails[] = pets.map((pet) => {
        let petDetails: PetWithDetails = {
          petName: pet.name,
          petBreed: pet.breed,
          petType: pet.pet_type,
          mealInstructions: null,
        };

        // Access BoardingPet directly, not pet.BoardingPet[0]
        if (pet.BoardingPet) {
          // Check if it's not null/undefined
          serviceTypes.add("Boarding");
          const boardingPet = pet.BoardingPet; // boardingPet is now the object

          const checkInDateTime = createDateTime(
            boardingPet.check_in_date,
            boardingPet.check_in_time
          );
          const checkOutDateTime = createDateTime(
            boardingPet.check_out_date,
            boardingPet.check_out_time
          );

          if (checkInDateTime) {
            if (
              overallEarliestStart === null ||
              checkInDateTime.getTime() < overallEarliestStart.getTime()
            ) {
              overallEarliestStart = checkInDateTime;
            }
          }
          if (checkOutDateTime) {
            if (
              overallLatestEnd === null ||
              checkOutDateTime.getTime() > overallLatestEnd.getTime()
            ) {
              overallLatestEnd = checkOutDateTime;
            }
          }

          const mi = boardingPet.id
            ? mealInstructionsMap[boardingPet.id]
            : null;
          if (mi) {
            petDetails.mealInstructions = {
              food: mi.food,
              notes: mi.notes,
              mealType: mi.meal_type,
              time: mi.time,
            };
          }
        }

        // Access GroomingPet directly, not pet.GroomingPet[0]
        if (pet.GroomingPet) {
          // Check if it's not null/undefined
          serviceTypes.add("Grooming");
          const groomingPet = pet.GroomingPet; // groomingPet is now the object

          const groomingServiceStart = createDateTime(
            groomingPet.service_date,
            groomingPet.service_time
          );

          if (groomingServiceStart) {
            const groomingDurationMs = 60 * 60 * 1000;
            const groomingServiceEnd = new Date(
              groomingServiceStart.getTime() + groomingDurationMs
            );

            if (
              overallEarliestStart === null ||
              groomingServiceStart.getTime() < overallEarliestStart.getTime()
            ) {
              overallEarliestStart = groomingServiceStart;
            }
            if (
              overallLatestEnd === null ||
              groomingServiceEnd.getTime() > overallLatestEnd.getTime()
            ) {
              overallLatestEnd = groomingServiceEnd;
            }
          }
        }
        return petDetails;
      });

      let finalEventStart: Date;
      if (overallEarliestStart === null) {
        console.warn(
          `Booking ${booking.booking_uuid}: No valid service dates found from pets for event time. Skipping event creation.`
        );
        return;
      } else {
        finalEventStart = overallEarliestStart;
      }

      let finalEventEnd: Date;
      if (overallLatestEnd === null) {
        finalEventEnd = finalEventStart;
      } else {
        finalEventEnd = overallLatestEnd;
      }

      const serviceTypeString =
        Array.from(serviceTypes).join(", ") || "Unknown";

      const petNames = petsWithDetails.map((p) => p.petName).join(", ");

      events.push({
        id: booking.booking_uuid,
        title: `${petNames} - ${owner.name}`,
        start: finalEventStart,
        end: finalEventEnd,
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
          checkIn: finalEventStart.toISOString(),
          checkOut: finalEventEnd.toISOString(),
        },
      });
    });

    return events;
  } catch (error) {
    console.error("CRITICAL ERROR in fetchBookings:", error);
    return [];
  }
}
