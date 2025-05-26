"use server"

import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { format } from "date-fns";

type PetFieldFilter = {
  field: 'boarding_id_extension' | 'grooming_id';
  hasField: boolean; // true = keep bookings with at least one pet that has this field set
};


export interface OwnerDetails {
  id: string | null;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
}

export interface FormattedBooking {
  bookingUUID: string;
  dateBooked: string;
  serviceDateStart: string;
  serviceDateEnd: string;
  totalAmount: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing' ;
  specialRequests: string;
  ownerDetails: OwnerDetails;
}

export async function getCancelledBookingMessageByBookingUuid(bookingUuid : string): Promise<{message: string | null; date: string | null}> {
    const supabase = createClientSideClient();
    const { data, error} = await supabase
    .from("CancelMessages")
    .select(`
      message,
      date_submitted
      `)
    .eq("booking_uuid", bookingUuid)
    .single()
    
    if (error){
      return {message: null, date: null}
    }

    return {message: data.message, date: format(new Date(data.date_submitted), 'MMMM d, yyyy, h:mm a')}
}

export async function AddCancelBookingMessage(message: string, bookingUuid: string): Promise<(string | null)>{
  const supabase = createClientSideClient();
  const now = new Date();
  // Format as 'YYYY-MM-DD HH:mm:ss'
  const formattedDate = now.toISOString().replace('T', ' ').slice(0, 19);
  // Send `formattedDate` to your database

  const {data, error} = await supabase
  .from("CancelMessages")
  .insert([{  
    booking_uuid: bookingUuid,
    message: message,
    date_submitted: formattedDate,
  }])

  if (error) {
    return null
  }
  return "success"
}

export async function GetBookingDataByStatus(
  from: number,
  to: number,
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing',
  petFilter?: PetFieldFilter
): Promise<{ message: string; returnData?: Array<FormattedBooking> | null }> {
  const supabase = createClientSideClient();
  const { data, error } = await supabase
    .from("Booking")
    .select(`*,
        owner_details(
        id,
       name,  
        address,
        contact_number,
        email)
        `)
    .range(from, to)
    .eq("status", bookingStatus)
    .order("service_date_start", { ascending: false });

  if (error) {
    return { message: "Fetching Error", returnData: null };
  }

  const bookingIds = data.map(b => b.booking_uuid);

  const { data: pets } = await supabase
    .from("Pet")
    .select("booking_uuid, boarding_id_extension, grooming_id")
    .in("booking_uuid", bookingIds);

  // Group pets by booking_uuid
  const petsByBooking: Record<string, any[]> = {};
  pets?.forEach(pet => {
    if (!petsByBooking[pet.booking_uuid]) {
      petsByBooking[pet.booking_uuid] = [];
    }
    petsByBooking[pet.booking_uuid].push(pet);
  });

  // If no pet filter, return all bookings
  let filteredData = data;
  if (petFilter) {
      filteredData = data.filter(booking => {
        const bookingPets = petsByBooking[booking.booking_uuid] || [];

        if (bookingPets.length === 0) {
          // No pets for this booking: handle as you prefer
          // If you want to include bookings with no pets, adjust this logic
          return petFilter.hasField ? false : true; // or your preference
        }
        if (petFilter.hasField) {
          // Keep bookings with at least one pet that has the field set
          return bookingPets.some(pet => {
                return pet[petFilter.field] !== null;
          });
        } else {
          // Keep bookings where no pet has the field set (all pets have it null)
          return bookingPets.every(pet => pet[petFilter.field] === null);
        }
      });
    }


  const formattedData: FormattedBooking[] = filteredData.map((item) => ({
    bookingUUID: item.booking_uuid,
    dateBooked: item.date_booked,
    serviceDateStart: item.service_date_start,
    serviceDateEnd: item.service_date_end,
    status: item.status,
    specialRequests: item.special_requests,
    totalAmount: item.total_amount,
    ownerDetails: {
      id: item.owner_details?.id ?? "",
      name: item.owner_details?.name ?? "",
      address: item.owner_details?.address ?? "",
      contactNumber: item.owner_details?.contact_number ?? "",
      email: item.owner_details?.email ?? "",
    },
  }));

  return { message: "Booking data fetched successfully", returnData: formattedData };
}


