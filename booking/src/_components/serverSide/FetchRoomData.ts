import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { PetData } from "./FetchPetData";

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

    const formattedData: PetData[] = data.map((item) => ({
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