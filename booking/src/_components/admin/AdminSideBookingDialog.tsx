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
import AlertMessage from "../AlertMessage";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import ConfirmationMessage from "../ConfirmationMessage";
import { updateBookingStatus } from "../serverSide/BookDataFetching";
import PetDetails from "./PetDetails";
import { Span } from "next/dist/trace";

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
}


export default function AdminSideBookingDialog({bookingUUID, ownerName, ownerId, address, contactNumber, email, publishDateTime, checkInDate, checkInTime,checkOutDate, checkOutTime, status, specialRequest, ondelete} : AdminSideBookingDialogProps) {
    const [loading , setLoading] = useState(false);
    const [petData, setPetData] = useState<PetData[]>([]);
    const [fetchMessage, setFetchMessage] = useState("");
    const hiddenButton = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        setTimeout(() => {
            if (fetchMessage !== "") {
                setFetchMessage("");
            }
        }, 5000)
    },[fetchMessage])


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

    function onDeleteBooking()  {
        
    }

    async function onCheckButtonPressed() {
        if (status === "pending") {
            const {message} = await updateBookingStatus(bookingUUID, "confirmed");
            if (message) {
                ondelete(bookingUUID);
                setFetchMessage(message);
            }
        }else if (status === "confirmed") {
            const {message} = await updateBookingStatus(bookingUUID, "onGoing");
            if (message) {
                ondelete(bookingUUID);
                setFetchMessage(message)
            }
        }else if (status === "onGoing") {
            const {message} = await updateBookingStatus(bookingUUID, "completed");
            if (message) {
                ondelete(bookingUUID);
                setFetchMessage(message)
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
        }else if(status === "confirmed"){
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
        } else if (status === "onGoing") {
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

    return (
        <div className="flex w-full h-40">
            <Dialog>
                <DialogTrigger className="relative flex w-full justify-between h-full p-2 bg-slate-300 rounded-2xl shadow-2xl shadow-slate-700 border-white border-2" onClick={onOpenDialog}>
                    <section className="flex flex-col items-start">
                        <h1 className=" text-lg font-bold"> {ownerName} </h1>
                        <p className=" text-sm"> {address} </p>
                        <p className=" text-sm"> {contactNumber} </p>
                        <p className=" text-sm"> {email} </p>
                    </section>
                    <div className=" flex items-start w-80">
                        <div className="flex flex-col items-start w-40 border-2 bg-slate-400 border-black">
                            <span className="text-xs">Check-in:</span>
                            <h1 className="text-md font-bold"> {checkInDate} </h1>
                            <h2 className="text-sm"> {checkInTime} </h2>
                        </div>
                        <div className="flex flex-col items-start w-40 border-2 bg-slate-400 border-black">
                        <span className="text-xs">Check-out:</span>
                            <h1 className="text-md font-bold"> {checkOutDate} </h1>
                            <h2 className="text-sm"> {checkOutTime} </h2>
                        </div>
                    </div>
                    <footer className=" text-xs absolute right-5 bottom-2 text-slate-500">Published at: {publishDateTime}</footer>
                </DialogTrigger>
                <DialogContent className="overflow-auto">
                    <DialogHeader>
                        <DialogTitle>{ownerName}</DialogTitle>
                        <DialogDescription className=" flex flex-col text-sm">
                            <span> {address} </span>
                            <span> {contactNumber} </span>
                            <span> {email}</span>
                        </DialogDescription>
                    </DialogHeader>
                    
                    <p className="text-xl">Pets:</p>
                    {loading ? <Skeleton className="h-10 w-full" />:
                        <div className="max-h-40 overflow-y-auto">
                            <Table >
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-sm">Name</TableHead>
                                        <TableHead className="text-sm">Species</TableHead>
                                        <TableHead className="text-sm">Breed</TableHead>
                                        <TableHead className="text-sm">Age</TableHead>
                                        <TableHead className="text-sm"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {petData.map((pet) => (
                                        <TableRow key={pet.petUuid}>
                                            <TableCell className="text-sm">{pet.name}</TableCell>
                                            <TableCell className="text-sm">{pet.petType}</TableCell>
                                            <TableCell className="text-sm">{pet.breed}</TableCell>
                                            <TableCell className="text-sm">{pet.age}</TableCell>
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
                                                isCompleted={pet.isCompleted}>
                                                    <div className="bg-slate-500 rounded-2xl w-fit cursor-pointer h-full text-white px-4">
                                                        ...
                                                    </div>
                                                </PetDetails>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        
                    }
                    <span>Special Request:</span>
                    <span className="text-xs max-h-20 overflow-y-auto break-words">{specialRequest ? specialRequest : "No request provided"} </span>

                    
                    <DialogFooter className="flex justify-between">
                            {(status !== "onGoing") && 
                                <ConfirmationMessage title="Confirm action" description={getOnDenyMessage()} onConfirm={onXPressed}>
                                    <div className="p-1 rounded-md bg-red-500 hover:bg-red-400 active:bg-red-600 cursor-pointer">
                                        {status === "pending" && <span>Reject</span>}
                                        {status === "confirmed" && <span>Unconfirm</span>}
                                        {status === "completed" && <span>Delete</span>}
                                    </div>
                                </ConfirmationMessage>
                            }
                            {(status !== "completed") && 
                                <ConfirmationMessage title="Confirm action" description={getOnConfirmMessage()} onConfirm={onCheckButtonPressed}>
                                    <div className="p-1 rounded-md bg-green-500 hover:bg-green-400 active:bg-green-600 cursor-pointer">
                                        {status === "pending" && <span>Confirm</span>}
                                        {status === "confirmed" && <span>Check-in</span>}
                                        {status === "onGoing" && <span> Check-out and Complete</span>}
                                        {status === "completed" && <span>Delete</span>}
                                    </div>    
                                </ConfirmationMessage>
                            }

                            <DialogClose ref={hiddenButton}/> 
                    </DialogFooter>

                </DialogContent>
            </Dialog>
            <div className="flex flex-col pl-1 pt-2 gap-1 w-20 h-40 text-white">
                {(status !== "completed") && 
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className=" w-7 h-7 rounded-full bg-green-500 hover:bg-green-400 active:bg-green-600 flex items-center justify-center"> 
                                    <ConfirmationMessage title="Confirm action" description={getOnConfirmMessage()} onConfirm={onCheckButtonPressed}>
                                        <FaCheck/>
                                    </ConfirmationMessage>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {status === "pending" && <span>Confirm Booking Request</span>}
                                {status === "confirmed" && <span>Confirm Check-in</span>}
                                {status === "onGoing" && <span>Check-out and Complete Booking</span>}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                }
                
                {((status !== "onGoing") && (status !== "completed")) && 
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className=" w-7 h-7 rounded-full bg-red-500 hover:bg-red-400 active:bg-red-600 flex items-center justify-center"> 
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
                }
            </div>
            {fetchMessage && <AlertMessage message={fetchMessage} borderColor="green" /> }

        </div>
    )
}