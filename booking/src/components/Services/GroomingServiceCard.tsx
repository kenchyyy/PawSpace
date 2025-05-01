type Inclusion = {
  name: string;
  icon: string;
};

type GroomingServiceCardProps = {
  label: string;
  bgColor: string;
  inclusions: Inclusion[];
  prices: { [size: string]: number };
};

export default function GroomingServiceCard({
  label,
  bgColor,
  inclusions,
  prices,
}: GroomingServiceCardProps) {
  const sizeLabels = Object.keys(prices);

  return (
    <div className="bg-white text-black p-6 rounded-xl shadow-md w-full max-w-sm hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out">
      <h3 className="text-center text-2xl font-bold mb-4">{label}</h3>

      <div className={`w-full h-28 rounded-lg mb-4 ${bgColor}`} />

      <div className="grid grid-cols-5 text-center text-sm font-semibold mb-2">
        {sizeLabels.map((size) => (
          <div key={size}>{size}</div>
        ))}
      </div>
      <div className="grid grid-cols-5 text-center text-lg font-bold mb-4">
        {sizeLabels.map((size) => (
          <div key={size}>{prices[size]}</div>
        ))}
      </div>

      <ul className="mb-4 space-y-1">
        {inclusions.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      <button className="bg-orange-500 text-white py-2 px-4 rounded-full w-full hover:bg-orange-600 transition">
        Add Booking
      </button>
    </div>
  );
}
