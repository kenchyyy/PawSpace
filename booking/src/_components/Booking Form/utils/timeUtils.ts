export const validateTimeSlot = (
    date: Date | null, 
    time: string, 
    bookedSlots: string[]
): boolean => {
    if (!date || !time) return false;
    
    const hour = parseInt(time.split(':')[0]);
    if (hour < 9 || hour > 17) return false;
    if (time === '12:30') return false;
    
    return !bookedSlots.includes(time);
};

export const validateBookingCapacity = (
    currentBookings: number,
    maxCapacity: number
): boolean => {
    return currentBookings < maxCapacity;
};
