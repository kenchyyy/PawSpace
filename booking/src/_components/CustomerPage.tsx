'use client';
import { ReactNode } from 'react';
import { FiHome, FiCalendar, FiInfo, FiUser, FiLogOut } from 'react-icons/fi';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: 'home' | 'history' | 'about') => void;
}

const CustomerPage = ({ children, activeTab, setActiveTab }: DashboardLayoutProps) => {
  return (
    <div className="flex">
      {/* sidebar */}
      <div className="w-64 min-h-screen bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Pawspace</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'home' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <FiHome className="mr-3" />
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'history' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <FiCalendar className="mr-3" />
                Booking History
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'about' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <FiInfo className="mr-3" />
                About Us
              </button>
            </li>
            <li className="pt-4 border-t border-gray-700">
              <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
                <FiLogOut className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default CustomerPage;