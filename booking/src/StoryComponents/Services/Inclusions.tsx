import { InclusionProps } from './types/serviceTypes';

const Inclusion: React.FC<InclusionProps> = ({ inclusions }) => {
    return (
        <div className="mb-4">
            <ul className="list-disc list-inside text-sm space-y-1">
                {inclusions.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}

export default Inclusion;