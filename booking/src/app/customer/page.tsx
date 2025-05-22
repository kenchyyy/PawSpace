'use client';
import { ReactNode, useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Modal from '@/_components/Modal';
import BoardingBookingForm from '@/_components/Booking Form/Forms/BoardingBookingForm';
import GroomingBookingForm from '@/_components/Booking Form/Forms/GroomingBookingForm';
import BookingHistory from '@/_components/Booking History/BookingHistory';
import { Booking } from '@/_components/Booking Form/types';
import { ClientBookingService } from '@/_components/Booking Form/clientBookingService';
import { toast } from 'sonner';
import { createBooking } from '@/_components/Booking Form/bookingService';
import { createClientSideClient } from '@/lib/supabase/CreateClientSideClient';

interface CustomerPageProps {
  children?: ReactNode;
  activeTab?: 'home' | 'history' | 'about-us';
}

export default function CustomerPage({
  children,
  activeTab = 'home'
}: CustomerPageProps) {
  const router = useRouter();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<'boarding' | 'grooming' | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabaseClient = createClientSideClient();

  const unavailableDates: Date[] = [];
  const unavailableTimes: string[] = [];

  useEffect(() => {
    if (!supabaseClient) {
      console.warn('Supabase client not yet initialized.');
      return;
    }

    const bookingService = new ClientBookingService(supabaseClient);

    const fetchBookings = async (retryCount = 0) => {
      setLoading(true);
      setError(null);

      try {
        const { user, error: userError } = await bookingService.getCurrentUser();
        if (userError || !user) {
          throw new Error(userError || 'User not authenticated');
        }

        const allBookings = await bookingService.getBookings();

        const userBookings = allBookings.filter((booking: Booking) =>
          booking.owner_details?.email === user.email
        );

        setBookings(userBookings || []);
      } catch (err: any) {
        if (retryCount < 3) {
          setTimeout(() => fetchBookings(retryCount + 1), 1000 * (retryCount + 1));
          return;
        }
        const errorMessage = err.message || 'Failed to fetch bookings';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [supabaseClient]);

  const handleNewBooking = useCallback(async (newBookings: Booking[]): Promise<{ success: boolean; bookingId?: string }> => {
    if (!supabaseClient) {
      console.error('Supabase client not initialized when creating booking.');
      toast.error('Failed to create booking: Supabase client not ready.');
      return { success: false };
    }

    const bookingResults = await Promise.all(
      newBookings.map(async (booking) => {
        return await createBooking(
          booking.owner_details,
          [booking.pet],
          [booking.total_amount],
          [booking.discount_applied || 0]
        );
      })
    );

    const failedBooking = bookingResults.find(result => !result.success);
    if (failedBooking) {
      toast.error(failedBooking.error || 'One or more bookings failed');
      return { success: false };
    }

    setBookings(prev => [...prev, ...newBookings]);
    setShowBookingForm(false);
    setSelectedService(null);
    router.push('/customer/history');

    return { success: true, bookingId: bookingResults[0]?.bookingId };
  }, [supabaseClient, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      {activeTab === 'home' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to Pawspace</h2>
          <p className="mb-6 text-gray-600">
            Book professional grooming or overnight stay services for your pets.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => {
                setSelectedService('boarding');
                setShowBookingForm(true);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors flex-1"
            >
              <FiPlus className="mr-2" />
              Book Boarding
            </button>

            <button
              onClick={() => {
                setSelectedService('grooming');
                setShowBookingForm(true);
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition-colors flex-1"
            >
              <FiPlus className="mr-2" />
              Book Grooming
            </button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <BookingHistory bookings={bookings} />
          )}
        </div>
      )}

      {activeTab === 'about-us' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">About Pawspace</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Pawspace is your premier destination for pet care services.
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Professional grooming services for dogs and cats</li>
              <li>Comfortable boarding facilities for your pets</li>
              <li>Experienced and caring staff</li>
              <li>Customized care for each pet's needs</li>
            </ul>
          </div>
        </div>
      )}

      <Modal
        isOpen={showBookingForm}
        onClose={() => {
          setShowBookingForm(false);
          setSelectedService(null);
        }}
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedService === 'boarding' && (
            <BoardingBookingForm
              onConfirmBooking={handleNewBooking}
              onClose={() => {
                setShowBookingForm(false);
                setSelectedService(null);
              }}
              unavailableDates={unavailableDates}
              unavailableTimes={unavailableTimes}
            />
          )}

          {selectedService === 'grooming' && (
            <GroomingBookingForm
              onConfirmBooking={handleNewBooking}
              onClose={() => {
                setShowBookingForm(false);
                setSelectedService(null);
              }}
              unavailableDates={unavailableDates}
              unavailableTimes={unavailableTimes}
            />
          )}
        </div>
      </Modal>

      {children}
    </div>
  );
}