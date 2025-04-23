import { PetService } from "@/components/Services/services-list";
import { Button } from "@/components/ui/Button";

export function ServiceCard({ service }: { service: PetService }) {
  return (
    <article className="border rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
      
      <div className="p-5">
        <header className="mb-3">
          <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
          {service.roomSize && (
            <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
              {service.roomSize.toUpperCase()} SIZE
            </span>
          )}
        </header>

        <p className="text-gray-600 mb-4">{service.description}</p>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-blue-800">
              {service.currency} {service.price.toLocaleString('en-PH')}
            </p>
            <p className="text-sm text-gray-500">{service.duration}</p>
          </div>
          <Button 
            aria-label={`Book ${service.name}`}
          >
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;


// this is what you put in page.tsx to run the ServiceCard component

// import ServiceCard from "@/components/ServiceCard";
// import { petServices } from "@/data/pet-services"; 

// export default function ServicePage() {
//   return (
//     <main className="p-8">
//       <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {petServices.map((service, index) => (
//           <ServiceCard key={index} service={service} />
//         ))}
//       </div>
//     </main>
//   );
// }