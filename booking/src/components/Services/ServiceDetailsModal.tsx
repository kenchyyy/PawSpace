import { AddBookingButton } from "../ui/button/Button";

type Detail = {
  size?: string;
  price: number;
  weightRange?: string;
};

type ServiceDetails = {
  title: string;
  type: "grooming" | "overnight";
  inclusions: string[];
  prices: Detail[] | { allSizes: number };
  note?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  details: ServiceDetails | null;
};

export default function ServiceDetailsModal({ isOpen, onClose, details }: Props) {
  if (!isOpen || !details) return null;

  const typeColor = details.type === "grooming" ? "text-orange-500" : "text-blue-600";
  const typeEmoji = details.type === "grooming" ? "✂️" : "🛏️";

  // Check if it's Dog Overnight or Cat Overnight
  const isDogOvernight = details.title === "Dog" && details.type === "overnight";
  const isCatOvernight = details.title === "Cat" && details.type === "overnight";

  // Define special offers based on the service type
  const specialOffers =
    isDogOvernight || isCatOvernight // Apply the same offers to both for now
      ? [
          "3 Nights: Free Food & Basic Grooming",
          "7 Nights: Free Food & Basic Grooming + 10% Discount",
          "15 Nights: Free Food & Basic Grooming + 20% Discount",
        ]
      : []; // Empty array if no special offers

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white text-black p-4 md:p-6 rounded-2xl w-[90%] max-w-sm md:max-w-md shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${typeColor}`}>
            {typeEmoji} {details.title} {details.type === "grooming" ? "Grooming" : "Accommodation"}
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 text-xl font-bold cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-red-100 p-2 rounded-full"
            aria-label="Close"
          >
            ✖
          </button>
        </div>

        {details.note && (
          <p className="text-sm italic text-red-500 mb-3">{details.note}</p>
        )}

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Inclusions:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {/* Include all inclusions, the special offer section is separate */}
            {details.inclusions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Display special offers if available */}
        {specialOffers.length > 0 && (
          <div className="mb-4 bg-gray-100 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">Special Offers:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {specialOffers.map((offer, index) => (
                <li key={index}>{offer}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-lg">Prices:</h3>
          {Array.isArray(details.prices) ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Size</th>
                    {details.type === "grooming" && <th className="text-left py-2">Weight</th>}
                    <th className="text-right py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {details.prices.map((p, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{p.size}</td>
                      {details.type === "grooming" && <td className="py-2">{p.weightRange}</td>}
                      <td className="text-right py-2">₱{p.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm font-semibold">All Sizes: ₱{details.prices.allSizes}</p>
          )}
        </div>

        <AddBookingButton
          onClick={onClose}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition cursor-pointer"
        >
          Book
        </AddBookingButton>
      </div>
    </div>
  );
}