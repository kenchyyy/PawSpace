type OvernightServiceCardProps = {
  label: string;
  icon: string; 
  bgColor: string;
  onClick?: () => void;
  isOffline?: boolean; 
};

export default function OvernightServiceCard({
  label,
  icon,
  bgColor,
  onClick,
  isOffline = false, 
}: OvernightServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-6 text-center text-xl font-bold flex flex-col items-center justify-center ${bgColor} hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out h-64 w-64 relative`}
    >
      {isOffline ? (
        <div className="absolute inset-0 bg-gray-800 opacity-50 z-10 flex flex-col items-center justify-center">
          <div className="text-6xl mb-4 text-white">⚠️</div>
          <h3 className="text-lg text-white">Service is Not Available</h3>
          <p className="text-sm text-white">Please check your internet connection.</p>
        </div>
      ) : (
        <>
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-lg">{label.replace('Overnight', '')}</h3>
        </>
      )}
    </div>
  );
}

export type { OvernightServiceCardProps };
