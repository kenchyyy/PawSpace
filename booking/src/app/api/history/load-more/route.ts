// app/api/history/load-more/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import {
  BookingRecord,
  OwnerDetails,
  BoardingPet,
  GroomService,
  MealInstructionType,
} from '@/_components/BookingHistory/types/bookingRecordType';

const ITEMS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Supabase session error:", sessionError);
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 401 }
      );
    }

    if (!session?.user) {
      // User not authenticated — no need to query bookings
      return NextResponse.json(
        { error: "Unauthorized. Please log in to view your bookings." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Now parse pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const pageNumber = page ? parseInt(page, 10) : 1;
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    // Query bookings filtered by user
    const { data, error } = await supabase
      .from("Booking")
      .select(`
        booking_uuid,
        date_booked,
        service_date_start,
        service_date_end,
        status,
        special_requests,
        total_amount,
        discount_applied,
        Owner (
            id,
            name,
            address,
            contact_number,
            email
        ),
        Pet (
            pet_uuid,
            name,
            age,
            pet_type,
            breed,
            size,
            vaccinated,
            vitamins_or_medications,
            allergies,
            grooming_id,
            boarding_id_extension,
            GroomingPet (
                id,
                service_variant,
                service_time
            ),
            BoardingPet (
                id,
                check_in_time,
                check_out_time,
                check_in_date,
                boarding_type,
                room_size,
                special_feeding_request,
                MealInstructions (
                    id,
                    meal_type,
                    time,
                    food,
                    notes
                )
            )
        )
      `)
      .eq("owner_details", userId) // filter by userId here
      .order("date_booked", { ascending: false })
      .range(startIndex, endIndex);

    if (error) {
      console.error(
        `Error fetching bookings (page ${pageNumber}):`,
        error
      );
      return NextResponse.json(
        { error: "Failed to fetch booking details" },
        { status: 500 }
      );
    }

    // Format bookings as before (your existing formatting code)
    const formattedBookings: BookingRecord[] = data.map((booking) => {
      // ... same formatting code you already have ...
      const ownerDetails: OwnerDetails | null =
        Array.isArray(booking.Owner) && booking.Owner.length > 0
          ? (booking.Owner[0] as OwnerDetails)
          : booking.Owner && typeof booking.Owner === "object" && !Array.isArray(booking.Owner)
          ? (booking.Owner as OwnerDetails)
          : null;

      return {
        booking_uuid: booking.booking_uuid,
        date_booked: booking.date_booked,
        service_date_start: booking.service_date_start,
        service_date_end: booking.service_date_end,
        status: booking.status,
        special_requests: booking.special_requests ?? null,
        total_amount: booking.total_amount,
        discount_applied: booking.discount_applied ?? null,
        owner_details: ownerDetails as OwnerDetails,
        pets: booking.Pet
          ? booking.Pet.map((pet) => {
              const groomService =
                Array.isArray(pet.GroomingPet) && pet.GroomingPet.length > 0
                  ? (pet.GroomingPet[0] as GroomService)
                  : pet.GroomingPet &&
                    typeof pet.GroomingPet === "object" &&
                    !Array.isArray(pet.GroomingPet)
                  ? (pet.GroomingPet as GroomService)
                  : null;

              const boardingPetRaw =
                Array.isArray(pet.BoardingPet) && pet.BoardingPet.length > 0
                  ? pet.BoardingPet[0]
                  : pet.BoardingPet &&
                    typeof pet.BoardingPet === "object" &&
                    !Array.isArray(pet.BoardingPet)
                  ? pet.BoardingPet
                  : null;

              const boardingPet: BoardingPet | undefined = boardingPetRaw
                ? {
                    id: boardingPetRaw.id,
                    boarding_type: boardingPetRaw.boarding_type,
                    room_size: boardingPetRaw.room_size,
                    special_feeding_request:
                      boardingPetRaw.special_feeding_request,
                    check_in_time: boardingPetRaw.check_in_time,
                    check_out_time: boardingPetRaw.check_out_time,
                    check_in_date: boardingPetRaw.check_in_date,
                    meal_instructions: Array.isArray(
                      boardingPetRaw.MealInstructions
                    )
                      ? (boardingPetRaw.MealInstructions as MealInstructionType[])
                      : [],
                  } as BoardingPet
                : undefined;

              return {
                pet_uuid: pet.pet_uuid,
                name: pet.name,
                age: pet.age,
                pet_type: pet.pet_type,
                breed: pet.breed,
                size: pet.size,
                vaccinated: pet.vaccinated,
                vitamins_or_medications: pet.vitamins_or_medications ?? null,
                allergies: pet.allergies ?? null,
                grooming_id: pet.grooming_id ?? null,
                groom_service: groomService ?? undefined,
                boarding_id_extension: pet.boarding_id_extension ?? null,
                boarding_pet: boardingPet,
              };
            })
          : [],
      };
    });

    return NextResponse.json({ bookings: formattedBookings }, { status: 200 });
  } catch (error: unknown) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}