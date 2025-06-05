import { ReactNode } from "react";
import { PawPrint } from "lucide-react";

type AddBookingButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

export function AddBookingButton({
  children = "Add Booking",
  className = "",
  variant = "default",
  size = "md",
  disabled = false,
  onClick,
}: AddBookingButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 shadow-md group overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles: Record<string, string> = {
    default:
      "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-purple-600 cursor-pointer hover:to-pink-500 focus:ring-pink-400",
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const rippleEffect =
    variant === "default"
      ? "before:absolute before:inset-0 before:bg-white/10 before:scale-0 before:rounded-full before:opacity-0 group-hover:before:scale-150 group-hover:before:opacity-100 before:transition-all before:duration-500"
      : "";

  const disabledStyles = disabled
    ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-100 shadow-none ring-0"
    : "";

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${
        disabled ? disabledStyles : variantStyles[variant]
      } ${sizeStyles[size]} ${!disabled ? rippleEffect : ""} ${className}`}
    >
      {<PawPrint className='w-5 h-5' />}
      {children}
    </button>
  );
}
