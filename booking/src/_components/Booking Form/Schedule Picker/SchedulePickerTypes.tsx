export interface DateDropdownProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  unavailableDates: Date[];
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export interface TimeDropdownProps {
  selectedTime: string;
  onChange: (time: string) => void;
  unavailableTimes: string[];
  disabled?: boolean;
}