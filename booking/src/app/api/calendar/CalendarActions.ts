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
  checkIn?: string | null;
  checkOut?: string | null;
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

      const pets = Array.isArray(booking.pet_uuid)
        ? booking.pet_uuid
        : [booking.pet_uuid];
      if (pets.length === 0) {
        console.warn("Booking has no pets, skipping:", booking.booking_uuid);
        return;
      }

      // Determine service types present and collect dates
      const serviceTypes = new Set<string>();
      const allCheckInDates: Date[] = [];
      const allCheckOutDates: Date[] = [];

      // Build pets array with meal instructions and individual check-in/out times
      const petsWithDetails: PetWithDetails[] = pets.map((pet) => {
        let petCheckIn: string | null = null;
        let petCheckOut: string | null = null;

        if (pet.boarding_id_extension && pet.BoardingPet?.[0]) {
          serviceTypes.add("Boarding");
          const boardingPet = pet.BoardingPet[0];

          // Combine check-in date and time
          if (boardingPet.check_in_date) {
            const checkInDateTime = boardingPet.check_in_time
              ? `${boardingPet.check_in_date}T${boardingPet.check_in_time}`
              : boardingPet.check_in_date;
            petCheckIn = checkInDateTime;

            const checkInDate = new Date(checkInDateTime);
            if (!isNaN(checkInDate.getTime())) {
              allCheckInDates.push(checkInDate);
            }
          }

          // Combine check-out date and time
          if (boardingPet.check_out_date) {
            const checkOutDateTime = boardingPet.check_out_time
              ? `${boardingPet.check_out_date}T${boardingPet.check_out_time}`
              : boardingPet.check_out_date;
            petCheckOut = checkOutDateTime;

            const checkOutDate = new Date(checkOutDateTime);
            if (!isNaN(checkOutDate.getTime())) {
              allCheckOutDates.push(checkOutDate);
            }
          }

          const boardingPetId = boardingPet.id;
          const mi = boardingPetId ? mealInstructionsMap[boardingPetId] : null;

          return {
            petName: pet.name,
            petBreed: pet.breed,
            petType: pet.pet_type,
            checkIn: petCheckIn,
            checkOut: petCheckOut,
            mealInstructions: mi
              ? {
                  food: mi.food,
                  notes: mi.notes,
                  mealType: mi.meal_type,
                  time: mi.time,
                }
              : null,
          };
        } else if (pet.grooming_id && pet.GroomingPet?.[0]) {
          serviceTypes.add("Grooming");
          const groomingPet = pet.GroomingPet[0];

          // Combine service date and time for grooming
          if (groomingPet.service_date) {
            const serviceDateTime = groomingPet.service_time
              ? `${groomingPet.service_date}T${groomingPet.service_time}`
              : groomingPet.service_date;
            petCheckIn = serviceDateTime;

            const serviceDate = new Date(serviceDateTime);
            if (!isNaN(serviceDate.getTime())) {
              allCheckInDates.push(serviceDate);
            }
          }

          return {
            petName: pet.name,
            petBreed: pet.breed,
            petType: pet.pet_type,
            checkIn: petCheckIn,
            checkOut: petCheckOut,
            mealInstructions: null,
          };
        } else {
          return {
            petName: pet.name,
            petBreed: pet.breed,
            petType: pet.pet_type,
            checkIn: petCheckIn,
            checkOut: petCheckOut,
            mealInstructions: null,
          };
        }
      });

      const serviceTypeString =
        Array.from(serviceTypes).join(", ") || "Unknown";

      // Calculate overall event start and end dates
      const eventStartDate =
        allCheckInDates.length > 0
          ? new Date(Math.min(...allCheckInDates.map((d) => d.getTime())))
          : new Date(booking.service_date_start);

      const eventEndDate =
        allCheckOutDates.length > 0
          ? new Date(Math.max(...allCheckOutDates.map((d) => d.getTime())))
          : booking.service_date_end
          ? new Date(booking.service_date_end)
          : null;

      if (isNaN(eventStartDate.getTime())) {
        console.warn("Invalid start date, skipping:", booking.booking_uuid);
        return;
      }
      if (eventEndDate && isNaN(eventEndDate.getTime())) {
        console.warn("Invalid end date, skipping:", booking.booking_uuid);
        return;
      }

      // Aggregate pet names for title
      const petNames = petsWithDetails.map((p) => p.petName).join(", ");

      // Overall check-in/out for the booking
      const overallCheckIn =
        allCheckInDates.length > 0
          ? eventStartDate.toISOString()
          : booking.service_date_start;

      const overallCheckOut =
        allCheckOutDates.length > 0
          ? eventEndDate?.toISOString() || null
          : booking.service_date_end;

      events.push({
        id: booking.booking_uuid,
        title: `${petNames} - ${owner.name}`,
        start: eventStartDate,
        end: eventEndDate || undefined,
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
          checkIn: overallCheckIn,
          checkOut: overallCheckOut,
        },
      });
    });

    return events;
  } catch (error) {
    console.error("Error in fetchBookings:", error);
    return [];
  }
}
