

import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";

interface MealInstruction {
    id: string;
    meal_type: string;
    time: string | null;
    food: string | null;
    notes: string | null;
}

export interface BasePetData{
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

export interface BoardingPetData extends BasePetData{
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
    boardingType: string;
    room_name?: string;
    room_type?: string;
    room_id?: string;
    mealInstructions: MealInstruction[]
}

export interface GroomingPetData extends BasePetData {
  serviceVariant: string;
  serviceDate: string;
  serviceTime: string;
}


export async function getBoardingPetDataByBookingUid(bookingUUID: string): Promise<{ message: string; returnData?: (any | null)}> {
    const supabase = createClientSideClient();
    const {data, error} = await supabase
        .from("Pet")
        .select(`*,
            boarding_id_extension(
            check_in_date,
            check_in_time,
            check_out_date,
            check_out_time,
            boarding_type,
            MealInstructions(*)
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

    const formattedData: BoardingPetData[] = data.map((item) => ({
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
        mealInstructions: item.boarding_id_extension?.MealInstructions ?? []

    }));
    return {message: "Pet data fetched successfully", returnData: formattedData };

}

export async function getGroomingPetDataByBookingUid(bookingUUID: string): Promise<{ message: string; returnData?: (GroomingPetData[] | null)}> {
    const supabase = createClientSideClient();
    const {data, error} = await supabase
        .from("Pet")
        .select(`*,
            GroomingPet:grooming_id ( * )
        `)
        .eq("booking_uuid", bookingUUID)
        
    if (error) {
        return {message: "Fetching Error", returnData: null};
    }
    if (data.length === 0) {
        return {message: "No pet data found", returnData: null};
    }

    const formattedData: GroomingPetData[] = data.map((item) => ({
        petUuid: item.pet_uuid,
        boardingIdExtention: item.boarding_id_extension ?? "",
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
        serviceVariant: item.GroomingPet?.service_variant ?? "",
        serviceDate: item.GroomingPet?.service_date ?? "",
        serviceTime: item.GroomingPet?.service_time ?? ""
    }));

    return {message: "Pet data fetched successfully", returnData: formattedData };
}

export async function fetchBasicPetDataByDate(date: string): Promise<{ message: string; returnData?: (any | null)}> {
    const supabase = createClientSideClient();
    const {data, error} = await supabase
        .from("Pet")
        .select(`*,
            booking_uuid!inner(
                status
            ),
            boarding_id_extension!inner(
                check_in_date,
                check_in_time,
                check_out_date,
                check_out_time,
                MealInstructions(*)
            ),
            room(
                room_name,
                room_type,
                id
            )
        `)
        .filter('booking_uuid.status', 'in', '("ongoing","confirmed")')
        .gte("boarding_id_extension.check_out_date", date)
        .lte("boarding_id_extension.check_in_date", date)
    if (error) {
        return {message: "Fetching Error", returnData: null};
    }
    if (data.length === 0) {
        return {message: "No pet data found", returnData: null};
    }

    const formattedData: BoardingPetData[] = data.map((item) => ({
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
        status: item.booking_uuid?.status ?? "",
        mealInstructions: item.boarding_id_extension?.MealInstructions ?? []


    }));
    return {message: "Pet data fetched successfully", returnData: formattedData };

}
