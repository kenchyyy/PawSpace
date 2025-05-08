import { DayboardingInfoProps } from "../types/accommodationTypes";

const DayboardingInfo: React.FC<DayboardingInfoProps> = ({ title }) => {
    return (
        <div className="mt-0">
        <p className="text-sm italic text-red-500 mb-3">Hourly Rate</p>
        <h3 className="font-semibold mb-2 text-lg text-blue-800">Dayboarding</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
                <tr className="border-b">
                <th className="text-left py-2">Category</th>
                <th className="text-right py-2">Price</th>
                </tr>
            </thead>
            <tbody>
                {title === "Dog" ? (
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
                ) : title === "Cat" ? (
                <tr className="border-b">
                    <td className="py-2">All Cats</td>
                    <td className="text-right py-2">₱65</td>
                </tr>
                ) : null}
            </tbody>
            </table>
        </div>
        <p className="text-xs mt-2 italic text-gray-500">No minimum hours required</p>
        </div>
    );
};

export default DayboardingInfo;