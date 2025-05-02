type Detail = {
    size?: string;
    price: number;
};

type ServiceDetails = {
    title: string;
    inclusions: string[];
    prices: Detail[] | { allSizes: number };
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    details: ServiceDetails | null;
};
  
  export default function ServiceDetailsModal({ isOpen, onClose, details }: Props) {
    if (!isOpen || !details) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        
        <div className="flex flex-col bg-white text-black p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">{details.title} Grooming</h2>
          <ul className="mb-4 list-disc list-inside">
            {details.inclusions.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
          <div>
            <h3 className="font-semibold mb-2">Prices:</h3>
            {Array.isArray(details.prices) ? (
              <ul>
                {details.prices.map((p, i) => (
                  <li key={i}>{p.size}: ₱{p.price}</li>
                ))}
              </ul>
            ) : (
              <p>All Sizes: ₱{details.prices.allSizes}</p>
            )}
          </div>
          <button onClick={onClose} className="mt-4 bg-orange-500 text-white px-4 py-2 rounded">Close</button>
          <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded">Scedule an Appointment</button>
          
        </div>
      </div>
    );
}
  