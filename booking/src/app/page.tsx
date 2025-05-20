// // src/StoryComponents/BookingHistory/page.tsx
// 'use server';

// import React from 'react';
// import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
// import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';
// import BookingHistoryClient from '@/_components/BookingHistory/BookingHistoryClient';
// import { redirect } from 'next/navigation';
// import { SupabaseClient } from '@supabase/supabase-js';

// const ITEMS_PER_PAGE = 5;

// async function getBookingHistory(page: number, supabase: SupabaseClient, userId: string): Promise<{ bookings: BookingRecord[] | null; error: Error | null; totalCount: number | null }> {
//   const startIndex = (page - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE - 1;

//   try {
//     // Get the total count of bookings for the logged-in user
//     const { count, error: countError } = await supabase
//       .from('Booking')
//       .select('*', { count: 'exact' })
//       .eq('owner_details', userId); // Use 'owner_details' for filtering

//     if (countError) {
//       console.error('Error fetching total booking count:', countError);
//       return { bookings: null, error: countError, totalCount: null };
//     }

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

//     console.log("Supabase Data (page):", JSON.stringify(data, null, 2));
//     console.log("Supabase Error (page):", error);

//     if (error) {
//       console.error(`Error fetching booking history (page ${page}):`, error);
//       return { bookings: null, error, totalCount: null };
//     }

//     if (data) {
//       const bookingRecords = data.map(booking => ({
//         booking_uuid: booking.booking_uuid,
//         date_booked: booking.date_booked,
//         service_date_start: booking.service_date_start,
//         service_date_end: booking.service_date_end,
//         status: booking.status,
//         special_requests: booking.special_requests || '',
//         discount_applied: booking.discount_applied || 0,
//         owner_details: Array.isArray(booking.Owner) ? booking.Owner[0] as OwnerDetails : booking.Owner as OwnerDetails,
//       })) as BookingRecord[];
//       return { bookings: bookingRecords, error: null, totalCount: count };
//     }

//     return { bookings: null, error: null, totalCount: count };
//   } catch (error: unknown) {
//     console.error('An unexpected error occurred:', error);
//     return { bookings: null, error: new Error('Failed to fetch booking history'), totalCount: null };
//   }
// }

// export default async function BookingHistoryPage() {
//   const supabase = await createServerSideClient();
//   const { data: { session } } = await supabase.auth.getSession();

//   if (!session?.user) {
//     redirect('/login');
//   }

//   const userId = session.user.id; // Get the logged-in user's ID (this should match the 'id' in your 'Owner' table)
//   const { bookings: initialBookings, error: initialError, totalCount } = await getBookingHistory(1, supabase, userId);

//   return (
//     <div>
//       <BookingHistoryClient
//         bookings={initialBookings}
//         loading={!initialBookings && !initialError}
//         error={initialError}
//         totalCount={totalCount}
//       />
//     </div>
//   );
// }



/////////////workinggg code///////

// // src/StoryComponents/BookingHistory/page.tsx
// 'use server';

// import React from 'react';
// import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
// import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';
// import BookingHistoryClient from '@/_components/BookingHistory/BookingHistoryClient';
// import { redirect } from 'next/navigation';
// import { SupabaseClient } from '@supabase/supabase-js';

// const ITEMS_PER_PAGE = 5;

// async function getBookingHistory(page: number, supabase: SupabaseClient, userId: string): Promise<{ bookings: BookingRecord[] | null; error: Error | null; totalCount: number | null }> {
//     const startIndex = (page - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE - 1;

//     try {
//         // Get the total count of bookings for the logged-in user
//         const { count, error: countError } = await supabase
//             .from('Booking')
//             .select('*', { count: 'exact' })
//             .eq('owner_details', userId);

//         if (countError) {
//             console.error('Error fetching total booking count:', countError);
//             return { bookings: null, error: countError, totalCount: null };
//         }

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

//         console.log("Supabase Data (page) with Pets:", JSON.stringify(data, null, 2));
//         console.log("Supabase Error (page) with Pets:", error);

//         if (error) {
//             console.error(`Error fetching booking history with pets (page ${page}):`, error);
//             return { bookings: null, error, totalCount: null };
//         }

//         if (data) {
//             const bookingRecords = data.map(booking => ({
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
//             })) as BookingRecord[];
//             return { bookings: bookingRecords, error: null, totalCount: count };
//         }

//         return { bookings: null, error: null, totalCount: count };
//     } catch (error: unknown) {
//         console.error('An unexpected error occurred:', error);
//         return { bookings: null, error: new Error('Failed to fetch booking history with pets'), totalCount: null };
//     }
// }

// export default async function BookingHistoryPage() {
//     const supabase = await createServerSideClient();
//     const { data: { session } } = await supabase.auth.getSession();

//     if (!session?.user) {
//         redirect('/login');
//     }

