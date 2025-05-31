"use client";

import { useState } from "react";
import HomePageTab from "@/_components/admin/HomePageTab";
import { format } from "date-fns";

const ActiveTabMessages = {
  pending: "The following bookings are scheduled for check-in today and await your confirmation.",
  confirmed: "The following bookings are scheduled for arrival today.",
  ongoing: "The following bookings are scheduled for check-out today.",
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "ongoing">("pending");

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <div className="p-4 border-b border-violet-800">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-8 w-full h-full flex flex-col items-center">
        {/* Tab selector */}
        <div className="flex gap-2 mb-6">
          {(["pending", "confirmed", "ongoing"] as const).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-violet-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="mb-4 flex flex-col items-center text-center">
          <span className="text-lg font-medium">
            Bookings with status "{activeTab}" Today: {format(new Date(), 'MMMM dd, yyyy')}
          </span>
          <span className="text-sm text-gray-400">
            {ActiveTabMessages[activeTab] ? ActiveTabMessages[activeTab] : ""}
          </span>
        </div>
        
        {/* Only render active tab content */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 my-4 place-items-center">
          {activeTab === "pending" && (
            <>
              <HomePageTab title="Boarding" bookingType="boarding" bookingStatusFilter="pending"/>
              <HomePageTab title="Grooming" bookingType="grooming" bookingStatusFilter="pending"/>
            </>
          )}
          {activeTab === "confirmed" && (
            <>
              <HomePageTab title="Boarding" bookingType="boarding" bookingStatusFilter="confirmed"/>
              <HomePageTab title="Grooming" bookingType="grooming" bookingStatusFilter="confirmed"/>
            </>
          )}
          {activeTab === "ongoing" && (
            <>
              <HomePageTab title="Boarding" bookingType="boarding" bookingStatusFilter="ongoing"/>
              <HomePageTab title="Grooming" bookingType="grooming" bookingStatusFilter="ongoing"/>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}