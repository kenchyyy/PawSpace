import { PetService } from "@/types/services-list";

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
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            aria-label={`Book ${service.name}`}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;