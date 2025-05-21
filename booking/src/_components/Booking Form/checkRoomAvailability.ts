// checkRoomAvailability.ts
import { Request, Response } from 'express';
import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
import { SupabaseClient } from '@supabase/supabase-js'; 

const checkRoomAvailability = async (req: Request, res: Response) => {
    const {
        selectedRoomSize,
        selectedPetType,
        requestedCheckInDate,
        requestedCheckInTime,
        requestedCheckOutDate,
        requestedCheckOutTime
    } = req.body;

    try {
        const supabase = await createServerSideClient();

        const checkInTimestamp = `${requestedCheckInDate}T${requestedCheckInTime}:00`;
        const checkOutTimestamp = `${requestedCheckOutDate}T${requestedCheckOutTime}:00`;

        const { data: occupiedPetsData1, error: occupiedError1 } = await supabase
            .from('Pet')
            .select('room, Room(room_type)')
            .not('booking_uuid', 'is', null)
            .eq('pet_type', selectedPetType)
            .lt('check_in_date_time', checkOutTimestamp)
            .gt('check_out_date_time', checkInTimestamp);

        if (occupiedError1) {
            console.error('Error fetching occupied pets (Query 1):', occupiedError1);
            throw occupiedError1;
        }

        const filteredOccupiedPets1 = occupiedPetsData1.filter(pet =>
            (pet as any).Room?.room_type === selectedRoomSize
        );
        const occupiedCount1 = new Set(filteredOccupiedPets1.map(p => (p as any).room)).size;


        const { data: occupiedPetsData2, error: occupiedError2 } = await supabase
            .from('Pet')
            .select('room, BoardingPet(check_in_date_time, check_out_date_time), Room(room_type)')
            .not('booking_uuid', 'is', null);

        if (occupiedError2) {
            console.error('Error fetching occupied pets (Query 2):', occupiedError2);
            throw occupiedError2;
        }

        const filteredOccupiedPets2 = occupiedPetsData2.filter(pet => {
            const boardingPet = (pet as any).BoardingPet;
            const roomData = (pet as any).Room;

            if (!boardingPet || !roomData) return false;
            if (roomData.room_type !== selectedRoomSize) return false;
            if (!boardingPet.check_in_date_time || !boardingPet.check_out_date_time) return false;

            const existingCheckInTimestamp = boardingPet.check_in_date_time;
            const existingCheckOutTimestamp = boardingPet.check_out_date_time;

            return existingCheckInTimestamp < checkOutTimestamp && existingCheckOutTimestamp > checkInTimestamp;
        });
        const occupiedCount2 = new Set(filteredOccupiedPets2.map(p => (p as any).room)).size;


        const { count: totalCapacity, error: totalRoomsError } = await supabase
            .from('Room')
            .select('*', { count: 'exact' })
            .eq('room_type', selectedRoomSize);

        if (totalRoomsError) {
            console.error('Error fetching total room capacity:', totalRoomsError);
            throw totalRoomsError;
        }

        const totalOccupied = Math.max(occupiedCount1, occupiedCount2);
        const availableRooms = (totalCapacity || 0) - totalOccupied;

        res.json({ available: availableRooms > 0, count: availableRooms });

    } catch (error) {
        console.error('An unexpected error occurred during room availability check:', error);
        res.status(500).json({ error: 'Failed to check room availability due to an internal error.' });
    }
};

export default checkRoomAvailability;