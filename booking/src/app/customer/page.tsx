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
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Space background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjIwIiByPSIxIi8+PGNpcmNsZSBjeD0iODAiIGN5PSIxNSIgcj0iMSIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjMwIiByPSIxIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMjUiIHI9IjEiLz48Y2lyY2xlIGN4PSIxODAiIGN5PSI0MCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="container mx-auto px-4 md:px-16 lg:px-32 py-8 relative">
        <CustomerDashboardHeader
          onOpenBookingForm={() => openBookingFormModal(null)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {activeTab === 'home' && (
          <div className="space-y-8">
            <OvernightServicesSection setSelectedService={handleSelectServiceForDetails} />
            <GroomingServicesSection setSelectedService={handleSelectServiceForDetails} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Booking History</h2>
            <p className="text-gray-300">Your past and upcoming bookings will appear here.</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-white">About Pawspace</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                Pawspace is your premier destination for pet care services.
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Professional grooming services for dogs and cats
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Comfortable boarding facilities for your pets
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Experienced and caring staff
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Customized care for each pet's needs
                </li>
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
            <div className="text-center py-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-indigo-500/20">
              <h3 className="text-2xl font-semibold mb-4 text-white">Select a Service Type</h3>
              <p className="text-gray-300 mb-6">
                Please choose either Boarding or Grooming to proceed with your booking.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => openBookingFormModal('boarding')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg transition-all duration-200 border border-blue-500/20"
                >
                  Book Boarding
                </button>
                <button
                  onClick={() => openBookingFormModal('grooming')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-lg transition-all duration-200 border border-purple-500/20"
                >
                  Book Grooming
                </button>
              </div>
              <button
                onClick={closeBookingFormModal}
                className="mt-6 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg shadow-lg transition-all duration-200 border border-slate-500/20"
              >
                Close
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
