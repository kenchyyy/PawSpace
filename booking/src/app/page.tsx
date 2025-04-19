// app/page.tsx
'use client';
import { useState } from 'react';
import BookingForm from '../_components/Booking Form/BookingForm';
import CustomerPage from '../app/customer/page';
import BookingHistory from '../_components/Booking History/BookingHistory';
import CustomerDashboardHeader from '../_components/Customer Dashoard/Header';
import Modal from '../_components/Modal';
import { Booking } from '../_components/Booking Form/types';
import { FiPlus } from 'react-icons/fi';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'about'>('home');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleNewBooking = (newBookings: Booking[]) => {
    setBookings([...bookings, ...newBookings]);
    setActiveTab('history');
    setShowBookingForm(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="container mx-auto px-4 py-8">
            <CustomerDashboardHeader onOpenBookingForm={() => setShowBookingForm(true)} />
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
          </div>
        );
      case 'history':
        return <BookingHistory bookings={bookings} />;
      case 'about':
        return <AboutPage />;
    }
  };

  return (
    <CustomerPage 
      activeTab={activeTab} 
      setActiveTab={(tab: 'home' | 'history' | 'about') => setActiveTab(tab)}
    >
      <main className="min-h-screen bg-gray-100">
        {renderContent()}
        
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
      </main>
    </CustomerPage>
  );
}

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">About Us</h1>
        <p className="mb-4">
          We are a premium pet care service dedicated to providing the best care for your furry friends.
        </p>
        <p>
          Our team of certified professionals ensures your pets receive the highest quality service in a safe and comfortable environment.
        </p>
      </div>
    </div>
  );
};