//     const userId = session.user.id;
//     const { bookings: initialBookings, error: initialError, totalCount } = await getBookingHistory(1, supabase, userId);

//     return (
//         <div>
//             <BookingHistoryClient
//                 bookings={initialBookings}
//                 loading={!initialBookings && !initialError}
//                 error={initialError}
//                 totalCount={totalCount}
//             />
//         </div>
//     );
// }



////////without auth or login also used in fixing cookie/////////


// src/StoryComponents/BookingHistory/page.tsx
'use server';

import React from 'react';
import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';
import BookingHistoryClient from '@/_components/BookingHistory/BookingHistoryClient';
import { SupabaseClient } from '@supabase/supabase-js';

const ITEMS_PER_PAGE = 5;

async function getBookingHistory(page: number, supabase: SupabaseClient): Promise<{ bookings: BookingRecord[] | null; error: Error | null; totalCount: number | null }> {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    try {
        // Get the total count of bookings
        const { count, error: countError } = await supabase
            .from('Booking')
            .select('*', { count: 'exact' });

        if (countError) {
            console.error('Error fetching total booking count:', countError);
            return { bookings: null, error: countError, totalCount: null };
        }

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

        console.log("Supabase Data (page) with Pets:", JSON.stringify(data, null, 2));
        console.log("Supabase Error (page) with Pets:", error);

        if (error) {
            console.error(`Error fetching booking history with pets (page ${page}):`, error);
            return { bookings: null, error, totalCount: null };
        }

        if (data) {
            const bookingRecords = data.map(booking => ({
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
            })) as BookingRecord[];
            return { bookings: bookingRecords, error: null, totalCount: count };
        }

        return { bookings: null, error: null, totalCount: count };
    } catch (error: unknown) {
        console.error('An unexpected error occurred:', error);
        return { bookings: null, error: new Error('Failed to fetch booking history with pets'), totalCount: null };
    }
}

export default async function BookingHistoryPage() {
    const supabase = await createServerSideClient();
    // Removed session check and userId retrieval

    const { bookings: initialBookings, error: initialError, totalCount } = await getBookingHistory(1, supabase);

    return (
        <div>
            <BookingHistoryClient
                bookings={initialBookings}
                loading={!initialBookings && !initialError}
                error={initialError}
                totalCount={totalCount}
            />
        </div>
    );
}


//// cookie with auth////

// src/StoryComponents/BookingHistory/page.tsx
// 'use server';

// import React from 'react';
// import { createServerSideClient } from '@/lib/supabase/CreateServerSideClient';
// import { BookingRecord, OwnerDetails } from '@/_components/BookingHistory/types/bookingRecordType';
// import BookingHistoryClient from '@/_components/BookingHistory/BookingHistoryClient';
// import { redirect } from 'next/navigation';
// import { SupabaseClient } from '@supabase/supabase-js';

// const ITEMS_PER_PAGE = 5;

// async function getBookingHistory(page: number, userId: string, supabase: SupabaseClient): Promise<{ bookings: BookingRecord[] | null; error: Error | null; totalCount: number | null }> {
//     const startIndex = (page - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE - 1;

//     try {
//         // Get the total count of bookings for the logged-in user
//         const { count, error: countError } = await supabase
//             .from('Booking')
//             .select('*', { count: 'exact' })
//             .eq('owner_details', userId);

//         if (countError) {
//             console.error('Error fetching total booking count for user:', countError);
//             return { bookings: null, error: countError, totalCount: null };
//         }

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

//         console.log("Supabase Data (page) with Pets for User:", JSON.stringify(data, null, 2));
//         console.log("Supabase Error (page) with Pets for User:", error);

//         if (error) {
//             console.error(`Error fetching booking history with pets for user (page ${page}):`, error);
//             return { bookings: null, error, totalCount: null };
//         }

//         if (data) {
//             const bookingRecords = data.map(booking => ({
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
//             })) as BookingRecord[];
//             return { bookings: bookingRecords, error: null, totalCount: count };
//         }

//         return { bookings: null, error: null, totalCount: count };
//     } catch (error: unknown) {
//         console.error('An unexpected error occurred:', error);
//         return { bookings: null, error: new Error('Failed to fetch booking history with pets'), totalCount: null };
//     }
// }

// export default async function BookingHistoryPage() {
//     const supabase = await createServerSideClient();

//     const {
//         data: { session },
//         error: sessionError,
//     } = await supabase.auth.getSession();

//     if (sessionError || !session?.user) {
//         redirect('/login'); // Redirect to login page if no session
//     }

//     const userId = session.user.id;
//     const { bookings: initialBookings, error: initialError, totalCount } = await getBookingHistory(1, userId, supabase);

//     return (
//         <div>
//             <BookingHistoryClient
//                 bookings={initialBookings}
//                 loading={!initialBookings && !initialError}
//                 error={initialError}
//                 totalCount={totalCount}
//             />
//         </div>
//     );
// }