import BookingDialogByDate from "./BookingDialogByDate";




interface HomePageTabProps {
    title?: string;
    bookingType: "boarding" | "grooming";
    bookingStatusFilter: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing' | 'confirmed&ongoing';
}

export default function HomePageTab({ title , bookingType, bookingStatusFilter}: HomePageTabProps) {
  return (
    <div className="w-full h-full flex flex-col gap-4 bg-violet-900 rounded-2xl border-4 border-violet-400 p-4">
        <span className="font-bold"> {title}</span>
        
            <div className="flex flex-col gap-4 p-4 w-full h-60 overflow-y-auto">
                <BookingDialogByDate Date={new Date(2025, 4, 22)} bookingType={bookingType} bookingStatusFilter={bookingStatusFilter} />
            </div>
        
    </div>
  );
}
