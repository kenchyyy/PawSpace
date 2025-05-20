// // app/api/customer/history/load-more/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';

// const ITEMS_PER_PAGE = 5;

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const page = searchParams.get('page');
//     const pageNumber = page ? parseInt(page, 10) : 1;
//     const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE - 1;

//     const supabase = createRouteHandlerClient({ cookies });
//     const { data: { session } } = await supabase.auth.getSession();

//     if (!session?.user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const userId = session.user.id;

//     const { data, error } = await supabase
//       .from('Booking')
//       .select(`
//         booking_uuid,
//         date_booked,
//         service_date_start,
//         service_date_end,
//         status,
//         special_requests,
//         total_amount,
//         discount_applied,
//         Owner (
//           id,
//           name,
//           address,
//           contact_number,
//           email
//         )
//       `)
//       .eq('owner_details', userId) // Use 'owner_details' for filtering
//       .order('date_booked', { ascending: false })
//       .range(startIndex, endIndex);

//     console.log("Supabase Data (load-more):", JSON.stringify(data, null, 2));
//     console.log("Supabase Error (load-more):", error);

//     if (error) {
//       console.error(`Error fetching booking history (page ${pageNumber}):`, error);
//       return NextResponse.json({ error: 'Failed to fetch more bookings' }, { status: 500 });
//     }

//     return NextResponse.json({
//       bookings: data.map(booking => ({
//         booking_uuid: booking.booking_uuid,
//         date_booked: booking.date_booked,
//         service_date_start: booking.service_date_start,
//         service_date_end: booking.service_date_end,
//         status: booking.status,
//         special_requests: booking.special_requests || '',
//         discount_applied: booking.discount_applied || 0,
//         owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner as OwnerDetails,
//       })) as BookingRecord[]
//     }, { status: 200 });
//   } catch (error: unknown) {
//     console.error('An unexpected error occurred:', error);
//     return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
//   }
// }









// working code///////////

// // app/api/customer/history/load-more/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';

// const ITEMS_PER_PAGE = 5;

// export async function GET(request: NextRequest) {
//     try {
//         const searchParams = request.nextUrl.searchParams;
//         const page = searchParams.get('page');
//         const pageNumber = page ? parseInt(page, 10) : 1;
//         const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
//         const endIndex = startIndex + ITEMS_PER_PAGE - 1;

//         const supabase = createRouteHandlerClient({ cookies });
//         const { data: { session } } = await supabase.auth.getSession();

//         if (!session?.user) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const userId = session.user.id;

//         const { data, error } = await supabase
//             .from('Booking')
//             .select(`
//                 booking_uuid,
//                 date_booked,
//                 service_date_start,
//                 service_date_end,
//                 status,
//                 special_requests,
//                 total_amount,
//                 discount_applied,
//                 Owner (
//                     id,
//                     name,
//                     address,
//                     contact_number,
//                     email
//                 ),
//                 Pet (
//                     pet_uuid,
//                     name,
//                     pet_type,
//                     grooming_id,
//                     boarding_id_extension,
//                     GroomingPet (
//                         id,
//                         service_variant
//                     ),
//                     BoardingPet (
//                         id,
//                         boarding_type
//                     )
//                 )
//             `)
//             .eq('owner_details', userId)
//             .order('date_booked', { ascending: false })
//             .range(startIndex, endIndex);

//         console.log("Supabase Data (load-more) with Pets:", JSON.stringify(data, null, 2));
//         console.log("Supabase Error (load-more) with Pets:", error);

//         if (error) {
//             console.error(`Error fetching booking history with pets (page ${pageNumber}):`, error);
//             return NextResponse.json({ error: 'Failed to fetch more bookings with pet details' }, { status: 500 });
//         }

//         return NextResponse.json({
//             bookings: data.map(booking => ({
//                 booking_uuid: booking.booking_uuid,
//                 date_booked: booking.date_booked,
//                 service_date_start: booking.service_date_start,
//                 service_date_end: booking.service_date_end,
//                 status: booking.status,
//                 special_requests: booking.special_requests ?? null,
//                 total_amount: booking.total_amount,
//                 discount_applied: booking.discount_applied ?? null,
//                 owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner as OwnerDetails,
//                 pets: booking.Pet ? booking.Pet.map(pet => ({
//                     pet_uuid: pet.pet_uuid,
//                     name: pet.name,
//                     pet_type: pet.pet_type,
//                     grooming_id: pet.grooming_id ?? null,
//                     groom_service: Array.isArray(pet.GroomingPet) && pet.GroomingPet.length > 0
//                         ? { id: pet.GroomingPet[0].id, groom_type: pet.GroomingPet[0].service_variant }
//                         : null,
//                     boarding_id_extension: pet.boarding_id_extension ?? null,
//                     boarding_pet: Array.isArray(pet.BoardingPet) && pet.BoardingPet.length > 0
//                         ? { id: pet.BoardingPet[0].id, boarding_type: pet.BoardingPet[0].boarding_type }
//                         : null,
//                 })) : [],
//             })) as BookingRecord[]
//         }, { status: 200 });
//     } catch (error: unknown) {
//         console.error('An unexpected error occurred:', error);
//         return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
//     }
// }





