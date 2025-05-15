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
  } from "@/_components/ui/dialog"
import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { useState } from "react";
import ConfirmationMessage from "../ConfirmationMessage";

interface AdminSideBookingDialogProps{
    ownerName : string;
    address : string;
    contactNumber : string;
    email: string;
    publishDateTime: string;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
    bookingUUID: string;
}



export default function AdminSideBookingDialog({bookingUUID, ownerName, address, contactNumber, email, publishDateTime, checkInDate, checkInTime,checkOutDate, checkOutTime} : AdminSideBookingDialogProps) {
    const [loading , setLoading] = useState(false);
    const [petdata, setPetData] = useState(null);

    async function onOpenDialog() : Promise<void>{
        setLoading(true)
        const supabase = createClientSideClient();
    }

    function onDeleteBooking() : void {
        setLoading(true)
    }

    return (
        <div className="flex w-full h-40">
            <Dialog>
                <DialogTrigger className="relative flex w-full justify-between h-full p-2 bg-slate-300 rounded-2xl shadow-2xl shadow-slate-700 border-white border-2">
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
                        <DialogDescription className=" flex flex-col">
                            <span className=" text-sm"> {address} </span>
                            <span className=" text-sm"> {contactNumber} </span>
                        </DialogDescription>
                    </DialogHeader>
                    
                    <p className="text-xl">Pets:</p>

                    <div className="gap-0 w-full flex flex-col">
                        <Dialog>
                            <DialogTrigger className="bg-slate-400 border-b-2 border-black hover:bg-slate-300 flex justify-between">
                                <span className="inline-block max-w-[10ch] truncate whitespace-nowrap overflow-hidden">Angelica</span>
                                <span>Large</span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Pet name 1
                                    </DialogTitle>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger className="bg-slate-400 flex justify-between">
                                <span className="inline-block max-w-[10ch] truncate whitespace-nowrap overflow-hidden">Angelica</span>
                                <span>Large</span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Pet name 1
                                    </DialogTitle>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger className="bg-slate-400 flex justify-between">
                                <span className="inline-block max-w-[10ch] truncate whitespace-nowrap overflow-hidden">Angelica</span>
                                <span>Large</span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Pet name 1
                                    </DialogTitle>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger className="bg-slate-400 flex justify-between">
                                <span className="inline-block max-w-[10ch] truncate whitespace-nowrap overflow-hidden">Angelica</span>
                                <span>Large</span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Pet name 1
                                    </DialogTitle>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger className="bg-slate-400 flex justify-between">
                                <span className="inline-block max-w-[10ch] truncate whitespace-nowrap overflow-hidden">Angelica</span>
                                <span>Large</span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Pet name 1
                                    </DialogTitle>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger className="bg-slate-400 flex justify-between">
                                <span className="inline-block max-w-[10ch] truncate whitespace-nowrap overflow-hidden">Angelica</span>
                                <span>Large</span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Pet name 1
                                    </DialogTitle>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <DialogFooter className="flex justify-between">
                        <DialogClose className="pr-1 pl-1 bg-red-500 hover:bg-red-400 active:bg-red-600">Reject</DialogClose>
                        <DialogClose className="pr-1 pl-1 bg-green-500 hover:bg-green-400 active:bg-green-600">Approve</DialogClose>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
            <div className="flex flex-col pl-1 gap-1 w-20 h-40 text-white">
                <div className=" w-7 h-7 rounded-full bg-green-500 hover:bg-green-400 active:bg-green-600 flex items-center justify-center"> <FaCheck/></div>
                <div className=" w-7 h-7 rounded-full bg-red-500 hover:bg-red-400 active:bg-red-600 flex items-center justify-center"> <FaMinus/></div>

                <div className=" w-7 h-7 rounded-full bg-green-500"></div>

            </div>

        </div>
    )
}