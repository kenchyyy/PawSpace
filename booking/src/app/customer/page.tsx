"use client";
import { ReactNode } from "react";
import { FiPlus } from "react-icons/fi";
import CustomerDashboardHeader from "@/_components/Customer Dashoard/Header";
import { useState } from "react";
import { Booking } from "@/_components/Booking Form/types";
import { useRouter } from "next/navigation";
import Modal from "@/_components/Modal";
import BookingForm from "@/_components/Booking Form/BookingForm";

const CustomerPage = () => {
  const router = useRouter();
  // Add local state for the activeTab instead of receiving it as props
  const [activeTab, setActiveTab] = useState<"home" | "history" | "about">(
    "home"
  );
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<'boarding' | 'grooming' | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  function handleNewBooking(newBookings: Booking[]) {
    setBookings([...bookings, ...newBookings]);
    setShowBookingForm(false);
    setSelectedService(null);
    router.push('/customer/history');

    return { success: true, bookingId: bookingResults[0]?.bookingId };
  }, [supabaseClient, router]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <CustomerDashboardHeader
        onOpenBookingForm={() => setShowBookingForm(true)}
      />
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-2xl font-bold mb-4'>Welcome to Pawspace</h2>
        <p className='mb-6 text-gray-600'>
          Book professional grooming or overnight stay services for your pets.
        </p>
        <button
          onClick={() => setShowBookingForm(true)}
          className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center transition-colors'
        >
          <FiPlus className='mr-2' />
          Create New Booking
        </button>
      </div>
      <Modal isOpen={showBookingForm} onClose={() => setShowBookingForm(false)}>
        <div className='bg-white rounded-xl shadow-xl w-full max-w-4xl'>
          <BookingForm
            onConfirmBooking={handleNewBooking}
            onClose={() => setShowBookingForm(false)}
          />
        </div>
      </Modal>

      {/* If you need to render children content based on the active tab */}
      <div className='mt-6'>
        {activeTab === "home" && <div>Home content</div>}
        {activeTab === "history" && <div>History content</div>}
        {activeTab === "about" && <div>About content</div>}
      </div>
    </div>
  );
};

export default CustomerPage;