////////without auth//////////////////


// app/api/customer/history/load-more/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';

// const ITEMS_PER_PAGE = 5;

// export async function GET(request: NextRequest) {
//     try {
//         const searchParams = request.nextUrl.searchParams;
//         const page = searchParams.get('page');
//         const pageNumber = page ? parseInt(page, 10) : 1;
//         const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
//         const endIndex = startIndex + ITEMS_PER_PAGE - 1;

//         const supabase = createRouteHandlerClient({ cookies });
//         // Removed session check

//         const { data, error } = await supabase
//             .from('Booking')
//             .select(`
//                 booking_uuid,
//                 date_booked,
//                 service_date_start,
//                 service_date_end,
//                 status,
//                 special_requests,
//                 total_amount,
//                 discount_applied,
//                 Owner (
//                     id,
//                     name,
//                     address,
//                     contact_number,
//                     email
//                 ),
//                 Pet (
//                     pet_uuid,
//                     name,
//                     pet_type,
//                     grooming_id,
//                     boarding_id_extension,
//                     GroomingPet (
//                         id,
//                         service_variant
//                     ),
//                     BoardingPet (
//                         id,
//                         boarding_type
//                     )
//                 )
//             `)
//             .order('date_booked', { ascending: false })
//             .range(startIndex, endIndex);

//         console.log("Supabase Data (load-more) with Pets:", JSON.stringify(data, null, 2));
//         console.log("Supabase Error (load-more) with Pets:", error);

//         if (error) {
//             console.error(`Error fetching booking history with pets (page ${pageNumber}):`, error);
//             return NextResponse.json({ error: 'Failed to fetch more bookings with pet details' }, { status: 500 });
//         }

//         return NextResponse.json({
//             bookings: data.map(booking => ({
//                 booking_uuid: booking.booking_uuid,
//                 date_booked: booking.date_booked,
//                 service_date_start: booking.service_date_start,
//                 service_date_end: booking.service_date_end,
//                 status: booking.status,
//                 special_requests: booking.special_requests ?? null,
//                 total_amount: booking.total_amount,
//                 discount_applied: booking.discount_applied ?? null,
//                 owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner as OwnerDetails,
//                 pets: booking.Pet ? booking.Pet.map(pet => ({
//                     pet_uuid: pet.pet_uuid,
//                     name: pet.name,
//                     pet_type: pet.pet_type,
//                     grooming_id: pet.grooming_id ?? null,
//                     groom_service: Array.isArray(pet.GroomingPet) && pet.GroomingPet.length > 0
//                         ? { id: pet.GroomingPet[0].id, service_variant: pet.GroomingPet[0].service_variant }
//                         : null,
//                     boarding_id_extension: pet.boarding_id_extension ?? null,
//                     boarding_pet: Array.isArray(pet.BoardingPet) && pet.BoardingPet.length > 0
//                         ? { id: pet.BoardingPet[0].id, boarding_type: pet.BoardingPet[0].boarding_type }
//                         : null,
//                 })) : [],
//             })) as BookingRecord[]
//         }, { status: 200 });
//     } catch (error: unknown) {
//         console.error('An unexpected error occurred:', error);
//         return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
//     }
// }



///fixed cookie without auth///

// app/api/customer/history/load-more/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';

