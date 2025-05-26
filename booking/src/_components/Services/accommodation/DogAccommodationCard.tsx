import { DogAccommodationCardProps } from "../types/accommodationTypes";
import Inclusion from "../Inclusions";
import PriceTable from "../PriceTable";

const DogAccommodationCard: React.FC<DogAccommodationCardProps> = ({ details }) => {
    if (!details) return null;

    return (
        <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            {details.note && <p className="text-sm italic text-red-500 mb-3">{details.note}</p>}

            <h3 className="font-semibold mb-2 text-lg text-blue-600">Overnight</h3>
            
            <PriceTable prices={details.prices} type="overnight"/>

            <h3 className="font-semibold mb-2 mt-4">Inclusions:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
                <Inclusion inclusions={details.inclusions}/>
            </ul>
        </div>
    );
};

export default DogAccommodationCard;