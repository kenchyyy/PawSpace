
'use client'

import { SupabaseClient } from '@supabase/supabase-js'
import type { Booking, Pet, BookingStatus, PetType, VaccinationStatus, GroomingVariant, RoomSize, BoardingType, ServiceType, MealInstruction, GroomingPet, BoardingPet } from './types'

export class ClientBookingService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      return { user, error: error?.message || null }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async getBookings(): Promise<Booking[]> {
    const { data, error } = await this.supabase
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
        owner_id,
        owner:owner(
          id,
          name,
          email,
          address,
          contact_number
        ),
        pets:pet(
          id, 
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
          service_type,
          special_requests, 
          boarding(
            id,
            room_size,
            boarding_type,
            check_in_date,
            check_in_time,
            check_out_date,
            check_out_time,
            special_feeding_request,
            meals:meal_instructions(
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
      .order('date_booked', { ascending: false })

    if (error) throw error
    if (!data) return [];

    return data.map((booking: any) => {
      const ownerData = booking.owner ? (Array.isArray(booking.owner) ? booking.owner[0] : booking.owner) : null;
      const petsData = booking.pets || [];

      const formattedPets = petsData.map((pet: any) => {
        const basePet = {
          id: pet.id,
          pet_uuid: pet.pet_uuid,
          name: pet.name,
          age: pet.age,
          pet_type: pet.pet_type as PetType,
          breed: pet.breed,
          vaccinated: pet.vaccinated as VaccinationStatus,
          size: pet.size,
          vitamins_or_medications: pet.vitamins_or_medications,
          allergies: pet.allergies,
          completed: pet.completed,
          boarding_id_extention: pet.boarding_id_extention,
          grooming_id: pet.grooming_id,
          service_type: pet.service_type as ServiceType,
          Owner_ID: pet.Owner_ID,
          booking_uuid: pet.booking_uuid,
          special_requests: pet.special_requests || '',
        };

        if (pet.boarding) {
          const boardingData = Array.isArray(pet.boarding) ? pet.boarding[0] : pet.boarding;
          const mealsArray = boardingData?.meals as any[] || [];
          const mealInstructions: {
            breakfast?: MealInstruction;
            lunch?: MealInstruction;
            dinner?: MealInstruction;
          } = {};

          mealsArray.forEach(meal => {
            if (meal.meal_type === 'breakfast') {
              mealInstructions.breakfast = { time: meal.time, food: meal.food, notes: meal.notes };
            } else if (meal.meal_type === 'lunch') {
              mealInstructions.lunch = { time: meal.time, food: meal.food, notes: meal.notes };
            } else if (meal.meal_type === 'dinner') {
              mealInstructions.dinner = { time: meal.time, food: meal.food, notes: meal.notes };
            }
          });

          return {
            ...basePet,
            room_size: boardingData?.room_size as RoomSize,
            boarding_type: boardingData?.boarding_type as BoardingType,
            check_in_date: boardingData?.check_in_date ? new Date(boardingData.check_in_date) : null,
            check_in_time: boardingData?.check_in_time || '',
            check_out_date: boardingData?.check_out_date ? new Date(boardingData.check_out_date) : null,
            check_out_time: boardingData?.check_out_time || '',
            special_feeding_request: boardingData?.special_feeding_request || '',
            meal_instructions: {
              breakfast: mealInstructions.breakfast!, 
              lunch: mealInstructions.lunch!,       
              dinner: mealInstructions.dinner!,     
            },
          } as BoardingPet;
        } else if (pet.grooming) {
          const groomingData = Array.isArray(pet.grooming) ? pet.grooming[0] : pet.grooming;
          return {
            ...basePet,
            service_variant: groomingData?.service_variant as GroomingVariant,
            service_date: groomingData?.service_date ? new Date(groomingData.service_date) : null,
            service_time: groomingData?.service_time || '',
          } as GroomingPet;
        }
        return basePet as Pet;
      });

      return {
        booking_uuid: booking.booking_uuid,
        date_booked: new Date(booking.date_booked),
        service_date_start: booking.service_date_start ? new Date(booking.service_date_start) : null,
        service_date_end: booking.service_date_end ? new Date(booking.service_date_end) : null,
        status: booking.status as BookingStatus,
        owner_id: booking.owner_id,
        owner_details: ownerData ? {
          id: ownerData.id,
          name: ownerData.name || '',
          email: ownerData.email || '',
          address: ownerData.address || '',
          contact_number: ownerData.contact_number || '',
        } : undefined,
        special_requests: booking.special_requests,
        total_amount: booking.total_amount,
        discount_applied: booking.discount_applied || 0,
        pet: formattedPets.length > 0 ? formattedPets[0] : undefined,
      } as Booking;
    }).filter(Boolean) as Booking[];
  }
}