import { BasicGroomingCardProps } from "../types/groomingTypes";

const BasicGroomingCard: React.FC<BasicGroomingCardProps> = ({ details }) => {
    if (!details) return null;

    return (
        <div>
        {details.note && <p className="text-sm italic text-red-500 mb-3">{details.note}</p>}
        <h3 className="font-semibold mb-2 text-lg text-blue-800">Service Prices</h3>
        {Array.isArray(details.prices) && (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b">
                    <th className="text-left py-2">Size</th>
                    <th className="text-left py-2">Weight</th>
                    <th className="text-right py-2">Price</th>
                </tr>
                </thead>
                <tbody>
                {details.prices.map((p, i) => (
                    <tr key={i} className="border-b">
                    <td className="py-2">{p.size}</td>
                    <td className="py-2">{p.weightRange}</td>
                    <td className="text-right py-2">₱{p.price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        <h3 className="font-semibold mb-2 mt-4">Inclusions:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
            {details.inclusions.map((item, index) => (
            <li key={index}>{item}</li>
            ))}
        </ul>
        </div>
    );
};

export default BasicGroomingCard;