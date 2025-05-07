import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(
  date: Date | string | undefined,
  options?: {
    month?: 'short' | 'long' | 'numeric' | '2-digit'
    day?: 'numeric' | '2-digit'
    hour?: '2-digit' | 'numeric'
    minute?: '2-digit' | 'numeric'
    weekday?: 'short' | 'long' | 'narrow'
    includeTime?: boolean
  }
): string {
  if (!date) return '';

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    includeTime: true,
    ...options,
  };

  const d = new Date(date);
  
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: defaultOptions.month as 'short' | 'long' | 'numeric' | '2-digit',
    day: defaultOptions.day as 'numeric' | '2-digit',
    ...(defaultOptions.weekday && { weekday: defaultOptions.weekday as 'short' | 'long' | 'narrow' }),
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: defaultOptions.hour as 'numeric' | '2-digit' | undefined,
    minute: defaultOptions.minute as 'numeric' | '2-digit' | undefined,
    hour12: true,
  });

  const formattedDate = dateFormatter.format(d);
  const formattedTime = defaultOptions.includeTime ? `, ${timeFormatter.format(d)}` : '';

  return `${formattedDate}${formattedTime}`;
}