// app/customer/history/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Booking } from '@/_components/Booking History/types';
import BookingHistory from '@/_components/Booking History/BookingHistory';

export default function CustomerHistoryPage() {
  // Hardcoded sample bookings
  const bookings: Booking[] = [
    {
      id: '1',
      booking_uuid: 'b1',
      date_booked: '2023-11-15',
      service_date_start: '2023-12-10',
      service_date_end: '2023-12-15',
      status: 'confirmed',
      owner_details: {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, City',
        contact_number: '555-123-4567'
      },
      pet: {
        id: 'p1',
        name: 'Buddy',
        age: '3',
        pet_type: 'dog',
        breed: 'Golden Retriever',
        vaccinated: 'yes',
        size: 'large',
        vitamins_or_medications: 'None',
        allergies: 'None',
        special_requests: 'Needs extra walks',
        completed: false,
        service_type: 'boarding',
        room_size: 'large',
        boarding_type: 'overnight',
        check_in_date: '2023-12-10',
        check_in_time: '10:00 AM',
        check_out_date: '2023-12-15',
        check_out_time: '04:00 PM',
        meal_instructions: {
          breakfast: { time: '08:00', food: 'Kibble', notes: '1 cup' },
          lunch: { time: '12:00', food: 'Wet food', notes: '1 can' },
          dinner: { time: '06:00', food: 'Kibble', notes: '1.5 cups' }
        },
        special_feeding_request: 'Add fish oil to dinner'
      } as BoardingPet,
      special_requests: 'Please provide daily updates',
      total_amount: 800,
      discount_applied: 0
    },
    {
      id: '2',
      booking_uuid: 'b2',
      date_booked: '2023-11-20',
      service_date_start: '2023-12-05',
      service_date_end: '2023-12-05',
      status: 'completed',
      owner_details: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        address: '456 Oak Ave, Town',
        contact_number: '555-987-6543'
      },
      pet: {
        id: 'p2',
        name: 'Whiskers',
        age: '5',
        pet_type: 'cat',
        breed: 'Siamese',
        vaccinated: 'yes',
        size: 'small',
        vitamins_or_medications: 'Joint supplements',
        allergies: 'None',
        special_requests: 'Gentle handling please',
        completed: true,
        service_type: 'grooming',
        service_variant: 'standard',
        service_date: '2023-12-05',
        service_time: '02:00 PM'
      } as GroomingPet,
      special_requests: 'No perfumed products',
      total_amount: 450,
      discount_applied: 0.1 // 10% discount
    },
    {
      id: '3',
      booking_uuid: 'b3',
      date_booked: '2023-12-01',
      service_date_start: '2023-12-20',
      service_date_end: '2023-12-20',
      status: 'pending',
      owner_details: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        address: '789 Pine Rd, Village',
        contact_number: '555-456-7890'
      },
      pet: {
        id: 'p3',
        name: 'Rex',
        age: '2',
        pet_type: 'dog',
        breed: 'German Shepherd',
        vaccinated: 'yes',
        size: 'xlarge',
        vitamins_or_medications: 'None',
        allergies: 'Chicken',
        special_requests: 'Needs gentle introduction',
        completed: false,
        service_type: 'grooming',
        service_variant: 'deluxe',
        service_date: '2023-12-20',
        service_time: '11:00 AM'
      } as GroomingPet,
      special_requests: 'Use hypoallergenic shampoo',
      total_amount: 750,
      discount_applied: 0
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingHistory bookings={bookings} />
    </div>
  );
}