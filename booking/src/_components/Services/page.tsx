'use client';

import { useState } from "react";
import ServiceDetailsModal from "./ServiceDetailsModal";
import OvernightServicesSection from "./accommodation/OvernightServiceSection";
import GroomingServicesSection from "./grooming/GroomingServiceSection";
import { serviceDetailsMap } from "./data/serviceData";

export default function HomePage() {
    const [selectedService, setSelectedService] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Pet Services</h1>

        <OvernightServicesSection setSelectedService={setSelectedService} />

        <GroomingServicesSection setSelectedService={setSelectedService} />

        <ServiceDetailsModal
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            details={selectedService ? serviceDetailsMap[selectedService] : null}
        />
        </main>
    );
}