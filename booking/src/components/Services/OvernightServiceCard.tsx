type OvernightServiceCardProps = {
  label: string;
  icon: string;
  bgColor: string;
  onClick?: () => void;
};

export default function OvernightServiceCard({
  label,
  icon,
  bgColor,
  onClick,
}: OvernightServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-6 text-center text-xl font-bold flex flex-col items-center justify-center ${bgColor} hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3>{label}</h3>
    </div>
  );
}
