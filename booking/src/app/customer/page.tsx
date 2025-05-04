//Customer Dashboard Page

'use client';
import { ReactNode } from 'react';
import { FiPlus} from 'react-icons/fi';
import CustomerDashboardHeader from '@/_components/Customer Dashoard/Header';
import { useState } from 'react';
import { Booking } from '@/_components/Booking Form/types';
import { useRouter } from 'next/navigation';
import Modal from '@/_components/Modal';
import BookingForm from '@/_components/Booking Form/BookingForm';
import ServiceDetailsModal from "@/components/Services/ServiceDetailsModal";
import ServiceSection from "@/components/Services/ServiceSelection";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: 'home' | 'history' | 'about') => void;
}

const CustomerPage = ({ children, activeTab, setActiveTab }: DashboardLayoutProps) => {
  const router = useRouter();

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedService, setSelectedService] = useState<string | null>(null);

  type ServiceDetails = {
    title: string;
    type: "grooming" | "overnight";
    inclusions: string[];
    prices: { size?: string; price: number; weightRange?: string }[] | { allSizes: number };
    note?: string;
  };

  const serviceDetailsMap: Record<string, ServiceDetails> = {
    Basic: {
      title: "Basic",
      type: "grooming",
      inclusions: ["Bath & Blow Dry", "Ear Cleaning", "Nail Trim", "Cologne"],
      prices: [
        { size: "Teacup", price: 250, weightRange: "1-3kg" },
        { size: "Small", price: 300, weightRange: "3.1-7kg" },
        { size: "Medium", price: 400, weightRange: "7.1-13kg" },
        { size: "Large", price: 500, weightRange: "13.1-19kg" },
        { size: "X-Large", price: 600, weightRange: "19kg & up" },
      ],
    },
    Deluxe: {
      title: "Deluxe",
      type: "grooming",
      inclusions: [
        "Hair Cut (additional charge for special cut)",
        "Bath & Blow Dry",
        "Ear Cleaning",
        "Nail Trim",
        "Teeth Brushing",
        "Cologne",
      ],
      prices: [
        { size: "Teacup", price: 350, weightRange: "1-3kg" },
        { size: "Small", price: 400, weightRange: "3.1-7kg" },
        { size: "Medium", price: 500, weightRange: "7.1-13kg" },
        { size: "Large", price: 600, weightRange: "13.1-19kg" },
        { size: "X-Large", price: 750, weightRange: "19kg & up" },
      ],
      note: "Additional charge for special cut",
    },
    Cats: {
      title: "Cats",
      type: "grooming",
      inclusions: [
        "Hair Cut (additional charge for special cut)",
        "Bath & Blow Dry",
        "Ear Cleaning",
        "Nail Trim",
        "Teeth Brushing",
        "Cologne",
      ],
      prices: { allSizes: 450 },
      note: "Additional charge for special cut",
    },
    DogsOvernight: {
      title: "Dogs Overnight",
      type: "overnight",
      inclusions: [
        "Comfortable Bed", 
        "24/7 Monitoring", 
        "Playtime",
        "Free Food",
        "Free Basic Grooming (Bath & Brush)"
      ],
      prices: [
        { size: "Small", price: 450 },
        { size: "Medium", price: 600 },
        { size: "Large", price: 800 },
      ],
    },
    CatsOvernight: {
      title: "Cats Overnight",
      type: "overnight",
      inclusions: [
        "Comfortable Bed", 
        "24/7 Monitoring", 
        "Quiet Room",
        "Free Food",
        "Free Basic Grooming (Bath & Brush)"
      ],
      prices: { allSizes: 450 },
    },
  };

  const overnightServices = [
    { label: "DogsOvernight", icon: "🐶", bgColor: "bg-orange-500" },
    { label: "CatsOvernight", icon: "🐱", bgColor: "bg-pink-500" },
  ];

  const groomingServices = [
    { label: "Basic", icon: "🐶", bgColor: "bg-orange-500" },
    { label: "Deluxe", icon: "🐶", bgColor: "bg-lime-500", glow: true },
    { label: "Cats", icon: "🐱", bgColor: "bg-pink-500" },
  ];


  function handleNewBooking(newBookings: Booking[]) {
    setBookings([...bookings, ...newBookings]);
    setShowBookingForm(false);

    const encoded = encodeURIComponent(JSON.stringify(newBookings));
    router.push(`/customer/history?bookings=${encoded}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CustomerDashboardHeader onOpenBookingForm={() => setShowBookingForm(true)} />
      {/* <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Welcome to Pawspace</h2>
        <p className="mb-6 text-gray-600">
          Book professional grooming or overnight stay services for your pets.
        </p>
        <button
          onClick={() => setShowBookingForm(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center transition-colors"
        >
          <FiPlus className="mr-2" />
          Create New Booking
        </button>
      </div> */}
      <div className='text-white'>

        <h1 className="text-3xl font-bold mb-6">Pet Services</h1>

        <ServiceSection
          title="Overnight Services"
          services={overnightServices.map((s) => ({
            ...s,
            onClick: () => setSelectedService(s.label),
          }))}
          columns={2}
        />

        <ServiceSection
          title="Grooming Services"
          services={groomingServices.map((s) => ({
            ...s,
            onClick: () => setSelectedService(s.label),
          }))}
          columns={3}
        />

        <ServiceDetailsModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          details={selectedService ? serviceDetailsMap[selectedService] : null}
        />

      </div>
      
      <Modal 
          isOpen={showBookingForm} 
          onClose={() => setShowBookingForm(false)}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl">
            <BookingForm 
              onConfirmBooking={handleNewBooking}
              onClose={() => setShowBookingForm(false)}
            />
          </div>
        </Modal>
    </div>

  );
};

export default CustomerPage;