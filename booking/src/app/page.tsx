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
import ServiceDetailsModal from "../_components/Services/ServiceDetailsModal";
import OvernightServicesSection from "../_components/Services/accommodation/OvernightServiceSection";
import GroomingServicesSection from "../_components/Services/grooming/GroomingServiceSection";
import { serviceDetailsMap } from "../_components/Services/data/serviceData";

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

    const openBookingForm = () => {
        setShowBookingForm(true);
        setSelectedService(null);
    };


    function handleNewBooking(newBookings: Booking[]) {
        setBookings([...bookings, ...newBookings]);
        setShowBookingForm(false);

        const encoded = encodeURIComponent(JSON.stringify(newBookings));
        router.push(`/customer/history?bookings=${encoded}`);
    }

    return (

        <div className="container bg-gradient-to-br from-blue-950 to-purple-900 mx-auto px-4 py-8">
            <CustomerDashboardHeader onOpenBookingForm={() => setShowBookingForm(true)} />
            
            <OvernightServicesSection setSelectedService={setSelectedService} />

            <GroomingServicesSection setSelectedService={setSelectedService} />

            <ServiceDetailsModal
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                details={selectedService ? serviceDetailsMap[selectedService] : null}
                onOpenBookingForm={openBookingForm}
            />

            <div className="bg-white p-6 rounded-lg shadow">
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
