type ServiceCardProps = {
  label: string;
  icon: string;
  bgColor: string;
  glow?: boolean;
  onClick?: () => void; // NEW
};

const ServiceCard: React.FC<ServiceCardProps> = ({ label, icon, bgColor, glow, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-6 text-center text-xl font-bold flex flex-col items-center justify-center ${bgColor} shadow-2xl hover:shadow-purple-600 transition-all duration-300 ease-in-out active:scale-95 active:shadow-lg `}
    >
      <div className="text-4xl mb-2">{icon}</div>
      {label}
    </div>
  );
};

export default ServiceCard;
