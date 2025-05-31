"use server";

import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { MealInstruction, BookingEvent, PetWithDetails } from "@/_components/Calendar/types";

export async function fetchBookings(): Promise<BookingEvent[]> {
  const supabase = createClientSideClient();

  try {
    console.log("Attempting to fetch bookings from Supabase...");
    const { data: bookings, error: bookingsError } = await supabase
      .from("Booking")
      .select(
        `
        booking_uuid,
        status,
        special_requests,
        total_amount,
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
        )
      `
      )
      .neq("status", "pending")
      .order("booking_uuid", { ascending: true });

    if (bookingsError) {
      console.error("Supabase query error:", bookingsError);
      throw bookingsError;
    }

    if (!bookings || bookings.length === 0) {
      console.log("No bookings found in initial Supabase query.");
      return [];
    }
    console.log(`Fetched ${bookings.length} raw bookings from Supabase.`);

    const boardingPetIds: string[] = [];
    bookings.forEach((booking: any) => {
      const pets = Array.isArray(booking.pet_uuid)
        ? booking.pet_uuid
        : booking.pet_uuid
        ? [booking.pet_uuid]
        : [];

      pets.forEach((pet: any) => {
        if (pet?.BoardingPet?.[0]?.id) {
          boardingPetIds.push(pet.BoardingPet[0].id);
        }
      });
    });
    console.log(
      "Extracted BoardingPet IDs for meal instructions:",
      boardingPetIds
    );

    let mealInstructionsMap: Record<
      string,
      {
        food: string;
        notes?: string;
        meal_type: string;
        time: string;
        boarding_pet_meal_instructions_id: string;
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
      console.log(
        `Fetched ${mealInstructions?.length || 0} meal instructions.`
      );
    }

    const events: BookingEvent[] = [];

    bookings.forEach((booking: any) => {
      const owner = Array.isArray(booking.owner_details)
        ? booking.owner_details[0]
        : booking.owner_details;
      if (!owner) {
        console.warn(
          `Booking ${booking.booking_uuid} missing owner details, skipping.`
        );
        return;
      }

      const rawPets = Array.isArray(booking.pet_uuid)
        ? booking.pet_uuid
        : booking.pet_uuid
        ? [booking.pet_uuid]
        : [];

      if (rawPets.length === 0) {
        console.warn(
          `Booking ${booking.booking_uuid} has no associated pets, skipping.`
        );
        return;
      }

      const serviceTypes = new Set<string>();
      const allServiceDates: Date[] = [];
      const allEndDates: Date[] = [];

      const petsWithDetails = rawPets
        .map((pet: any): PetWithDetails | null => {
          let petCheckIn: string | null = null;
          let petCheckOut: string | null = null;
          let petServiceType: "boarding" | "grooming" | "unknown" = "unknown";
          let mealInst: MealInstruction | null = null;

          if (
            pet.boarding_id_extension &&
            pet.BoardingPet &&
            pet.BoardingPet.length > 0
          ) {
            serviceTypes.add("Boarding");
            petServiceType = "boarding";
            const boardingPet = pet.BoardingPet[0];

            if (boardingPet.check_in_date) {
              const checkInDateTime = boardingPet.check_in_time
                ? `${boardingPet.check_in_date}T${boardingPet.check_in_time}`
                : `${boardingPet.check_in_date}T00:00:00`;
              petCheckIn = checkInDateTime;

              const checkInDate = new Date(checkInDateTime);
              if (!isNaN(checkInDate.getTime())) {
                allServiceDates.push(checkInDate);
              } else {
                console.warn(
                  `Invalid Boarding check-in date/time for pet ${pet.name} in booking ${booking.booking_uuid}: ${checkInDateTime}`
                );
              }
            }

            if (boardingPet.check_out_date) {
              const checkOutDateTime = boardingPet.check_out_time
                ? `${boardingPet.check_out_date}T${boardingPet.check_out_time}`
                : `${boardingPet.check_out_date}T23:59:59`;
              petCheckOut = checkOutDateTime;

              const checkOutDate = new Date(checkOutDateTime);
              if (!isNaN(checkOutDate.getTime())) {
                allEndDates.push(checkOutDate);
              } else {
                console.warn(
                  `Invalid Boarding check-out date/time for pet ${pet.name} in booking ${booking.booking_uuid}: ${checkOutDateTime}`
                );
              }
            }

            const boardingPetId = boardingPet.id;
            const mi = boardingPetId
              ? mealInstructionsMap[boardingPetId]
              : null;
            if (mi) {
              mealInst = {
                food: mi.food,
                notes: mi.notes,
                mealType: mi.meal_type,
                time: mi.time,
              };
            }
          } else if (
            pet.grooming_id &&
            pet.GroomingPet &&
            pet.GroomingPet.length > 0
          ) {
            serviceTypes.add("Grooming");
            petServiceType = "grooming";
            const groomingPet = pet.GroomingPet[0];

            if (groomingPet.service_date) {
              const serviceDateTime = groomingPet.service_time
                ? `${groomingPet.service_date}T${groomingPet.service_time}`
                : `${groomingPet.service_date}T09:00:00`;
              petCheckIn = serviceDateTime;

              const serviceDate = new Date(serviceDateTime);
              if (!isNaN(serviceDate.getTime())) {
                allServiceDates.push(serviceDate);
                const endDate = new Date(
                  serviceDate.getTime() + 2 * 60 * 60 * 1000
                );
                allEndDates.push(endDate);
              } else {
                console.warn(
                  `Invalid Grooming service date/time for pet ${pet.name} in booking ${booking.booking_uuid}: ${serviceDateTime}`
                );
              }
            }
          } else {
            console.warn(
              `Pet ${pet.name} in booking ${booking.booking_uuid} has no valid boarding or grooming data.`
            );
            return null;
          }

          return {
            petName: pet.name,
            petBreed: pet.breed,
            petType: pet.pet_type,
            mealInstructions: mealInst,
            checkIn: petCheckIn,
            checkOut: petCheckOut,
            serviceType: petServiceType,
          };
        })
        .filter((pet: PetWithDetails | null): pet is PetWithDetails => pet !== null);

      if (petsWithDetails.length === 0 || allServiceDates.length === 0) {
        console.warn(
          `Booking ${booking.booking_uuid} has no valid pets with service dates after processing, skipping event creation.`
        );
        return;
      }

      const overallEventStartDate = new Date(
        Math.min(...allServiceDates.map((d) => d.getTime()))
      );
      const overallEventEndDate =
        allEndDates.length > 0
          ? new Date(Math.max(...allEndDates.map((d) => d.getTime())))
          : null;

      const serviceTypeString = Array.from(serviceTypes).join(", ") || "N/A";
      const petNames = petsWithDetails.map((p: { petName: any; }) => p.petName).join(", ");

      events.push({
        id: booking.booking_uuid,
        title: `${petNames} - ${owner.name}`,
        start: overallEventStartDate,
        end: overallEventEndDate || undefined,
        allDay: false,
        extendedProps: {
          bookingId: booking.booking_uuid,
          ownerName: owner.name,
          contactNumber: owner.contact_number,
          status: booking.status,
          specialRequests: booking.special_requests || "",
          totalAmount: booking.total_amount || 0,
          serviceType: serviceTypeString,
          pets: petsWithDetails,
          checkIn: overallEventStartDate.toISOString(),
          checkOut: overallEventEndDate?.toISOString() || null,
        },
      });
      console.log(`Successfully processed booking ${booking.booking_uuid}.`);
    });

    console.log(`Total events ready for calendar: ${events.length}`);
    return events;
  } catch (error) {
    console.error("Critical error in fetchBookings:", error);
    return [];
  }
}
