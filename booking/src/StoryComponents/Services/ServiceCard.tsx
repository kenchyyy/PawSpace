type ServiceCardProps = {
  label: string;
  icon: string;
  bgColor: string;
  glow?: boolean;
  onClick?: () => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  label,
  icon,
  bgColor,
  glow,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-6 text-center text-xl font-bold flex flex-col items-center justify-center ${bgColor} ${
        glow ? "shadow-lg shadow-yellow-300" : ""
      } hover:scale-103 hover:shadow-2xl transition duration-300 ease-in-out`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      {label}
    </div>
  );
};

export default ServiceCard;
