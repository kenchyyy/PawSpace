import ServiceSection from "../ServiceSection";
import { serviceDetailsMap } from "../data/serviceData";
import { GroomingServicesSectionProps } from "../types/serviceTypes";

const GroomingServicesSection: React.FC<GroomingServicesSectionProps> = ({ setSelectedService }) => {
    const groomingServicesData = Object.entries(serviceDetailsMap)
        .filter(([, details]) => details.type === "grooming")
        .map(([key, details]) => ({
        label: details.title,
        icon: details.title === "Basic" || details.title === "Deluxe" ? "🐶" : "🐱",
        bgColor:
            details.title === "Basic"
            ? "bg-orange-500"
            : details.title === "Deluxe"
            ? "bg-lime-500"
            : "bg-pink-500",
        glow: details.title === "Deluxe",
        onClick: () => setSelectedService(key),
        }));

    return (
        <ServiceSection
        title='Grooming Services'
        services={groomingServicesData}
        columns={3}
        />
    );
};

export default GroomingServicesSection;