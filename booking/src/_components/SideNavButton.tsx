import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

export interface sideNavButtonProps {
  icon: IconType;
  text: string;
  onClick: () => void;
  isCurrent: boolean;
  color: 'purple' | 'gray';
  href?: string;
  showText?: boolean;
  className?: string;
  overrideWindowSizeConstraint?: boolean;
}

const SideNavButton: React.FC<sideNavButtonProps> = ({ icon: Icon, text, onClick, isCurrent,color, href = "", showText, className = "", overrideWindowSizeConstraint= false}) => {
  const colorClass = {
    'gray': 'bg-gray-400',
    'purple': 'bg-purple-900'
  };
  return (
    <Link href={href}
      className={`flex w-full items-center justify-between py-2 px-4 rounded-md cursor-pointer transition-colors duration-200 
        ${isCurrent? "" : (color === "gray"? "hover:bg-slate-200" :"hover:bg-purple-700")}
        ${className}
        ${isCurrent ? colorClass[color] : ""}`}
      onClick={onClick}
    >
        <div className="flex items-center gap-3 lg:justify-start lg:w-full">
            <Icon className={`text-lg
              ${isCurrent? (color === "purple"? "text-orange-600" : "text-white"):""}
              ${color === "gray"? "text-black":""}
              `} />
            <span className={`
              ${showText? "":"hidden"}
              ${overrideWindowSizeConstraint? "":"lg:inline"}
              ${isCurrent? (color === "purple"? "text-orange-600" : "text-white") : ""}
              ${color === "gray"? "text-black":""}
              `}>{text}</span>
        </div>
    </Link>
  );
};

export default SideNavButton;