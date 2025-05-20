"use server";

import { createServerSideClient } from "../../lib/supabase/CreateServerSideClient";
import {
  OwnerDetails,
  Pet,
  GroomingPet,
  BoardingPet,
  BookingResult,
  BookingStatus,
  MealInstructions,
} from "./types";

export async function createBooking(
  ownerDetails: OwnerDetails,
  pets: Pet[],
  totalAmounts: number[],
  discountsApplied: number[] = []
): Promise<BookingResult> {
  const supabase = await createServerSideClient();
  let bookingUuids: string[] = []; // Initialize to track all booking UUIDs for comprehensive rollback

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth Error:", authError?.message || "User not authenticated");
      return { success: false, error: "User not authenticated" };
    }

    console.log("user data found: ", user);
    console.log("Received ownerDetails:", ownerDetails);

    // --- CRITICAL LOG 1: Check initial 'pets' array length ---
    console.log(`Received pets array. Number of pets: ${pets.length}`);
    pets.forEach((pet, index) => {
      console.log(`  Pet ${index + 1} details: Name - ${pet.name}, Service Type - ${pet.service_type}`);
    });

    console.log("Received totalAmounts:", totalAmounts);
    console.log("Received discountsApplied:", discountsApplied);

    // 1. Upsert Owner
    const { data: owner, error: ownerError } = await supabase
      .from("Owner")
      .upsert(
        {
          id: user.id,
          name: ownerDetails.name,
          email: ownerDetails.email,
          address: ownerDetails.address,
          contact_number: ownerDetails.contact_number,
        },
        { onConflict: "id" }
      )
      .select("id")
      .single();

    if (ownerError || !owner) {
      console.error("Owner Upsert Error:", ownerError?.message || "Owner creation failed", ownerError);
      return {
        success: false,
        error: ownerError?.message || "Owner creation failed",
      };
    }
    console.log("Owner upsert successful. Owner ID:", owner.id);

    // 2. Insert Bookings (one per pet)
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
      special_requests: pet.special_requests || null, // Changed from "" to null for consistency
      total_amount: totalAmounts[idx],
      discount_applied: discountsApplied[idx] || 0,
    }));

    // --- CRITICAL LOG 2: Check 'bookingInserts' array before insertion ---
    console.log(`Bookings to insert. Number of booking records: ${bookingInserts.length}`);
    bookingInserts.forEach((booking, index) => {
      console.log(`  Booking ${index + 1} for owner ${booking.owner_details}, total amount: ${booking.total_amount}`);
    });

    const { data: bookings, error: bookingError } = await supabase
      .from("Booking")
      .insert(bookingInserts)
      .select("booking_uuid");

    if (bookingError || !bookings || bookings.length === 0) {
      console.error("Booking Insert Error:", bookingError?.message || "Booking creation failed", bookingError);
      return {
        success: false,
        error: bookingError?.message || "Booking creation failed",
      };
    }
    bookingUuids = bookings.map((b) => b.booking_uuid); // Store for comprehensive rollback
    console.log("Bookings inserted successfully. UUIDs:", bookingUuids);

    // 3. Insert Pets (one per pet, linked to booking)
    const petInserts = pets.map((pet, idx) => ({
      Owner_ID: owner.id,
      booking_uuid: bookingUuids[idx], // Link to the created booking UUID
      name: pet.name,
      age: pet.age,
      pet_type: pet.pet_type,
      breed: pet.breed || null, // Changed from "" to null for consistency
      vaccinated: pet.vaccinated,
      size: pet.size,
      vitamins_or_medications: pet.vitamins_or_medications || null, // Changed from "" to null for consistency
      allergies: pet.allergies || null, // Changed from "" to null for consistency
      completed: false,
    }));

    // --- CRITICAL LOG 3: Check 'petInserts' array before insertion ---
    console.log(`Pets to insert. Number of pet records: ${petInserts.length}`);
    petInserts.forEach((pet, index) => {
      console.log(`  Pet ${index + 1} insert data: Name - ${pet.name}, Booking UUID - ${pet.booking_uuid}`);
    });

    const { data: createdPets, error: petError } = await supabase
      .from("Pet")
      .insert(petInserts)
      .select("pet_uuid, name");

    if (petError || !createdPets || createdPets.length === 0) {
      console.error("Pet Insert Error:", petError?.message || "Pet creation failed", petError);
      // Rollback: Delete all associated Booking records
      await supabase.from("Booking").delete().in("booking_uuid", bookingUuids);
      return {
        success: false,
        error: petError?.message || "Pet creation failed",
      };
    }
    console.log("Pets inserted successfully into 'Pet' table:", createdPets);
    // --- CRITICAL LOG 4: Verify 'createdPets' array length after insertion ---
    console.log(`Successfully created ${createdPets.length} pet records.`);


    // 4. Handle Service-Specific Details (Boarding/Grooming) and link to Pet
    // --- CRITICAL LOG 5: Starting loop for service-specific details ---
    console.log(`Starting loop to process service details for ${pets.length} pets.`);
    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      const pet_uuid = createdPets[i].pet_uuid;

      // --- CRITICAL LOG 6: Logging each pet before service-specific processing ---
      console.log(`--- Processing pet ${i + 1}/${pets.length}: ${pet.name} (UUID: ${pet_uuid}) ---`);
      console.log(`  Service Type: ${pet.service_type}`);


      if (pet.service_type === "boarding") {
        const boardingPet = pet as BoardingPet;

        console.log(`Attempting to insert BoardingPet for pet: ${pet.name}`);

        const { data: newBoardingPets, error: boardingError } = await supabase
          .from("BoardingPet")
          .insert({
            service_type: "boarding",
            room_size: boardingPet.room_size,
            boarding_type: boardingPet.boarding_type,
            check_in_date: boardingPet.check_in_date,
            check_in_time: boardingPet.check_in_time || null, // Changed from "" to null
            check_out_date: boardingPet.check_out_date,
            check_out_time: boardingPet.check_out_time || null, // Changed from "" to null
            special_feeding_request: boardingPet.special_feeding_request || null, // Changed from "" to null
          })
          .select("id");

        if (boardingError) {
          console.error(`BoardingPet Insert Error for ${pet.name}:`, boardingError?.message, boardingError);
          // Rollback: Delete associated records
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase.from("Booking").delete().in("booking_uuid", bookingUuids);
          return { success: false, error: boardingError.message };
        }

        const newBoardingPet = newBoardingPets[0];
        console.log(`BoardingPet inserted successfully for ${pet.name} with ID:`, newBoardingPet.id);

        console.log(`Attempting to update Pet ${pet_uuid} with boarding_id_extension: ${newBoardingPet.id}`);
        const { error: updatePetError } = await supabase
          .from("Pet")
          .update({ boarding_id_extension: newBoardingPet.id })
          .eq("pet_uuid", pet_uuid);

        if (updatePetError) {
          console.error(`Pet Update (Boarding) Error for ${pet.name}:`, updatePetError?.message, updatePetError);
          // Rollback: Delete associated records
          await supabase.from("BoardingPet").delete().eq("id", newBoardingPet.id);
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase.from("Booking").delete().in("booking_uuid", bookingUuids);
          return { success: false, error: updatePetError.message };
        }
        console.log(`Pet ${pet_uuid} updated successfully with boarding_id_extension.`);

        // 4. Create MealInstructions records
        if (boardingPet.meal_instructions) {
          console.log(`Attempting to insert MealInstructions for BoardingPet ID: ${newBoardingPet.id}`);
          const mealInserts = [];
          for (const mealType of ["breakfast", "lunch", "dinner"] as (keyof MealInstructions)[]) {
            const meal = boardingPet.meal_instructions[mealType];
            if (meal && (meal.time || meal.food || meal.notes)) {
              mealInserts.push({
                boarding_pet_meal_instructions: newBoardingPet.id,
                meal_type: mealType,
                time: meal.time || null,
                food: meal.food || null,
                notes: meal.notes || null,
              });
            }
          }

          if (mealInserts.length > 0) {
            console.log(`  Meal Instructions to insert for ${pet.name}:`, mealInserts);
            const { error: mealError } = await supabase
              .from("MealInstructions")
              .insert(mealInserts);

            if (mealError) {
              console.error(`MealInstructions Insert Error for ${pet.name}:`, mealError?.message, mealError);
              // Rollback: Delete associated records
              await supabase.from("MealInstructions").delete().eq("boarding_pet_meal_instructions", newBoardingPet.id);
              await supabase.from("BoardingPet").delete().eq("id", newBoardingPet.id);
              await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
              await supabase.from("Booking").delete().in("booking_uuid", bookingUuids);
              return { success: false, error: mealError.message };
            }
            console.log(`MealInstructions for BoardingPet ID ${newBoardingPet.id} inserted successfully.`);
          } else {
            console.log(`No valid meal instructions found for ${pet.name} (BoardingPet ID: ${newBoardingPet.id}).`);
          }
        } else {
          console.log(`No meal instructions provided for ${pet.name}.`);
        }
      } else if (pet.service_type === "grooming") {
        const groomingPet = pet as GroomingPet;
        const groomingId = crypto.randomUUID();

        console.log(`Attempting to insert GroomingPet for pet: ${pet.name} with generated ID: ${groomingId}`);

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
          console.error(`GroomingPet Insert Error for ${pet.name}:`, groomingError?.message, groomingError);
          // Rollback: Delete associated records
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase.from("Booking").delete().in("booking_uuid", bookingUuids);
          return { success: false, error: groomingError.message };
        }
        console.log(`GroomingPet inserted successfully for ${pet.name} with ID: ${groomingId}`);


        console.log(`Attempting to update Pet ${pet_uuid} with grooming_id: ${groomingId}`);
        const { error: updatePetError } = await supabase
          .from("Pet")
          .update({ grooming_id: groomingId })
          .eq("pet_uuid", pet_uuid);

        if (updatePetError) {
          console.error(`Pet Update (Grooming) Error for ${pet.name}:`, updatePetError?.message, updatePetError);
          // Rollback: Delete associated GroomingPet, Pet, and Booking records
          await supabase.from("GroomingPet").delete().eq("id", groomingId);
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase.from("Booking").delete().in("booking_uuid", bookingUuids);
          return { success: false, error: updatePetError.message };
        }
        console.log(`Pet ${pet_uuid} updated successfully with grooming_id.`);
      } else {
        console.warn(`Encountered unknown service type for pet: . Skipping service details for this pet.`);
      }
    }

    console.log("Booking process completed successfully for all pets.");
    return {
      success: true,
      bookingId: bookingUuids.length > 0 ? bookingUuids[0] : undefined, // Return the first booking ID
    };
  } catch (error) {
    console.error("Critical Booking Process Failure:", error);
    if (bookingUuids.length > 0) {
      console.warn("Attempting final rollback due to critical error. Deleting bookings:", bookingUuids);
      await supabase.from("Booking").delete().in("booking_uuid", bookingUuids);
      // Note: A more robust rollback for pets, boarding/grooming pets, and meal instructions would
      // be needed here if the error occurred before the specific rollbacks in the loops.
      // However, the current code's structure with `return` on error already triggers specific rollbacks.
      // This outer catch is for truly unexpected errors.
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during booking.",
    };
  }
}