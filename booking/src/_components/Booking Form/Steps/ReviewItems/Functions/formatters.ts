export const formatDate = (date: Date | string | null): string => {
  if (!date) return "None";
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid date";
  return dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const formatMealTime = (time: string): string => {
  if (!time) return "None";
  const [hours, minutes] = time.split(":");
  let period = "AM";
  let formattedHours = parseInt(hours, 10);
  if (formattedHours === 0) {
    formattedHours = 12;
  } else if (formattedHours === 12) {
    period = "PM";
  } else if (formattedHours > 12) {
    formattedHours -= 12;
    period = "PM";
  }
  return `${formattedHours}:${minutes} ${period}`;
};