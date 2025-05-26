import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { BoardingPetData } from "./FetchPetData";

export interface RoomData {
    id : number;
    roomName: string;
    roomType: string;
}

export async function assignRoomToPet(roomId : string, petUuid : string): Promise<{message: string}>{
    const supabase = createClientSideClient();
    const { error } = await supabase
    .from("Pet")
    .update({"room": roomId})
    .eq('pet_uuid', petUuid)

    if (error) return {message: "Data update failed"}

    return {message : "Data updated successfuly"}
}

export async function getAllRooms(): Promise<RoomData[] | null> {
  const supabase = createClientSideClient();
  try {
    const { data, error } = await supabase
      .from('Room')
      .select('*');

    if (error) {
      console.error('Error fetching rooms:', error);
      return null;
    }

    // Transform snake_case to camelCase if needed
    return data.map(room => ({
      id: room.id,
      roomName: room.room_name,
      roomType: room.room_type,
    })) as RoomData[];

  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
}


export async function getPetsSceduledForRoomStay(newPetCheckInDateTime : string, newPetCheckOutDateTime: string, roomId : string): Promise<{returnData?: (any | null), message: string}> {
    const supabase = createClientSideClient();
    const { data, error } = await supabase
    .from("Pet")
    .select(`
        *,
        booking_uuid!inner(*),
        boarding_id_extension!inner(*),
        room(*)
        `)
    .gte("boarding_id_extension.check_out_date || 'T' || boarding_id_extension.check_out_time", newPetCheckInDateTime)
    .lte("boarding_id_extension.check_in_date || 'T' || boarding_id_extension.check_in_time", newPetCheckOutDateTime)
    .eq("room", roomId)
    .in("booking_uuid.status", ["confirmed","ongoing"]);  

    if (error) {
        return {message: "Fetching Error", returnData: null};
    }
    if (data.length === 0) {
        return {message: "No pet data found", returnData: null};
    }

    const formattedData= data.map((item) => ({
        petUuid: item.pet_uuid,
        boardingIdExtention: item.boarding_id_extention,
        groomingIdExtention: item.grooming_id,
        isCompleted: item.completed,
        allergies: item.allergies,
        vitaminsOrMedications: item.vitamins_or_medications,
        size: item.size,
        isVaccinated: item.vaccinated,
        name: item.name,
        age: item.age,
        petType: item.pet_type,
        breed: item.breed,
        checkInDate: item.boarding_id_extension?.check_in_date ?? "",
        checkInTime: item.boarding_id_extension?.check_in_time ?? "",
        checkOutDate: item.boarding_id_extension?.check_out_date ?? "",
        checkOutTime: item.boarding_id_extension?.check_out_time ?? "",
        boardingType: item.boarding_id_extension?.boarding_type ?? "",
        room_name: item.room?.room_name ?? "",
        room_type: item.room?.room_type ?? "",
        room_id: item.room?.id ?? ""
    }));

    return {message: "Pet data fetched successfully", returnData: formattedData };
}

export async function getPetsScheduledByDate(
  date: string | Date,
  roomId: string
): Promise<{ returnData?: any | null; message: string }> {
  const supabase = createClientSideClient();
  const roomIdNum = Number(roomId);

  if (isNaN(roomIdNum)) {
    return { message: "Invalid room ID", returnData: null };
  }

  // Convert date to proper format
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const dateStr = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD (local time)

  // First verify the room exists
  const { data: room, error: roomError } = await supabase
    .from("Room")
    .select("*")
    .eq("id", roomIdNum)
    .single();

  if (roomError || !room) {
    return { message: "Room not found", returnData: null };
  }

  // Step 1: Fetch pets and their bookings (without MealInstructions)
  const { data, error } = await supabase
    .from("Pet")
    .select(
      `
      *,
      booking_uuid:Booking(*),
      boarding_id_extension:BoardingPet(*),
      room:Room(*),
      Owner:Owner(*)
    `
    )
    .eq("room", roomIdNum);

  if (error) {
    return { message: "Fetching Error", returnData: null };
  }
  if (!data || data.length === 0) {
    return { message: "No pets scheduled for this room on this date.", returnData: null };
  }

  // Filter by date and booking status
  const filtered = data.filter(
    (item) =>
      item.boarding_id_extension &&
      item.boarding_id_extension.check_in_date <= dateStr &&
      item.boarding_id_extension.check_out_date >= dateStr &&
      item.booking_uuid && // Ensure booking_uuid exists
      ["confirmed", "ongoing"].includes(item.booking_uuid.status) // Filter by status
  );

  // Step 2: Collect all boarding pet IDs for fetching MealInstructions
  const boardingPetIds = filtered
    .map((item) => item.boarding_id_extension?.id)
    .filter((id) => !!id);

  let mealInstructionsByBoardingPet: Record<string, any[]> = {};
  if (boardingPetIds.length > 0) {
    // Fetch all meal instructions for these boarding pets
    const { data: mealInstructionsData, error: mealError } = await supabase
      .from("MealInstructions")
      .select("*")
      .in("boarding_pet_meal_instructions", boardingPetIds);

    if (!mealError && mealInstructionsData) {
      // Group meal instructions by boarding_pet_meal_instructions
      mealInstructionsByBoardingPet = mealInstructionsData.reduce((acc, inst) => {
        if (!acc[inst.boarding_pet_meal_instructions]) acc[inst.boarding_pet_meal_instructions] = [];
        acc[inst.boarding_pet_meal_instructions].push(inst);
        return acc;
      }, {} as Record<string, any[]>);
    }
  }

  // Step 3: Format data, attaching mealInstructions to each pet
  const formattedData: BoardingPetData[] = filtered.map((item) => ({
    petUuid: item.pet_uuid,
    boardingIdExtention: item.boarding_id_extention,
    groomingIdExtention: item.grooming_id,
    isCompleted: item.completed,
    allergies: item.allergies,
    vitaminsOrMedications: item.vitamins_or_medications,
    size: item.size,
    isVaccinated: item.vaccinated,
    name: item.name,
    age: item.age,
    petType: item.pet_type,
    breed: item.breed,
    checkInDate: item.boarding_id_extension?.check_in_date ?? "",
    checkInTime: item.boarding_id_extension?.check_in_time ?? "",
    checkOutDate: item.boarding_id_extension?.check_out_date ?? "",
    checkOutTime: item.boarding_id_extension?.check_out_time ?? "",
    boardingType: item.boarding_id_extension?.boarding_type ?? "",
    room_name: item.room?.room_name ?? "",
    room_type: item.room?.room_type ?? "",
    room_id: item.room?.id ?? "",
    owner: item.Owner?.name ?? "",
    ownerId: item.Owner?.id ?? null,
    ownerContactNumber: item.Owner?.contact_number ?? "",
    ownerEmail: item.Owner?.email ?? "",
    status: item.booking_uuid?.status ?? "",
    mealInstructions: mealInstructionsByBoardingPet[item.boarding_id_extension?.id] ?? [],
  }));

  return { message: "Pet data fetched successfully", returnData: formattedData };
}
