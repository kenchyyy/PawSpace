import ServiceSection from "../ServiceSection";
import { serviceDetailsMap } from "../data/serviceData";
import { OvernightServicesSectionProps } from "../types/serviceTypes";

const OvernightServicesSection: React.FC<OvernightServicesSectionProps> = ({ setSelectedService }) => {
    const overnightServicesData = Object.entries(serviceDetailsMap)
        .filter(([, details]) => details.type === "overnight")
        .map(([key, details]) => ({
        label: details.title,
        icon: details.title === "Dog" ? "🐶" : "🐱",
        bgColor: details.title === "Dog" ? "bg-orange-500" : "bg-pink-500",
        onClick: () => setSelectedService(key),
        }));

    return (
        <ServiceSection
        title="Overnight Services"
        services={overnightServicesData}
        columns={2}
        />
    );
};

export default OvernightServicesSection;