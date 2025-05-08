import { ServiceCardProps } from "./types/serviceTypes";
  
const ServiceCard: React.FC<ServiceCardProps> = ({
    label,
    icon,
    bgColor,
    onClick,
}) => {
    
    return (
      <div
        onClick={onClick}
        className={`cursor-pointer rounded-lg p-6 text-center text-xl font-bold flex flex-col items-center justify-center ${bgColor} ${""
        } hover:scale-103 hover:shadow-2xl transition duration-300 ease-in-out`}
      >
        <div className="text-4xl mb-2">{icon}</div>
        {label}
      </div>
    );
};
  
export default ServiceCard;
  