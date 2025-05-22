"use client"

import RoomCard from "@/_components/admin/RoomCard"
import { getAllRooms, RoomData } from "@/_components/serverSide/FetchRoomData"
import { ScrollArea } from "@/_components/ui/scroll-area"
import { useEffect, useState } from "react"

export default function RoomsPage() {
    const [roomLoading, setRoomLoading] = useState(false)
    const [rooms, setRooms] = useState<RoomData[]>([])

    useEffect(() =>{
        setRoomLoading(true)
        const loadRooms = async () => {
            const rooms = await getAllRooms()

            if (!rooms){ 
                //inser error messaging here
                return
            }

            setRooms(rooms)
        }
        loadRooms()
        
    },[])

    return (
        <div className="flex flex-col w-full h-full bg-violet-600">
            {/* Custom scrollbar styles */}
            <style jsx global>{`
                ::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                ::-webkit-scrollbar-track {
                    background: #5b21b6;
                    border-radius: 5px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #7e22ce;
                    border-radius: 5px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #9333ea;
                }
                * {
                    scrollbar-width: thin;
                    scrollbar-color: #7e22ce #5b21b6;
                }
            `}</style>

            <nav className="flex gap-x-4 fixed h-14 w-full bg-violet-700 items-center p-4 text-white z-10">
                <span className="text-2xl font-bold">Boarding Occupancy at</span>
                <span> {"<Insert Date Here>"}</span>
            </nav>

            <div className="flex flex-row pt-14 h-full">
                {/* Main content area - now with responsive grid */}
                <ScrollArea className="flex-1 w-full">
                    <span className="bg-fuchsia-900 p-1 rounded-2xl text-white">Legend</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 min-w-fit">
                        {rooms &&
                        rooms.map((item, index) => (
                            <RoomCard room={item} key={index}/>
                        ))
                        }
                    </div>
                </ScrollArea>

                {/* Fixed Sidebar */}
                <div className="w-64 bg-violet-800 h-[calc(100vh-3.5rem)] sticky top-14 flex-shrink-0">
                    <ScrollArea className="h-full">
                        <div className="flex flex-col gap-4 p-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="w-full bg-red-300 h-20 rounded-lg" />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}