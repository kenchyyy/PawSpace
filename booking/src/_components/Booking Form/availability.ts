import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ROOM_CAPACITY: Record<string, number> = {
  small: 3,
  medium: 6,
  large: 2,
  cat_small: 3,
  cat_large: 3
};

export interface AvailabilityParams {
  roomSize: string;
  start: string;
  end: string;
}

export interface AvailabilityResponse {
  roomSize: string;
  totalRooms: number;
  occupiedCount: number;
  availableRooms: number;
}

interface SupabasePetRoom {
  room: number | null;
}

interface SupabaseBookingData {
  service_date_start: string;
  service_date_end: string;
  Pet: SupabasePetRoom[]; 
}

export async function checkAvailability(params: AvailabilityParams): Promise<AvailabilityResponse> {
  try {
    const { roomSize, start, end } = params;

    if (!roomSize || !start || !end) {
      throw new Error('Missing required parameters');
    }

    const { data: rooms, error: roomsError } = await supabase
      .from('Room')
      .select('id')
      .eq('room_type', roomSize);

    if (roomsError) throw roomsError;

    const totalRooms = rooms?.length || 0;
    if (totalRooms === 0) {
      return {
        roomSize,
        totalRooms: 0,
        occupiedCount: 0,
        availableRooms: 0
      };
    }

    const { data: bookingsRaw, error: bookingsError } = await supabase
      .from('Booking')
      .select('service_date_start, service_date_end, Pet!inner(room)') 
      .lt('service_date_start', end)
      .gt('service_date_end', start)
      .eq('status', 'confirmed');

    if (bookingsError) throw bookingsError;

    const bookings: SupabaseBookingData[] = bookingsRaw as SupabaseBookingData[];

    const occupiedRooms = new Set<number>();
    
    bookings.forEach(booking => {
        booking.Pet.forEach(pet => {
            if (pet.room !== null && pet.room !== undefined) {
                occupiedRooms.add(pet.room);
            }
        });
    });
    
    const occupiedCount = occupiedRooms.size;
    const availableRooms = Math.max(totalRooms - occupiedCount, 0);

    return {
      roomSize,
      totalRooms,
      occupiedCount,
      availableRooms
    };

  } catch (error) {
    console.error('Error checking availability:', error); 
    throw new Error('Failed to check room availability');
  }
}