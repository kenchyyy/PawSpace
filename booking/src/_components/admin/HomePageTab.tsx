import BookingDialogByDate from "./BookingDialogByDate";




interface HomePageTabProps {
    title?: string;
    bookingType: "boarding" | "grooming";
    bookingStatusFilter: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'ongoing' | 'confirmed&ongoing';
}

export default function HomePageTab({ title , bookingType, bookingStatusFilter}: HomePageTabProps) {
  return (
    <div className="w-full h-full flex flex-col gap-2 bg-violet-900 rounded-2xl border-2 border-violet-400 p-4">
        <span className="font-bold"> {title}</span>
        
            <div className="flex flex-col gap-4 w-full h-60 overflow-y-auto">
                <BookingDialogByDate Date={new Date()} bookingType={bookingType} bookingStatusFilter={bookingStatusFilter} />
            </div>
        
    </div>
  );
}
