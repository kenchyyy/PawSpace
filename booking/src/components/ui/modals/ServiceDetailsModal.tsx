type ServiceDetails = {
  title: string;
  inclusions: string[];
  prices: { size?: string; price: number }[] | { allSizes: number };
  serviceType?: 'grooming' | 'boarding' | 'training' | 'wellness';
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  details: ServiceDetails | null;
};

const getServiceModalStyle = (serviceType: string | undefined) => {
  switch (serviceType) {
    case 'boarding':
      return 'bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 transform transition-all duration-300 ease-in-out hover:scale-105 hover:bounce';
    case 'training':
      return 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 transform transition-all duration-300 ease-in-out hover:rotate-2 hover:scale-105';
    case 'wellness':
      return 'bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 transform transition-all duration-300 ease-in-out hover:scale-105 hover:animate-pulse';
    case 'grooming':
    default:
      return 'bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 hover:scale-100';  // Default design (grooming)
  }
};

export default function ServiceDetailsModal({ isOpen, onClose, details }: Props) {
  if (!isOpen || !details) return null;

  const modalStyle = getServiceModalStyle(details.serviceType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div
        className={`${modalStyle} text-white p-8 rounded-xl w-96 shadow-lg transform transition-transform duration-300 ease-in-out scale-100`}
      >
        <h2 className="text-2xl font-semibold mb-4">{details.title} Grooming</h2>

        <ul className="mb-4 list-disc list-inside">
          {details.inclusions.map((item, index) => (
            <li
              key={index}
              className="transition-all duration-300 hover:text-yellow-300"
            >
              {item}
            </li>
          ))}
        </ul>

        <div>
          <h3 className="font-semibold mb-2">Prices:</h3>
          {Array.isArray(details.prices) ? (
            <ul>
              {details.prices.map((p, i) => (
                <li
                  key={i}
                  className="transition-all duration-300 hover:text-yellow-300"
                >
                  {p.size}: ₱{p.price}
                </li>
              ))}
            </ul>
          ) : (
            <p className="transition-all duration-300 hover:text-yellow-300">
              All Sizes: ₱{details.prices.allSizes}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-full w-full hover:bg-orange-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export type { ServiceDetails }; // Correct way to export type when isolatedModules is enabled
