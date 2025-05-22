"use client"

import { FaCheck, FaMinus } from "react-icons/fa";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/_components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/_components/ui/table";
import { useEffect, useRef, useState } from "react";
import { fetchBasicPetDataByBookingUUID, PetData } from "../serverSide/FetchPetData";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import ConfirmationMessage from "../ConfirmationMessage";
import { updateBookingStatus } from "../serverSide/BookDataFetching";
import { assignRoomToPet } from "../serverSide/FetchRoomData";
import PetDetails from "./PetDetails";

interface AdminSideBookingDialogProps{
    ownerName : string;
    ownerId: string | null;
    address : string;
    contactNumber : string;
    email: string;
    publishDateTime: string;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
    bookingUUID: string;
    status: string;
    specialRequest: string;
    ondelete: (id: string) => void;
    children?: React.ReactNode
}

const statusColors: Record<string, string> = {
  pending: "bg-violet-300 border-violet-400 text-violet-900 hover:bg-violet-400 shadow-violet-400",
  confirmed: "bg-purple-500 border-purple-600 text-white hover:bg-purple-600 shadow-purple-600",
  ongoing: "bg-violet-700 border-violet-800 text-white hover:bg-violet-800 shadow-violet-900",
  completed: "bg-purple-900 border-purple-950 text-white hover:bg-purple-950 shadow-purple-950",
  cancelled: "bg-gray-400 border-gray-500 text-gray-700 hover:bg-gray-500 shadow-gray-500",
};



