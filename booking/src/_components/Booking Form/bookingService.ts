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
    let bookingUuids: string[] = [];

    try {
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error("Auth Error:", authError?.message || "User not authenticated");
            return { success: false, error: "User not authenticated" };
        }

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
            special_requests: pet.special_requests || null,
            total_amount: totalAmounts[idx],
            discount_applied: discountsApplied[idx] || 0,
        }));

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
        bookingUuids = bookings.map((b) => b.booking_uuid);

        // 3. Insert Pets (one per pet, linked to booking)
        const petInserts = pets.map((pet, idx) => ({
            Owner_ID: owner.id,
            booking_uuid: bookingUuids[idx],
            name: pet.name,
            age: pet.age,
            pet_type: pet.pet_type,
            breed: pet.breed || null,
            vaccinated: pet.vaccinated,
            size: pet.size,
            vitamins_or_medications: pet.vitamins_or_medications || null,
            allergies: pet.allergies || null,
            completed: false,
        }));

        const { data: createdPets, error: petError } = await supabase
            .from("Pet")
            .insert(petInserts)
            .select("pet_uuid, name");

        if (petError || !createdPets || createdPets.length === 0) {
            console.error("Pet Insert Error:", petError?.message || "Pet creation failed", petError);
            await supabase.from("Booking").delete().in("booking_uuid", bookingUuids);
            return {
                success: false,
                error: petError?.message || "Pet creation failed",
            };
        }

        // 4. Handle Service-Specific Details (Boarding/Grooming) and link to Pet
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
                        check_in_time: boardingPet.check_in_time || null,
                        check_out_date: boardingPet.check_out_date,
                        check_out_time: boardingPet.check_out_time || null,
                        special_feeding_request: boardingPet.special_feeding_request || null,
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

                // 4. Create MealInstructions records
                if (boardingPet.meal_instructions) {
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
                    }
                }
            } else if (pet.service_type === "grooming") {
                const groomingPet = pet as GroomingPet;
                const groomingId = crypto.randomUUID();

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
            }
        }

        return {
            success: true,
            bookingId: bookingUuids.length > 0 ? bookingUuids[0] : undefined,
        };
    } catch (error) {
        console.error("Critical Booking Process Failure:", error);
        if (bookingUuids.length > 0) {
            console.warn("Attempting final rollback due to critical error. Deleting bookings:", bookingUuids);
            await supabase.from("Booking").delete().in("booking_uuid", bookingUuids);
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