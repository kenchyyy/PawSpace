import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { BookingRecord, OwnerDetails, BoardingType, GroomingType } from '@/_components/BookingHistory/types/bookingRecordType';

const ITEMS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page');
        const pageNumber = page ? parseInt(page, 10) : 1;
        const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE - 1;

        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        const { data, error } = await supabase
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
                        service_variant
                    ),
                    BoardingPet (
                        id,
                        boarding_type,
                        room_size,          
                        special_feeding_request
                    )
                )
            `)
            .eq('owner_details', userId)
            .order('date_booked', { ascending: false })
            .range(startIndex, endIndex);

        if (error) {
            console.error(`Error fetching more bookings with pets for user (page ${pageNumber}):`, error);
            return NextResponse.json({ error: 'Failed to fetch more bookings with pet details' }, { status: 500 });
        }

        return NextResponse.json({
            bookings: data.map(booking => ({
                booking_uuid: booking.booking_uuid,
                date_booked: booking.date_booked,
                service_date_start: booking.service_date_start,
                service_date_end: booking.service_date_end,
                status: booking.status,
                special_requests: booking.special_requests ?? null,
                total_amount: booking.total_amount,
                discount_applied: booking.discount_applied ?? null,
                owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner[0] as OwnerDetails,
                pets: booking.Pet ? booking.Pet.map(pet => {
                    const groomService = Array.isArray(pet.GroomingPet) && pet.GroomingPet.length > 0
                        ? pet.GroomingPet[0] as GroomingType
                        : (pet.GroomingPet && typeof pet.GroomingPet === 'object' && !Array.isArray(pet.GroomingPet)
                            ? pet.GroomingPet as GroomingType
                            : null);

                    const boardingPet = Array.isArray(pet.BoardingPet) && pet.BoardingPet.length > 0
                        ? pet.BoardingPet[0] as BoardingType
                        : (pet.BoardingPet && typeof pet.BoardingPet === 'object' && !Array.isArray(pet.BoardingPet)
                            ? pet.BoardingPet as BoardingType
                            : null);

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
                        groom_service: groomService,
                        boarding_id_extension: pet.boarding_id_extension ?? null, 
                        boarding_pet: boardingPet,
                    };
                }) : [],
            })) as BookingRecord[]
        }, { status: 200 });
    } catch (error: unknown) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}