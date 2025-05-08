import { PriceTableProps } from "./types/serviceTypes";

const PriceTable: React.FC<PriceTableProps> = ({ prices, type }) => {
    return (
        <div className="mb-4">
        <h3 className="font-semibold mb-2 text-lg text-blue-800">
            {type === "grooming" ? "Service Prices" : "Overnight"}
        </h3>
        {Array.isArray(prices) ? (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b">
                    <th className="text-left py-2">Size</th>
                    {type === "grooming" && <th className="text-left py-2">Weight</th>}
                    <th className="text-right py-2">Price</th>
                </tr>
                </thead>
                <tbody>
                {prices.map((p, i) => (
                    <tr key={i} className="border-b">
                    <td className="py-2">{p.size}</td>
                    {type === "grooming" && <td className="py-2">{p.weightRange}</td>}
                    <td className="text-right py-2">₱{p.price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        ) : (
            <p className="text-sm font-semibold">All Sizes: ₱{prices.allSizes}</p>
        )}
        </div>
    );
};

export default PriceTable;