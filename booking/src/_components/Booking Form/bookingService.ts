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

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) { 
      return { success: false, error: "User not authenticated" };
    }

    console.log("user data found: ", user); 

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
      return {
        success: false,
        error: ownerError?.message || "Owner creation failed",
      };
    }

    console.log("upsert complete"); 

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
      total_amount: totalAmounts[idx] ?? 0,
      discount_applied: discountsApplied[idx] || 0,
    }));

    const { data: bookings, error: bookingError } = await supabase
      .from("Booking")
      .insert(bookingInserts)
      .select("booking_uuid");
    if (bookingError || !bookings || bookings.length === 0) {
      console.error(bookingError);
      return {
        success: false,
        error: bookingError?.message || "Booking creation failed",
      };
    }

    console.log("bookings success");
    bookings.forEach((booking) => {
      console.log(booking);
    });

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
      .select("pet_uuid, name");

    console.log(petError);

    if (petError || !createdPets || createdPets.length === 0) {
      console.log(petError);
    
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
    } 
    createdPets?.forEach((pet, idx) => {
      console.log("pet number:", idx);
      console.log(pet);
    });


    const { data: samplePetGetting, error: getPetError } = await supabase
      .from("Pet")
      .select("name, pet_uuid")
      .eq("pet_uuid", createdPets[0].pet_uuid);

    console.log("✨ Getting the new pet", samplePetGetting);
    if (getPetError) {
      console.log("❌ Error getting the pet", getPetError);
    }

    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      const pet_uuid = createdPets[i].pet_uuid;

      if (pet.service_type === "boarding") {
        const boardingPet = pet as BoardingPet;

        
        const { data: newBoardingPets, error: boardingError } = await supabase
          .from("BoardingPet")
          .insert({
            service_type: "boarding",
            room_size: boardingPet.room_size,
            boarding_type: boardingPet.boarding_type,
            check_in_date: boardingPet.check_in_date,
            check_in_time: boardingPet.check_in_time || "",
            check_out_date: boardingPet.check_out_date,
            check_out_time: boardingPet.check_out_time || "",
            special_feeding_request: boardingPet.special_feeding_request || "", 
          })
          .select("id");

        if (boardingError) {
          console.log("❌ Error: creating a new boarding pet:", boardingError);
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase
            .from("Booking")
            .delete()
            .in(
              "booking_uuid",
              bookings.map((b) => b.booking_uuid)
            );
          return { success: false, error: boardingError.message };
        }

        const newBoardingPet = newBoardingPets[0];
        const { error: updatePetError } = await supabase
          .from("Pet")
          .update({ boarding_id_extention: newBoardingPet.id })
          .eq("pet_uuid", pet_uuid);

        if (updatePetError) {
          await supabase
            .from("BoardingPet")
            .delete()
            .eq("id", newBoardingPet.id);
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

        if (boardingPet.meal_instructions) {
          for (const mealType of [
            "breakfast",
            "lunch",
            "dinner",
          ] as (keyof MealInstructions)[]) {
            const meal = boardingPet.meal_instructions[mealType];
            if (meal && (meal.time || meal.food || meal.notes)) {
              const { error: mealError } = await supabase
                .from("MealInstructions")
                .insert({
                  boarding_pet_meal_instructions: newBoardingPet.id, 
                  meal_type: mealType,
                  time: meal.time || null, 
                  food: meal.food || null,
                  notes: meal.notes || null,
                })
                .select(); 

              if (mealError) {
                console.log("❌ Error on meal Instructions: ", mealError);
                await supabase
                  .from("MealInstructions")
                  .delete()
                  .eq("boarding_pet_meal_instructions", newBoardingPet.id);
                await supabase
                  .from("BoardingPet")
                  .delete()
                  .eq("id", newBoardingPet.id);
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
        const groomingId = crypto.randomUUID(); 

        const { error: groomingError } = await supabase
          .from("GroomingPet")
          .insert({
            id: groomingId,
            service_type_size: "grooming",
            service_variant: groomingPet.service_variant,
            service_date: groomingPet.service_date,
            service_time: groomingPet.service_time,
          });

        if (groomingError) {
          await supabase.from("Pet").delete().eq("pet_uuid", pet_uuid);
          await supabase
            .from("Booking")
            .delete()
            .in(
              "booking_uuid",
              bookings.map((b) => b.booking_uuid)
            );
          return { success: false, error: groomingError.message };
        } 

        const { error: updatePetError } = await supabase
          .from("Pet")
          .update({ grooming_id: groomingId })
          .eq("pet_uuid", pet_uuid);

        if (updatePetError) {
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