const ITEMS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page');
        const pageNumber = page ? parseInt(page, 10) : 1;
        const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE - 1;

        const cookieStore = cookies(); // Get the cookie store
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore }); // Pass the cookie store

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
                    pet_type,
                    grooming_id,
                    boarding_id_extension,
                    GroomingPet (
                        id,
                        service_variant
                    ),
                    BoardingPet (
                        id,
                        boarding_type
                    )
                )
            `)
            .order('date_booked', { ascending: false })
            .range(startIndex, endIndex);

        console.log("Supabase Data (load-more) with Pets:", JSON.stringify(data, null, 2));
        console.log("Supabase Error (load-more) with Pets:", error);

        if (error) {
            console.error(`Error fetching more bookings with pets (page ${pageNumber}):`, error);
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
                owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner as OwnerDetails,
                pets: booking.Pet ? booking.Pet.map(pet => ({
                    pet_uuid: pet.pet_uuid,
                    name: pet.name,
                    pet_type: pet.pet_type,
                    grooming_id: pet.grooming_id ?? null,
                    groom_service: Array.isArray(pet.GroomingPet) && pet.GroomingPet.length > 0
                        ? { id: pet.GroomingPet[0].id, service_variant: pet.GroomingPet[0].service_variant }
                        : null,
                    boarding_id_extension: pet.boarding_id_extension ?? null,
                    boarding_pet: Array.isArray(pet.BoardingPet) && pet.BoardingPet.length > 0
                        ? { id: pet.BoardingPet[0].id, boarding_type: pet.BoardingPet[0].boarding_type }
                        : null,
                })) : [],
            })) as BookingRecord[]
        }, { status: 200 });
    } catch (error: unknown) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}



//// fixed cookie with auth///////

// app/api/customer/history/load-more/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';

// const ITEMS_PER_PAGE = 5;

// export async function GET(request: NextRequest) {
//     try {
//         const searchParams = request.nextUrl.searchParams;
//         const page = searchParams.get('page');
//         const pageNumber = page ? parseInt(page, 10) : 1;
//         const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
//         const endIndex = startIndex + ITEMS_PER_PAGE - 1;

//         const cookieStore = cookies();
//         const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

//         const {
//             data: { session },
//             error: sessionError,
//         } = await supabase.auth.getSession();

//         if (sessionError || !session?.user) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const userId = session.user.id;

//         const { data, error } = await supabase
//             .from('Booking')
//             .select(`
//                 booking_uuid,
//                 date_booked,
//                 service_date_start,
//                 service_date_end,
//                 status,
//                 special_requests,
//                 total_amount,
//                 discount_applied,
//                 approvalStatus,
//                 cancellationReason,
//                 Owner (
//                     id,
//                     name,
//                     address,
//                     contact_number,
//                     email
//                 ),
//                 Pet (
//                     pet_uuid,
//                     name,
//                     pet_type,
//                     grooming_id,
//                     boarding_id_extension,
//                     GroomingPet (
//                         id,
//                         service_variant
//                     ),
//                     BoardingPet (
//                         id,
//                         boarding_type
//                     )
//                 )
//             `)
//             .eq('owner_details', userId)
//             .order('date_booked', { ascending: false })
//             .range(startIndex, endIndex);

//         console.log("Supabase Data (load-more) with Pets for User:", JSON.stringify(data, null, 2));
//         console.log("Supabase Error (load-more) with Pets for User:", error);

//         if (error) {
//             console.error(`Error fetching more bookings with pets for user (page ${pageNumber}):`, error);
//             return NextResponse.json({ error: 'Failed to fetch more bookings with pet details' }, { status: 500 });
//         }

//         return NextResponse.json({
//             bookings: data.map(booking => ({
//                 booking_uuid: booking.booking_uuid,
//                 date_booked: booking.date_booked,
//                 service_date_start: booking.service_date_start,
//                 service_date_end: booking.service_date_end,
//                 status: booking.status,
//                 special_requests: booking.special_requests ?? null,
//                 total_amount: booking.total_amount,
//                 discount_applied: booking.discount_applied ?? null,
//                 approvalStatus: booking.approvalStatus ?? null,
//                 cancellationReason: booking.cancellationReason ?? null,
//                 owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner as OwnerDetails,
//                 pets: booking.Pet ? booking.Pet.map(pet => ({
//                     pet_uuid: pet.pet_uuid,
//                     name: pet.name,
//                     pet_type: pet.pet_type,
//                     grooming_id: pet.grooming_id ?? null,
//                     groom_service: Array.isArray(pet.GroomingPet) && pet.GroomingPet.length > 0
//                         ? { id: pet.GroomingPet[0].id, service_variant: pet.GroomingPet[0].service_variant }
//                         : null,
//                     boarding_id_extension: pet.boarding_id_extension ?? null,
//                     boarding_pet: Array.isArray(pet.BoardingPet) && pet.BoardingPet.length > 0
//                         ? { id: pet.BoardingPet[0].id, boarding_type: pet.BoardingPet[0].boarding_type }
//                         : null,
//                 })) : [],
//             })) as BookingRecord[]
//         }, { status: 200 });
//     } catch (error: unknown) {
//         console.error('An unexpected error occurred:', error);
//         return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
//     }
// }