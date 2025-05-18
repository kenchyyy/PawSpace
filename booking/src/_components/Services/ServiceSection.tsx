import ServiceCard from "./ServiceCard";
import { ServiceSectionProps } from "./types/serviceTypes";

export default function ServiceSection({
    title,
    services,
    columns = 3,
}: ServiceSectionProps) {
    return (
        <section className="mb-10">
        <h2 className="text-2xl mb-4 font-sans text-white">{title}</h2>
        <div
            className="grid gap-4 text-white"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
            {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
            ))}
        </div>
        </section>
    );
}