export async function GetBookingDataByDateRange(
  from: number,
  to: number,
  targetDate: Date,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing' | 'confirmed&ongoing',
  petFilter?: PetFieldFilter,
): Promise<{ message: string; returnData?: FormattedBooking[] | null }> {
  const supabase = createClientSideClient();

  // Set start and end of day in UTC to avoid timezone shifts
  const startOfDay = new Date(Date.UTC(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    0, 0, 0, 0
  ));
  const endOfDay = new Date(Date.UTC(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    23, 59, 59, 999
  ));
  const startISO = startOfDay.toISOString();
  const endISO = endOfDay.toISOString();

  const { data, error } = await supabase
    .from("Booking")
    .select(`*,
      owner_details(
        id,
        name,
        address,
        contact_number,
        email
      )`)
    .range(from, to)
    .in("status", (status === 'confirmed&ongoing' ? ["confirmed", "ongoing"]  : [status]) )
    .or(
      `and(service_date_start.gte.${startISO},service_date_start.lte.${endISO}),` +
      `and(service_date_end.gte.${startISO},service_date_end.lte.${endISO})`
    )
    .order("service_date_start", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return { message: "Fetching Error: " + error.message, returnData: null };
  }

  const bookingIds = data.map(b => b.booking_uuid);

  const { data: pets } = await supabase
    .from("Pet")
    .select("booking_uuid, boarding_id_extension, grooming_id")
    .in("booking_uuid", bookingIds);

  // Group pets by booking_uuid
  const petsByBooking: Record<string, any[]> = {};
  pets?.forEach(pet => {
    if (!petsByBooking[pet.booking_uuid]) {
      petsByBooking[pet.booking_uuid] = [];
    }
    petsByBooking[pet.booking_uuid].push(pet);
  });

  // If no pet filter, return all bookings
  let filteredData = data;
  if (petFilter) {
    filteredData = data.filter(booking => {
      const bookingPets = petsByBooking[booking.booking_uuid] || [];

      if (bookingPets.length === 0) {
        // No pets for this booking: handle as you prefer
        // If you want to include bookings with no pets, adjust this logic
        return petFilter.hasField ? false : true; // or your preference
      }
      if (petFilter.hasField) {
        // Keep bookings with at least one pet that has the field set
        return bookingPets.some(pet => {
          return pet[petFilter.field] !== null;
        });
      } else {
        // Keep bookings where no pet has the field set (all pets have it null)
        return bookingPets.every(pet => pet[petFilter.field] === null);
      }
    });
  }

  const formattedData = filteredData.map((item) => ({
    bookingUUID: item.booking_uuid,
    dateBooked: item.date_booked,
    serviceDateStart: item.service_date_start,
    serviceDateEnd: item.service_date_end,
    status: item.status,
    specialRequests: item.special_requests,
    totalAmount: item.total_amount,
    ownerDetails: {
      id: item.owner_details?.id ?? "",
      name: item.owner_details?.name ?? "",
      address: item.owner_details?.address ?? "",
      contactNumber: item.owner_details?.contact_number ?? "",
      email: item.owner_details?.email ?? "",
    },
  }));

  return { message: "Booking data fetched successfully", returnData: formattedData };
}





export async function updateBookingStatus(bookingUUID: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing'): Promise<{message: string}> {
    const supabase = createClientSideClient();
    const { data, error } = await supabase
        .from("Booking")
        .update({ status })
        .eq("booking_uuid", bookingUUID)
    if (error) {
        return {message: "Update Error"};
    }
    return {message: "Booking data updated successfully"};
}