export default function AdminSideBookingDialog({
    bookingUUID, ownerName, ownerId, address, contactNumber, email, publishDateTime,
    checkInDate, checkInTime, checkOutDate, checkOutTime, status, specialRequest, ondelete, children
} : AdminSideBookingDialogProps) {
    const [loading , setLoading] = useState(false);
    const [petData, setPetData] = useState<PetData[]>([]);
    const [fetchMessage, setFetchMessage] = useState("");
    const hiddenButton = useRef<HTMLButtonElement>(null);
    const [pendingRoomAssignments, setPendingRoomAssignments] = useState<Record<string, string>>({}); // {petUuid: roomId}
    
    

    useEffect(() => {
        setTimeout(() => {
            if (fetchMessage !== "") setFetchMessage("");
        }, 5000)
    },[fetchMessage])

    const canConfirmBooking = () => {
        if (status !== "pending") return true;
        return petData.every(pet => pet.room_name && pet.room_name.trim() !== "");
    };

    async function onOpenDialog() : Promise<void>{
        setLoading(true)
        const { message, returnData} = await fetchBasicPetDataByBookingUUID(bookingUUID)
        if (!returnData) {
            setLoading(false)
            return;
        }
        if (message === "No pet data found") {
            setFetchMessage(message);
            setLoading(false)
            return;
        }
        setPetData(returnData)
        setFetchMessage(message);
        setLoading(false)
    }

    async function onCheckButtonPressed() {
        if (status === "pending" && !canConfirmBooking()) {
            setFetchMessage("Cannot confirm booking - all pets must have assigned rooms");
            return;
        }
        if (status === "pending") {
            try {
            // Update each pet's room assignment in the backend
            for (const pet of petData) {
                const assignedRoomId = pendingRoomAssignments[pet.petUuid] || pet.room_id;
                if (assignedRoomId && assignedRoomId !== pet.room_id) {
                await assignRoomToPet(pet.petUuid, assignedRoomId);
                }
            }
            // --- Now update booking status ---
            const { message } = await updateBookingStatus(bookingUUID, "confirmed");
            if (message) {
                ondelete(bookingUUID);
                setFetchMessage(message);
            }
            } finally {
            setLoading(false);
            hiddenButton.current && hiddenButton.current.click();
            }
        } else if (status === "confirmed") {
            const {message} = await updateBookingStatus(bookingUUID, "ongoing");
            if (message) {
                ondelete(bookingUUID);
                setFetchMessage(message);
            }
        } else if (status === "ongoing") {
            const {message} = await updateBookingStatus(bookingUUID, "completed");
            if (message) {
                ondelete(bookingUUID);
                setFetchMessage(message);
            }
        }
        hiddenButton.current && hiddenButton.current.click();
    }

    async function onXPressed() {
        if (status === "pending"){
            const {message} = await updateBookingStatus(bookingUUID, "cancelled");
            if (message) {
                ondelete(bookingUUID);
                setFetchMessage(message);
            }
        } else if(status === "confirmed"){
            const {message} = await updateBookingStatus(bookingUUID, "pending");
            if (message) {
                ondelete(bookingUUID);
                setFetchMessage(message);
            }
        }
        hiddenButton.current && hiddenButton.current.click();
    }

    function getOnConfirmMessage() {
        if (status === "pending") {
            return "Are you sure you want to confirm this booking? Confirming the request would reflect the booking's stay duration on the calendar. "
        } else if (status === "confirmed") {
            return "Confirm guest check-in? Press continue if the owner has checked their pet(s) in for boarding"
        } else if (status === "ongoing") {
            return "Confirm guest check-out? Press continue if the owner has already picked up their pet(s)."
        } 
        return ""
    }

    function getOnDenyMessage() {
        if (status === "pending"){
            return "Are you sure you want to reject the booking request?"
        }else if (status === "confirmed"){
            return "Are you sure you want to unconfirm this booking? You can confirm it again later if needed."
        }else if (status === "completed") {
            return "Are you sure you want to delete the booking information? It cannot be restored once deleted."
        } 
        return ""
    }

    function onPetRoomAssignment(petUuid: string, roomId: string, roomName: string) {
    setPendingRoomAssignments(prev => ({ ...prev, [petUuid]: roomId }));
    // Optionally update petData to reflect the new roomName in UI:
    setPetData(prev =>
        prev.map(pet =>
        pet.petUuid === petUuid ? { ...pet, room_name: roomName, room_id: roomId } : pet
        )
    );
    }
    return (
        <div className="flex w-full h-40">
            <Dialog>
                <DialogTrigger className="w-full">
                    {children ? 

                    children

                    :

                    <div 
                    className={`relative flex w-full justify-between h-full p-3 rounded-2xl shadow-2xl border-2 transition-colors
                        ${statusColors[status] ?? "bg-gray-600 border-gray-500 text-white"}
                    `}
                    onClick={onOpenDialog}
                    >
                        <section className="flex flex-col items-start text-white">
                            <h1 className="text-lg font-bold text-orange-400">{ownerName}</h1>
                            <p className="text-sm">{address}</p>
                            <p className="text-sm">{contactNumber}</p>
                            <p className="text-sm">{email}</p>
                        </section>
                        <div className="flex items-start w-80 gap-2">
                            <div className="flex flex-col items-start w-40 border-2 bg-purple-600 border-purple-400 rounded-xl p-2 text-white">
                                <span className="text-xs">Check-in:</span>
                                <h1 className="text-md font-bold">{checkInDate}</h1>
                                <h2 className="text-sm">{checkInTime}</h2>
                            </div>
                            <div className="flex flex-col items-start w-40 border-2 bg-purple-600 border-purple-400 rounded-xl p-2 text-white">
                                <span className="text-xs">Check-out:</span>
                                <h1 className="text-md font-bold">{checkOutDate}</h1>
                                <h2 className="text-sm">{checkOutTime}</h2>
                            </div>
                        </div>
                        <footer className="text-xs absolute right-5 bottom-2 text-purple-200">Published at: {publishDateTime}</footer>
                    </div>
                    }


                </DialogTrigger>
                <DialogContent className="overflow-auto bg-purple-800 border border-purple-600 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-orange-400">{ownerName}</DialogTitle>
                        <DialogDescription className="flex flex-col text-sm text-purple-200">
                            <span>{address}</span>
                            <span>{contactNumber}</span>
                            <span>{email}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <p className="text-xl text-orange-400 mt-2">Pets:</p>
                    {loading ? (
                        <Skeleton className="h-10 w-full bg-purple-600" />
                    ) : (
                        <div className="max-h-40 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-sm text-orange-300">Name</TableHead>
                                        <TableHead className="text-sm text-orange-300">Species</TableHead>
                                        <TableHead className="text-sm text-orange-300">Breed</TableHead>
                                        <TableHead className="text-sm text-orange-300">Age</TableHead>
                                        <TableHead className="text-sm text-orange-300">Room</TableHead>
                                        <TableHead className="text-sm"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {petData.map((pet) => (
                                        <TableRow key={pet.petUuid} className="hover:bg-purple-700 transition-colors">
                                            <TableCell className="text-sm">{pet.name}</TableCell>
                                            <TableCell className="text-sm">{pet.petType}</TableCell>
                                            <TableCell className="text-sm">{pet.breed}</TableCell>
                                            <TableCell className="text-sm">{pet.age}</TableCell>
                                            <TableCell className="text-sm">
                                                {pet.room_name ? (
                                                    <span className="text-orange-400">{pet.room_name}</span>
                                                ) : (
                                                    <span className="text-purple-300 italic">undecided</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <PetDetails 
                                                    owner={ownerName} 
                                                    ownerId={ownerId} 
                                                    name={pet.name} 
                                                    ownerEmail={email} 
                                                    ownerContactNumber={contactNumber} 
                                                    petUuid={pet.petUuid} 
                                                    boardingIdExtention={pet.boardingIdExtention} 
                                                    groomingIdExtention={pet.groomingIdExtention} 
                                                    age={pet.age} 
                                                    petType={pet.petType} 
                                                    breed={pet.breed}
                                                    isVaccinated={pet.isVaccinated} 
                                                    allergies={pet.allergies} 
                                                    vitaminsOrMedications={pet.vitaminsOrMedications}
                                                    size={pet.size}
                                                    checkInDate={pet.checkInDate}
                                                    checkInTime={pet.checkInTime}
                                                    checkOutDate={pet.checkOutDate}
                                                    checkOutTime={pet.checkOutTime}
                                                    boardingType={pet.boardingType}
                                                    room_name={pet.room_name}
                                                    room_type={pet.room_type}
                                                    room_id={pet.room_id}
                                                    isCompleted={pet.isCompleted}
                                                    onRoomAssignment={onPetRoomAssignment}

                                                >
                                                    <div className="bg-orange-500 rounded-2xl w-fit cursor-pointer h-full text-white px-4 hover:bg-orange-400 transition-colors">
                                                        Details
                                                    </div>
                                                </PetDetails>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <span className="mt-4 text-orange-400">Special Request:</span>
                    <span className="text-xs max-h-20 overflow-y-auto break-words text-purple-200">
                        {specialRequest ? specialRequest : "No request provided"}
                    </span>
                    <DialogFooter className="flex justify-between mt-4">
                        {status !== "ongoing" && (
                            <ConfirmationMessage title="Confirm action" description={getOnDenyMessage()} onConfirm={onXPressed}>
                                <div className="p-1 rounded-md bg-red-500 hover:bg-red-400 active:bg-red-600 cursor-pointer text-white">
                                    {status === "pending" && <span>Reject</span>}
                                    {status === "confirmed" && <span>Unconfirm</span>}
                                    {status === "completed" && <span>Delete</span>}
                                </div>
                            </ConfirmationMessage>
                        )}
                        {status !== "completed" && (
                            <ConfirmationMessage 
                                title="Confirm action" 
                                description={getOnConfirmMessage()} 
                                onConfirm={onCheckButtonPressed}
                                disabled={status === "pending" && !canConfirmBooking()}
                                >
                                <div className={`p-1 rounded-md ${
                                    status === "pending" && !canConfirmBooking() 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-green-600 hover:bg-green-500 active:bg-green-700 cursor-pointer"
                                } text-white`}>
                                    {status === "pending" && <span>Confirm</span>}
                                    {status === "confirmed" && <span>Check-in</span>}
                                    {status === "ongoing" && <span>Check-out and Complete</span>}
                                </div>
                            </ConfirmationMessage>
                        )}
                        <DialogClose ref={hiddenButton}/> 
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col pl-1 pt-2 gap-1 w-20 h-40 text-white">
                {status !== "completed" && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 flex items-center justify-center cursor-pointer">
                                    <ConfirmationMessage title="Confirm action" description={getOnConfirmMessage()} onConfirm={onCheckButtonPressed}>
                                        <FaCheck/>
                                    </ConfirmationMessage>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {status === "pending" && <span>Confirm Booking Request</span>}
                                {status === "confirmed" && <span>Confirm Check-in</span>}
                                {status === "ongoing" && <span>Check-out and Complete Booking</span>}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
                {(status !== "ongoing" && status !== "completed") && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-400 active:bg-red-600 flex items-center justify-center cursor-pointer">
                                    <ConfirmationMessage title="Confirm action" description={getOnDenyMessage()} onConfirm={onXPressed}>
                                        <FaMinus/>
                                    </ConfirmationMessage>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {status === "pending" && <span>Reject Booking Request</span>}
                                {status === "confirmed" && <span>Unconfirm Booking</span>}
                                {status === "completed" && <span>Delete Booking Info</span>}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    );
}
