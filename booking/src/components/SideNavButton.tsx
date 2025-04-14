import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

interface sideNavButtonProps {
  icon: IconType;
  text: string;
  onClick: () => void;
  isCurrent: boolean;
  color: 'purple' | 'gray';
  href?: string;
  showText?: boolean;
  className?: string;
}

const SideNavButton: React.FC<sideNavButtonProps> = ({ icon: Icon, text, onClick, isCurrent,color, href = "", showText, className = ""}) => {
  const colorClass = {
    'gray': 'bg-gray-400',
    'purple': 'bg-purple-900'
  };
  return (
    <Link href={href}
      className={`flex w-full items-center justify-between py-2 px-4 hover:${colorClass[color]} rounded-md cursor-pointer transition-colors duration-200 ${className}
      ${isCurrent ? colorClass[color] : ""}`}
      onClick={onClick}
    >
        <div className="flex items-center gap-3 lg:justify-start lg:w-full">
            <Icon className={`text-lg
              ${isCurrent? "text-orange-600":""}`} />
            <span className={`hidden lg:inline
              ${showText? "inline":""}
              ${isCurrent? "text-orange-600" : ""}`}>{text}</span>
        </div>
    </Link>
  );
};

export default SideNavButton;