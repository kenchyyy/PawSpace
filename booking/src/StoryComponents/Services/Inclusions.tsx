import { InclusionProps } from './types/serviceTypes';

const Inclusion: React.FC<InclusionProps> = ({ inclusions }) => {
    return (
        <div className="mb-4 ">
            <h3 className="font-semibold mb-2">
                Inclusions:
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1">
                {inclusions.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}

export default Inclusion;