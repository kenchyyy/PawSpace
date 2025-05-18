import { BasicGroomingCardProps } from "../types/groomingTypes";
import PriceTable from "../PriceTable";
import Inclusion from "../Inclusions";

const BasicGroomingCard: React.FC<BasicGroomingCardProps> = ({ details }) => {
    if (!details) return null;

    return (
        <div className="mb-4 bg-violet-50 p-3 rounded-lg border border-blue-100">
            {details.note && <p className="text-sm italic text-red-500 mb-3">{details.note}</p>}

            <h3 className="font-semibold mb-2 text-lg text-violet-600">Service Prices</h3>

            <PriceTable prices={details.prices} type="grooming"/>

            <h3 className="font-semibold mb-2 mt-4">Inclusions:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
                <Inclusion inclusions={details.inclusions}/>
            </ul>
        </div>
    );
};

export default BasicGroomingCard;