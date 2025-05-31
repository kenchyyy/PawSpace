'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Modal from '@/_components/Modal';
import BoardingBookingForm from '@/_components/Booking Form/Forms/BoardingBookingForm';
import GroomingBookingForm from '@/_components/Booking Form/Forms/GroomingBookingForm';
import { Pet, OwnerDetails, BookingResult } from '@/_components/Booking Form/types';
import { toast } from 'sonner';
import CustomerDashboardHeader from "@/_components/Customer Dashoard/Header";
import ServiceDetailsModal from "@/_components/Services/ServiceDetailsModal";
import OvernightServicesSection from "@/_components/Services/accommodation/OvernightServiceSection";
import GroomingServicesSection from "@/_components/Services/grooming/GroomingServiceSection";
import { serviceDetailsMap } from "@/_components/Services/data/serviceData";

import { createBooking } from '@/_components/Booking Form/bookingService';

type TabType = 'home' | 'history' | 'about';

export default function CustomerPage() {
  const searchParams = useSearchParams();
  const initialTabFromUrl = searchParams.get('tab') as TabType;
  const validInitialTab = ['home', 'history', 'about'].includes(initialTabFromUrl)
    ? initialTabFromUrl
    : 'home';

  const [activeTab, setActiveTab] = useState<TabType>(validInitialTab);
  const [showBookingFormModal, setShowBookingFormModal] = useState(false);
  const [selectedServiceTypeForBooking, setSelectedServiceTypeForBooking] = useState<'boarding' | 'grooming' | null>(null);

  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState<string | null>(null);

  useEffect(() => {
    const newTabFromUrl = searchParams.get('tab') as TabType;
    if (newTabFromUrl && ['home', 'history', 'about'].includes(newTabFromUrl) && newTabFromUrl !== activeTab) {
      setActiveTab(newTabFromUrl);
    }
  }, [searchParams, activeTab]);

  const handleNewBooking = async (
    ownerDetails: OwnerDetails,
    pets: Pet[],
    totalAmounts: number[],
    discountsApplied?: number[]
  ): Promise<BookingResult> => {
    try {
      const result = await createBooking(ownerDetails, pets, totalAmounts, discountsApplied || []);
      if (result.success) {
        toast.success('Booking confirmed successfully!');
        closeBookingFormModal();
      } else {
        toast.error(`Booking failed: ${result.error}`);
      }
      return result;
    } catch (error) {
      toast.error('An unexpected error occurred during booking.');
      return { success: false, error: 'An unexpected error occurred during booking.' };
    }
  };

  const openBookingFormModal = (serviceCategory: 'boarding' | 'grooming' | null = null) => {
    setSelectedServiceTypeForBooking(serviceCategory);
    setShowBookingFormModal(true);
    setSelectedServiceForDetails(null);
  };

  const closeBookingFormModal = () => {
    setShowBookingFormModal(false);
    setSelectedServiceTypeForBooking(null);
  };

  const handleSelectServiceForDetails = (serviceKey: string) => {
    setSelectedServiceForDetails(serviceKey);
  };

  const closeServiceDetailsModal = () => {
    setSelectedServiceForDetails(null);
  };

  return (
    <div className="container bg-purple-950 mx-auto px-4 md:px-16 lg:px-32 py-8">
      <CustomerDashboardHeader
        onOpenBookingForm={() => openBookingFormModal(null)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'home' && (
        <>
          <OvernightServicesSection setSelectedService={handleSelectServiceForDetails} />
          <GroomingServicesSection setSelectedService={handleSelectServiceForDetails} />
        </>
      )}

      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Booking History</h2>
          <p className="text-gray-600">Your past and upcoming bookings will appear here.</p>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">About Pawspace</h2>
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

      <ServiceDetailsModal
        isOpen={!!selectedServiceForDetails}
        onClose={closeServiceDetailsModal}
        details={selectedServiceForDetails ? serviceDetailsMap[selectedServiceForDetails] : null}
        onClick={(category: 'boarding' | 'grooming') => {
          closeServiceDetailsModal();
          openBookingFormModal(category);
        }}
      />

      <Modal isOpen={showBookingFormModal} onClose={closeBookingFormModal}>
        {selectedServiceTypeForBooking === 'boarding' ? (
          <BoardingBookingForm
            onConfirmBooking={handleNewBooking}
            onClose={closeBookingFormModal}
          />
        ) : selectedServiceTypeForBooking === 'grooming' ? (
          <GroomingBookingForm
            onConfirmBooking={handleNewBooking}
            onClose={closeBookingFormModal}
          />
        ) : (
          <div className="text-center py-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Select a Service Type</h3>
            <p className="text-gray-700 mb-4">
              Please choose either Boarding or Grooming to proceed with your booking.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => openBookingFormModal('boarding')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Book Boarding
              </button>
              <button
                onClick={() => openBookingFormModal('grooming')}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Book Grooming
              </button>
            </div>
            <button
              onClick={closeBookingFormModal}
              className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
