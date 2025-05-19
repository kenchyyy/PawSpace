"use server";

import { createServerSideClient } from "../../lib/supabase/CreateServerSideClient";
import {
  OwnerDetails,
  Pet,
  GroomingPet,
  BoardingPet,
  BookingResult,
  BookingStatus,
  MealInstructions, // Import MealInstructions type
  MealType, // Import MealType type if used elsewhere, though keyof MealInstructions is sufficient here
} from "./types";

export async function createBooking(
  ownerDetails: OwnerDetails,
  pets: Pet[],
  totalAmounts: number[],
  discountsApplied: number[] = []
): Promise<BookingResult> {
  const supabase = await createServerSideClient();

  try {
    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    console.log("user data found: ", user); // 2. Upsert Owner (table: Owner)

    const { data: owner, error: ownerError } = await supabase
      .from("Owner")
      .upsert(
        {
          auth_id: user.id,
          name: ownerDetails.name,
          email: ownerDetails.email,
          address: ownerDetails.address,
          contact_number: ownerDetails.contact_number,
        },
        { onConflict: "auth_id" }
      )
      .select("id")
      .single();

    if (ownerError || !owner) {
      return {
        success: false,
        error: ownerError?.message || "Owner creation failed",
      };
    }

    console.log("upsert complete"); // 3. Insert Booking (table: Booking)

    const bookingInserts = pets.map((pet, idx) => ({
      owner_details: owner.id,
      date_booked: new Date().toISOString().split("T")[0],
      service_date_start:
        pet.service_type === "boarding"
          ? (pet as BoardingPet).check_in_date
          : (pet as GroomingPet).service_date,
      service_date_end:
        pet.service_type === "boarding"
          ? (pet as BoardingPet).check_out_date
          : (pet as GroomingPet).service_date,
      status: "pending" as BookingStatus,
      special_requests: pet.special_requests || "",
      total_amount: totalAmounts[idx],
      discount_applied: discountsApplied[idx] || 0,
    }));

    const { data: bookings, error: bookingError } = await supabase
      .from("Booking")
      .insert(bookingInserts)
      .select("booking_uuid");
    if (bookingError || !bookings || bookings.length === 0) {
        console.error(bookingError)
      return {
        success: false,
        error: bookingError?.message || "Booking creation failed",
      };
    }

    console.log("bookings success");
    bookings.forEach((booking) => {
      console.log(booking);
    }); // 4. Insert Pet (table: Pet)
    const petInserts = pets.map((pet, idx) => ({
      Owner_ID: owner.id,
      booking_uuid: bookings[idx].booking_uuid,
      name: pet.name,
      age: pet.age,
      pet_type: pet.pet_type,
      breed: pet.breed || "",
      vaccinated: pet.vaccinated,
      size: pet.size,
      vitamins_or_medications: pet.vitamins_or_medications || "",
      allergies: pet.allergies || "",
      completed: false,
    }));

    const { data: createdPets, error: petError } = await supabase
      .from("Pet")
      .insert(petInserts)
      .select("pet_uuid");

    if (petError || !createdPets || createdPets.length === 0) {
      // Attempt to clean up previously inserted booking records if pet insertion fails
      await supabase
        .from("Booking")
        .delete()
        .in(
          "booking_uuid",
          bookings.map((b) => b.booking_uuid)
        );
      return {
        success: false,
        error: petError?.message || "Pet creation failed",
      };
    } // 5. Insert Service-Specific Records

    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      const pet_uuid = createdPets[i].pet_uuid;

      if (pet.service_type === "boarding") {
        const boardingPet = pet as BoardingPet;
        const boardingPetId = crypto.randomUUID(); // Insert BoardingPet

        const { error: boardingError } = await supabase
          .from("BoardingPet")
          .insert({
            id: boardingPetId,
            service_type: "boarding",
            room_size: boardingPet.room_size,
            boarding_type: boardingPet.boarding_type,
            check_in_date: boardingPet.check_in_date,
            check_in_time: boardingPet.check_in_time || "",
            check_out_date: boardingPet.check_out_date,
            check_out_time: boardingPet.check_out_time || "",
            special_feeding_request: boardingPet.special_feeding_request || "", // meal_instructions is not inserted directly here, handled in MealInstructions table
          });

        if (boardingError) {
          // Attempt to clean up previous insertions
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase
            .from("Booking")
            .delete()
            .in(
              "booking_uuid",
              bookings.map((b) => b.booking_uuid)
            );
          return { success: false, error: boardingError.message };
        } // Update Pet with boarding_id_extention (linking Pet and BoardingPet)

        const { error: updatePetError } = await supabase
          .from("Pet")
          .update({ boarding_id_extention: boardingPetId })
          .eq("pet_uuid", pet_uuid);

        if (updatePetError) {
          // Attempt to clean up previous insertions
          await supabase.from("BoardingPet").delete().eq("id", boardingPetId);
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase
            .from("Booking")
            .delete()
            .in(
              "booking_uuid",
              bookings.map((b) => b.booking_uuid)
            );
          return { success: false, error: updatePetError.message };
        } // Insert MealInstructions if present

        if (boardingPet.meal_instructions) {
          // Corrected loop iteration type
          for (const mealType of [
            "breakfast",
            "lunch",
            "dinner",
          ] as (keyof MealInstructions)[]) {
            const meal = boardingPet.meal_instructions[mealType];
            if (meal && (meal.time || meal.food || meal.notes)) {
              // Only insert if there is data
              const { error: mealError } = await supabase
                .from("MealInstructions")
                .insert({
                  // id: crypto.randomUUID(), // Supabase can generate UUIDs
                  boarding_pet_meal_instructions: boardingPetId, // Link to BoardingPet
                  meal_type: mealType,
                  time: meal.time || null, // Use null for empty strings if DB allows
                  food: meal.food || null,
                  notes: meal.notes || null,
                })
                .select(); // Select to get the generated ID if needed later

              if (mealError) {
                // Comprehensive cleanup on error
                await supabase
                  .from("MealInstructions")
                  .delete()
                  .eq("boarding_pet_meal_instructions", boardingPetId);
                await supabase
                  .from("BoardingPet")
                  .delete()
                  .eq("id", boardingPetId);
                await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
                await supabase
                  .from("Booking")
                  .delete()
                  .in(
                    "booking_uuid",
                    bookings.map((b) => b.booking_uuid)
                  );
                return { success: false, error: mealError.message };
              }
            }
          }
        }
      }

      if (pet.service_type === "grooming") {
        const groomingPet = pet as GroomingPet;
        const groomingId = crypto.randomUUID(); // Insert GroomingPet

        const { error: groomingError } = await supabase
          .from("GroomingPet")
          .insert({
            id: groomingId,
            service_type: "grooming",
            service_variant: groomingPet.service_variant,
            service_date: groomingPet.service_date,
            service_time: groomingPet.service_time,
          });

        if (groomingError) {
          // Attempt to clean up previous insertions
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase
            .from("Booking")
            .delete()
            .in(
              "booking_uuid",
              bookings.map((b) => b.booking_uuid)
            );
          return { success: false, error: groomingError.message };
        } // Update Pet with grooming_id (linking Pet and GroomingPet)

        const { error: updatePetError } = await supabase
          .from("Pet")
          .update({ grooming_id: groomingId })
          .eq("pet_uuid", pet_uuid);

        if (updatePetError) {
          // Attempt to clean up previous insertions
          await supabase.from("GroomingPet").delete().eq("id", groomingId);
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase
            .from("Booking")
            .delete()
            .in(
              "booking_uuid",
              bookings.map((b) => b.booking_uuid)
            );
          return { success: false, error: updatePetError.message };
        }
      }
    }

    return {
      success: true,
      bookingId: bookings.length > 0 ? bookings[0].booking_uuid : undefined,
    };
  } catch (error) {
    console.error("Booking process failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during booking.",
    };
  }
}
