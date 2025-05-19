import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

export interface SideNavButtonProps {
  icon: IconType;
  text: string;
  onClick: () => void;
  isCurrent: boolean;
  color: "purple" | "gray" | "custom";
  href?: string;
  showText?: boolean;
  className?: string;
  overrideWindowSizeConstraint?: boolean;
  customColor?: string; // CSS color string like '#ff0000' or 'rgb(255,0,0)'
  textColor?: string; // CSS color string
}

// Helper to darken hex color by amount (0 to 1)
function darkenColor(color: string, amount: number): string {
  let col = color.startsWith("#") ? color.slice(1) : color;
  if (col.length === 3) {
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
  }
  const num = parseInt(col, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  r = Math.max(0, Math.min(255, Math.floor(r * (1 - amount))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - amount))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - amount))));

  return `rgb(${r},${g},${b})`;
}

const SideNavButton: React.FC<SideNavButtonProps> = ({
  icon: Icon,
  text,
  onClick,
  isCurrent,
  color,
  href = "",
  showText,
  className = "",
  overrideWindowSizeConstraint = false,
  customColor,
  textColor,
}) => {
  const baseStyle = `flex w-full items-center justify-between py-2 px-4 rounded-md cursor-pointer transition-colors duration-200`;

  // Hover styles for non-active buttons
  const hoverStyle = isCurrent
    ? ""
    : color === "gray"
      ? "hover:bg-slate-200"
      : color === "purple"
        ? "hover:bg-purple-700"
        : color === "custom"
          ? "hover:opacity-80"
          : "";

  // Determine background color: darken if active, else normal
  const backgroundColor = isCurrent
    ? customColor
      ? darkenColor(customColor, 0.2)
      : color === "purple"
        ? "#5b21b6" // darker purple (Tailwind bg-purple-700)
        : color === "gray"
          ? "#9ca3af" // darker gray (Tailwind bg-gray-400)
          : undefined
    : customColor;

  // Determine text color: orange if active purple/custom, black if gray, else textColor or default
  const activeTextColor = color === "gray" ? "#000" : "#f97316"; // orange-500
  const defaultTextColor = color === "gray" ? "#000" : textColor || "#fff";

  const textColorToUse = isCurrent ? activeTextColor : defaultTextColor;

  const inlineStyles: React.CSSProperties = {
    backgroundColor,
    color: textColorToUse,
  };

  return (
    <Link
      href={href}
      className={`${baseStyle} ${hoverStyle} ${className}`}
      onClick={onClick}
      style={inlineStyles}
    >
      <div className={`flex items-center gap-3 lg:justify-start lg:w-full`}>
        <Icon className='text-lg' style={{ color: textColorToUse }} />
        <span
          className={`${showText ? "" : "hidden"} ${
            overrideWindowSizeConstraint ? "" : "lg:inline"
          }`}
          style={{ color: textColorToUse }}
        >
          {text}
        </span>
      </div>
    </Link>
  );
};

export default SideNavButton;
