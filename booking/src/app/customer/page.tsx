"use client";
import { ReactNode } from "react";
import { FiPlus } from "react-icons/fi";
import CustomerDashboardHeader from "@/_components/Customer Dashoard/Header";
import { useState } from "react";
import { Booking } from "@/_components/Booking Form/types";
import { useRouter } from "next/navigation";
import Modal from "@/_components/Modal";
import BoardingBookingForm from '@/_components/Booking Form/Forms/BoardingBookingForm';
import GroomingBookingForm from '@/_components/Booking Form/Forms/GroomingBookingForm';

const CustomerPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"home" | "history" | "about">(
    "home"
  );
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<'boarding' | 'grooming' | null>(null);

  const handleCloseModal = () => {
    setShowBookingForm(false);
    setSelectedService(null); // Reset selected service when modal closes
  };

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
        {/* This button will need to decide which form to open, or open a service selection modal first */}
        <button
          onClick={() => setShowBookingForm(true)} // This currently just opens the modal, you'll need to select a service first if you want specific forms
          className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center transition-colors'
        >
          <FiPlus className='mr-2' />
          Create New Booking
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6"> {/* Added margin-top for spacing */}
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

      <Modal isOpen={showBookingForm} onClose={handleCloseModal}>
        <div className='bg-white rounded-xl shadow-xl w-full max-w-4xl p-6'> {/* Added padding to the modal content */}
          {selectedService === 'boarding' && (
            <BoardingBookingForm onClose={handleCloseModal} />
          )}
          {selectedService === 'grooming' && (
            <GroomingBookingForm onClose={handleCloseModal} />
          )}
          {/* Optional: Add a message or a way to select a service if none is selected */}
          {!selectedService && (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Select a Service to Book</h3>
              <p className="text-gray-600">Please choose either Boarding or Grooming to proceed.</p>
            </div>
          )}
        </div>
      </Modal>

      <div className='mt-6'>
        {activeTab === "home" && <div>Home content</div>}
        {activeTab === "history" && <div>History content</div>}
        {activeTab === "about" && <div>About content</div>}
      </div>
    </div>
  );
};

export default CustomerPage;