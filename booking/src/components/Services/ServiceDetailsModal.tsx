import { AddBookingButton } from "../ui/button/Button";

type Detail = {
  size?: string;
  price: number;
};

type ServiceDetails = {
  title: string;
  type: "grooming" | "overnight";
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

  const typeColor = details.type === "grooming" ? "text-orange-500" : "text-blue-600";
  const typeEmoji = details.type === "grooming" ? "✂️" : "🛏️";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
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

        <ul className="mb-4 list-disc list-inside text-sm">
          {details.inclusions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-lg">Prices:</h3>
          {Array.isArray(details.prices) ? (
            <ul className="space-y-1 text-sm">
              {details.prices.map((p, i) => (
                <li key={i}>
                  <span className="font-semibold">{p.size}:</span> ₱{p.price}
                </li>
              ))}
            </ul>
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
