"use client"

import BookingDialogByDate from "@/_components/admin/BookingDialogByDate"
import RoomCard from "@/_components/admin/RoomCard"
import { DatePicker } from "@/_components/CalendarDialog"
import { getAllRooms, RoomData } from "@/_components/serverSide/FetchRoomData"
import { ScrollArea } from "@/_components/ui/scroll-area"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import RefreshContext from "@/_components/contexts/RefreshContext"

export default function RoomsPage() {
    const router = useRouter()

    const [rooms, setRooms] = useState<RoomData[]>([])
    const [renderBooks] = useState(true)

    const [selectedDate, setSelectedDate] = useState(new Date())
    
    const [refreshCount, setRefreshCount] = useState(0);

    const refreshRooms = () => {
        setRefreshCount(prev => prev + 1);
    };

    const loadRooms = async () => {
        try {
            const fetchedRooms = await getAllRooms();
            if (fetchedRooms && fetchedRooms.length > 0) {
                setRooms(fetchedRooms);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    function onDateChanged(date : Date) {
        setSelectedDate(date)
    }

    function onBookingStatusChange(){
        router.refresh()
    }

    // --- GROUP ROOMS BY roomType ---
    const groupedRooms = rooms.reduce((acc, room) => {
        if (!acc[room.roomType]) {
            acc[room.roomType] = [];
        }
        acc[room.roomType].push(room);
        return acc;
    }, {} as Record<string, RoomData[]>);

    return (
        <RefreshContext.Provider value={{ refreshRooms }}>
            <div className="flex flex-col w-full h-full">
                {/* Custom scrollbar styles */}
                <style jsx global>{`
                    ::-webkit-scrollbar {
                        width: 10px;
                        height: 10px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #4c1d95; /* violet-900 */
                        border-radius: 5px;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #5b21b6; /* slightly lighter for contrast */
                        border-radius: 5px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #7c3aed; /* a bit lighter on hover */
                    }
                    * {
                        scrollbar-width: thin;
                        scrollbar-color: #5b21b6 #4c1d95; /* thumb track */
                    }
                `}</style>


                <nav className="flex gap-x-4 fixed h-14 w-full items-center p-4 text-white z-10" style={{background: "#2e0249"}}>
                    <span className="text-2xl font-bold">Room Occupancy at</span>
                    <span> <DatePicker selectedDate={selectedDate} onDateChange={onDateChanged}></DatePicker></span>
                </nav>

                <div className="flex flex-row pt-14 h-full">
                    {/* Main content area - now with grouped RoomCards */}
                    <ScrollArea className="flex-1 w-full p-2">
                        <div className="bg-violet-950 p-1 m-1 rounded-2xl text-white wrap-break-word w-fit">
                            Note: Only pets under statuses "confirmed" and "ongoing" are reflected on a given date here.
                        </div>
                        <div className="p-4 min-w-fit">
                            {/* --- GROUPED RENDERING BY ROOMTYPE --- */}
                            {Object.keys(groupedRooms)
                            .sort((a, b) => a.localeCompare(b))  // Sort roomType keys alphabetically
                            .map(roomType => {
                                const roomsOfType = groupedRooms[roomType];
                                return (
                                <div key={roomType} className="mb-8">
                                    <h2 className="text-xl font-bold mb-2 capitalize">{roomType.replaceAll("_", " ")}: </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {roomsOfType.map(room => (
                                        <RoomCard
                                        room={room}
                                        key={`${room.id}-${selectedDate.toISOString()}-${refreshCount}`}
                                        date={selectedDate}
                                        />
                                    ))}
                                    </div>
                                </div>
                                );
                            })}


                        </div>
                    </ScrollArea>

                    {/* Fixed Sidebar */}
                    <div className="w-64 bg-violet-950 h-[calc(100vh-3.5rem)] sticky top-14 flex-shrink-0 gap-4 hidden lg:block ">
                        {renderBooks && 
                            <div className="flex flex-col px-4" >
                                <span className=" h-16 flex items-center text-lg font-bold">Confirmed and Ongoing bookings:</span>
                                <div className="h-[calc(100vh-7.5rem)] bg-violet-950 ">
                                    <BookingDialogByDate 
                                        key={selectedDate.toISOString()} 
                                        Date={selectedDate} 
                                        onRemoveBooking={onBookingStatusChange} 
                                        bookingType='boarding' 
                                        bookingStatusFilter="confirmed&ongoing"
                                        className="bg-purple-900"
                                        
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </RefreshContext.Provider>
    )
}
