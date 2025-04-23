import ServiceCard from "./ServiceCard";

type Service = {
  label: string;
  icon: string;
  bgColor: string;
  glow?: boolean;
};

type ServiceSectionProps = {
  title: string;
  services: Service[];
  columns?: number;
};

export default function ServiceSection({
  title,
  services,
  columns = 3,
}: ServiceSectionProps) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl mb-4">{title}</h2>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  );
}
