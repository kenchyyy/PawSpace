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

  const isDogOvernight = details.title === "Dog" && details.type === "overnight";
  const isCatOvernight = details.title === "Cat" && details.type === "overnight";

  const specialOffers = details.type === "overnight" ? [
    "3 Nights: Free Food & Basic Grooming",
    "7 Nights: Free Food & Basic Grooming + 10% Discount",
    "15 Nights: Free Food & Basic Grooming + 20% Discount",
  ] : [];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white text-black p-6 rounded-2xl w-[90%] max-w-md shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${typeColor}`}>
            {typeEmoji} {details.title} {details.type === "grooming" ? "Grooming" : "Accommodation"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
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
            {details.inclusions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {specialOffers.length > 0 && (
          <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h3 className="font-semibold mb-2 text-blue-700">Special Offers:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {specialOffers.map((offer, index) => (
                <li key={index} className="text-blue-800">{offer}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-lg">
            {details.type === "grooming" ? "Service Prices" : "Overnight Rates (24 hours)"}
          </h3>
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

        {(isDogOvernight || isCatOvernight) && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-semibold mb-2 text-lg text-amber-600">Dayboarding Rates</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Category</th>
                    <th className="text-right py-2">Price (per hour)</th>
                  </tr>
                </thead>
                <tbody>
                  {isDogOvernight ? (
                    <>
                      <tr className="border-b">
                        <td className="py-2">Small Dogs</td>
                        <td className="text-right py-2">₱65</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Medium Dogs</td>
                        <td className="text-right py-2">₱75</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Large Dogs</td>
                        <td className="text-right py-2">₱110</td>
                      </tr>
                    </>
                  ) : (
                    <tr className="border-b">
                      <td className="py-2">All Cats</td>
                      <td className="text-right py-2">₱65</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 italic text-gray-500">No minimum hours required</p>
          </div>
        )}

        <AddBookingButton
          onClick={onClose}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium mt-6"
        >
          Book Now
        </AddBookingButton>
      </div>
    </div>
  );
}