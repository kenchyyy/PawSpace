import { RoomData } from "../serverSide/FetchRoomData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PetDetailsProps } from "./PetDetails";




interface RoomCardProps{
    room: RoomData;
    pets: PetDetailsProps[];
    classname?: string;
}


export default function RoomCard({ room, pets }: RoomCardProps)  {
    return(
        <Card className="w-full h-full bg-violet-800 hover:bg-violet-700">
            <CardHeader>
                <CardTitle className="font-bold text-orange-400"> {room.roomName} </CardTitle>
                <CardDescription className="text-xs text-white"> Inhabitantants: </CardDescription>
            </CardHeader>
            <CardContent>
                <div className=" flex flex-col">
                    
                </div>
            </CardContent>
        </Card>
    )
}