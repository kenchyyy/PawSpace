// app/page.tsx
'use client';

import { useState } from "react";
import ServiceDetailsModal from "../components/Services/ServiceDetailsModal";
import ServiceSection from "../components/Services/ServiceSelection";
import Link from "next/link";


export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  type ServiceDetails = {
    title: string;
    inclusions: string[];
    prices: { size?: string; price: number }[] | { allSizes: number };
  };

  const serviceDetailsMap: Record<string, ServiceDetails> = {
    Basic: {
      title: "Basic",
      inclusions: ["Bath & Blow Dry", "Ear Cleaning", "Nail Trim", "Cologne"],
      prices: [
        { size: "Teacup", price: 250 },
        { size: "Small", price: 300 },
        { size: "Medium", price: 400 },
        { size: "Large", price: 500 },
        { size: "X-Large", price: 600 },
      ],
    },
    Deluxe: {
      title: "Deluxe",
      inclusions: [
        "Hair Cut (additional charge for special cut)",
        "Bath & Blow Dry",
        "Ear Cleaning",
        "Nail Trim",
        "Teeth Brushing",
        "Cologne",
      ],
      prices: [
        { size: "Teacup", price: 250 },
        { size: "Small", price: 300 },
        { size: "Medium", price: 400 },
        { size: "Large", price: 500 },
        { size: "X-Large", price: 600 },
      ],
    },
    Cats: {
      title: "Cats",
      inclusions: [
        "Hair Cut (additional charge for special cut)",
        "Bath & Blow Dry",
        "Ear Cleaning",
        "Nail Trim",
        "Teeth Brushing",
        "Cologne",
      ],
      prices: { allSizes: 450 },
    },
  };

  const overnightServices = [
    { label: "Dogs", icon: "🐶", bgColor: "bg-orange-500" },
    { label: "Cats", icon: "🐱", bgColor: "bg-pink-500" },
  ];

  const groomingServices = [
    { label: "Basic", icon: "🐶", bgColor: "bg-orange-500" },
    { label: "Deluxe", icon: "🐶", bgColor: "bg-lime-500", glow: true },
    { label: "Cats", icon: "🐱", bgColor: "bg-pink-500" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-8 text-white">
      <Link href="/login" className="flex items-center justify-center h-0 text-2xl font-bold text-blue-500 hover:text-blue-700 transition-colors duration-300">
      Click me for Login
      </Link>
  
      
      <h1 className="text-3xl font-bold mb-6">Pet Services</h1>
      <ServiceSection title="Overnight Services" services={overnightServices} columns={2} />
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
    </main>
  );
}




