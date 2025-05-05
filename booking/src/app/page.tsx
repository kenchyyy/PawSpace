'use client';

import { useState } from "react";
import ServiceDetailsModal from "../components/Services/ServiceDetailsModal";
import ServiceSection from "../components/Services/ServiceSelection";

export default function HomePage() {
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
    Dog: {
      title: "Dog",
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
      note: "Good for 24 hours",
    },
    Cat: {
      title: "Cat",
      type: "overnight",
      inclusions: [
        "Comfortable Bed",
        "24/7 Monitoring",
        "Quiet Room",
        "Free Food",
        "Free Basic Grooming (Bath & Brush)"
      ],
      prices: [
        { size: "Small", price: 450 },
        { size: "Large", price: 600 },
      ],
      note: "Good for 24 hours",
    },
  };

  const overnightServices = [
    { label: "Dog", icon: "🐶", bgColor: "bg-orange-500" },
    { label: "Cat", icon: "🐱", bgColor: "bg-pink-500" },
  ];

  const groomingServices = [
    { label: "Basic", icon: "🐶", bgColor: "bg-orange-500" },
    { label: "Deluxe", icon: "🐶", bgColor: "bg-lime-500", glow: true },
    { label: "Cats", icon: "🐱", bgColor: "bg-pink-500" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-8 text-white">
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
    </main>
  );
}