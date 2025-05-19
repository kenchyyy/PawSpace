

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
}

export interface BoardingPetData extends PetData {

}



export async function fetchBasicPetDataByBookingUUID(bookingUUID: string): Promise<{ message: string; returnData?: (any | null)}> {
    const supabase = createClientSideClient();
    const {data, error} = await supabase
        .from("Pet")
        .select(`pet_uuid,
            boarding_id_extention,
            grooming_id,
            completed,
            allergies,
            vitamins_or_medications,
            size,
            vaccinated,
            name,
            age,
            pet_type,
            breed
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
        breed: item.breed
    }));
    return {message: "Pet data fetched successfully", returnData: formattedData };

}

