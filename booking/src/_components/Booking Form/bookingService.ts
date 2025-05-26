"use server";

import { createServerSideClient } from "../../lib/supabase/CreateServerSideClient";
import {
  OwnerDetails,
  Pet,
  GroomingPet,
  BoardingPet,
  BookingResult,
  BoardingPet,
  GroomingPet
} from './types'

export async function createBooking(
  ownerDetails: OwnerDetails,
  pets: Pet[],
  totalAmounts: number[],
  discountsApplied: number[] = []
): Promise<BookingResult> {

  const supabase = await createServerSideClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error: transactionError } = await supabase.rpc('start_transaction');
    if (transactionError) {
        console.error('Transaction start error', transactionError);
        return { success: false, error: 'Failed to start transaction' };
    }

    let ownerId: number;
    try {
      const { data: existingOwner, error: ownerQueryError } = await supabase
        .from('Owner')
        .select('id')
        .eq('auth_id', user.id)
        .single();

        if (ownerQueryError) {
            throw ownerQueryError; 
        }

      if (existingOwner) {
        ownerId = existingOwner.id;
      } else {
        const { data: newOwner, error: ownerInsertError } = await supabase
          .from('Owner')
          .insert({
            auth_id: user.id,
            name: ownerDetails.name,
            email: ownerDetails.email,
            address: ownerDetails.address,
            contact_number: ownerDetails.contact_number,
          })
          .select('id')
          .single();

    if (ownerError || !owner) {
      return {
        success: false,
        error: ownerError?.message || "Owner creation failed",
      };
    }

    console.log("upsert complete"); 

    const { data: bookingData, error: bookingInsertError } = await supabase
      .from('Booking')
      .insert({
        owner_id: ownerId,
        date_booked: new Date(),
        service_date_start: pets.reduce((min, p) => {
          const date = p.service_type === 'boarding' ? (p as BoardingPet).check_in_date : (p as GroomingPet).service_date;
          return (!min || new Date(date!).getTime() < min.getTime() ? new Date(date!) : min)
        }, null as Date | null), 
        service_date_end: pets.reduce((max, p) => {
          const date = p.service_type === 'boarding' ? (p as BoardingPet).check_out_date : (p as GroomingPet).service_date;
          return (!max || new Date(date!).getTime() > max.getTime() ? new Date(date!) : max)
        }, null as Date | null),  
        status: 'pending',
        special_requests: '', 
        total_amount: totalAmounts.reduce((sum, val) => sum + val, 0),
        discount_applied: discountsApplied.reduce((sum, val) => sum + val, 0),
        service_type: pets[0]?.service_type || 'boarding'
      })
      .select('booking_uuid')
      .single();

      if (bookingInsertError) {
          await supabase.rpc('rollback_transaction');
          console.error("Booking Insert Error", bookingInsertError);
          return {success: false, error: "Failed to create booking"};
      }
    const bookingId = bookingData.booking_uuid;

    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      const totalAmount = totalAmounts[i];
      const discountApplied = discountsApplied[i] || 0;

      const { data: petData, error: petInsertError } = await supabase
        .from('Pet')
        .insert({
          owner_id: ownerId,
          name: pet.name,
          age: pet.age,
          pet_type: pet.pet_type,
          breed: pet.breed,
          vaccinated: pet.vaccinated,
          size: pet.size,
          vitamins_or_medications: pet.vitamins_or_medications,
          allergies: pet.allergies,
          completed: false,
          total_amount: totalAmount,
          discount_applied: discountApplied
        })
        .select('pet_uuid')
        .single();
        if(petInsertError){
           await supabase.rpc('rollback_transaction');
           console.error("Pet Insert error", petInsertError);
           return {success:false, error: "Failed to insert pet"};
        }
        const petId = petData.pet_uuid;

      if (pet.service_type === "boarding") {
        const boardingPet = pet as BoardingPet;
        const { error: boardingInsertError } = await supabase
          .from('BoardingPet')
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

        if (boardingPet.meal_instructions && Array.isArray(boardingPet.meal_instructions)) {
          for (const meal of boardingPet.meal_instructions) {
            const { error: mealInsertError } = await supabase
              .from('MealInstructions')
              .insert({
                booking_id: bookingId,
                meal_type: meal.meal_type,
                time: meal.time,
                food: meal.food,
                notes: meal.notes,
              });
              if(mealInsertError){
                 await supabase.rpc('rollback_transaction');
                 console.error("Meal Instruction Insert Error", mealInsertError);
                 return {success:false, error: "Failed to insert meal instruction"};
              }
            }
          }
        }
      }

      if (pet.service_type === "grooming") {
        const groomingPet = pet as GroomingPet;
        const { error: groomingInsertError } = await supabase
          .from('GroomingPet')
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
      error: error.message || 'An unexpected error occurred'
    }
  }
}

export async function getBookings(authId: string) {
  const supabase = await createServerSideClient()

  try {
    const { data: bookings, error } = await supabase
      .from('Booking')
      .select(`
        booking_uuid,
        date_booked,
        service_date_start,
        service_date_end,
        status,
        special_requests,
        total_amount,
        discount_applied,
        owner(
          id,
          name,
          email,
          address,
          contact_number,
          auth_id
        ),
        pets(
          pet_uuid,
          name,
          age,
          pet_type,
          breed,
          vaccinated,
          size,
          vitamins_or_medications,
          allergies,
          completed,
          boarding_id_extention,
          grooming_id,
          boarding(
            id,
            room_size,
            boarding_type,
            check_in_date,
            check_in_time,
            check_out_date,
            check_out_time,
            special_feeding_request,
            meals(
              id,
              meal_type,
              time,
              food,
              notes
            )
          ),
          grooming(
            id,
            service_variant,
            service_date,
            service_time
          )
        )
      `)
      .eq('owner.auth_id', authId)
      .order('date_booked', { ascending: false })

    if (error) throw error
    return { data: bookings, error: null }

  } catch (error: any) { 
    console.error('Error fetching bookings:', error)
    return {
      data: null,
      error: error.message || 'Failed to fetch bookings'
    }
  }
}