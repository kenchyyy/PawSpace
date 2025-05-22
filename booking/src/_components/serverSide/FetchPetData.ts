

import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";

export interface PetData {
    petUuid: string;
    boardingIdExtention: string;
    groomingIdExtention: string;
    name: string;
    age: string;
    petType: string;
    breed: string;
    isVaccinated: string;
    allergies: string;
    vitaminsOrMedications: string;
    isCompleted: boolean;
    size: string;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
    boardingType: string;
    room_name: string;
    room_type: string;
    room_id: string;
}

export interface BoardingPetData extends PetData {

}



export async function fetchBasicPetDataByBookingUUID(bookingUUID: string): Promise<{ message: string; returnData?: (any | null)}> {
    const supabase = createClientSideClient();
    const {data, error} = await supabase
        .from("Pet")
        .select(`*,
            boarding_id_extension(
            check_in_date,
            check_in_time,
            check_out_date,
            check_out_time,
            boarding_type
            ),
            room(
            *
            )
            `)
        .eq("booking_uuid", bookingUUID)
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

export async function fetchBasicPetDataByDate(date: string): Promise<{ message: string; returnData?: (any | null)}> {
    const supabase = createClientSideClient();
    const {data, error} = await supabase
        .from("Pet")
        .select(`*,
            boarding_id_extension(
            check_in_date,
            check_in_time,
            check_out_date,
            check_out_time,
            boarding_type
            ),
            room(
            room_name,
            room_type,
            id
            )
            `)
        .in("booking_uuid", ["ongoing" , "confirmed"])
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
