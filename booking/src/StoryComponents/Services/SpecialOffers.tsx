import { SpecialOffersProps } from './types/serviceTypes';

const SpecialOffers: React.FC<SpecialOffersProps> = ({ offers }) => {

    if (offers.length === 0) {
        return null;
    }

    return (
        <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h3 className="font-semibold mb-2 text-red-600">
                Special Offers:
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1">
                {offers.map((offer, index) => (
                    <li key={index}>{offer}</li>
                ))}
            </ul>
        </div>
    )
}

export default SpecialOffers;