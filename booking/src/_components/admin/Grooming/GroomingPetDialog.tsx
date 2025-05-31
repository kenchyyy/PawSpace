"use client";

import { FaCheck, FaEnvelope, FaMinus } from "react-icons/fa";
import { RejectionDialog } from "./../RejectionDialog";
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
import { getGroomingPetDataByBookingUid, GroomingPetData } from "../../serverSide/FetchPetData";
import { Skeleton } from "../../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import ConfirmationMessage from "../../ConfirmationMessage";
import { AddCancelBookingMessage, getCancelledBookingMessageByBookingUuid, updateBookingStatus } from "../../serverSide/BookDataFetching";
import { truncate } from "./../helper";
import AlertMessage from "../../AlertMessage";
import GroomingPetDetails from "./GroomingPetDetails";

interface GroomingPetDialogProps {
  ownerName: string;
  ownerId: string | null;
  address: string;
  contactNumber: string;
  email: string;
  publishDateTime: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  bookingUUID: string;
  status: string;
  totalAmount: string;
  specialRequest: string;
  ondelete: (id: string) => void;
  children?: React.ReactNode;
  discountApplied: string;
  bookingType: "grooming" | "boarding";
}

const statusColors: Record<string, string> = {
  pending: "border-white text-white bg-indigo-900 hover:bg-indigo-950 shadow-indigo-950",
  confirmed: "border-yellow-600 text-white bg-indigo-900 hover:bg-indigo-950 shadow-indigo-950",
  ongoing: "border-orange-600 text-white bg-indigo-900 hover:bg-indigo-950 shadow-indigo-950", // or keep as-is
  completed: "border-green-600 text-white bg-indigo-900 hover:bg-indigo-950 shadow-indigo-950",
  cancelled: "border-red-600 text-white bg-indigo-900 hover:bg-indigo-950 shadow-indigo-950",
};


export default function GroomingPetDialog({
  bookingUUID, ownerName, ownerId, address, contactNumber, email, publishDateTime,
  checkInDate, checkInTime, checkOutDate, checkOutTime, status, specialRequest, ondelete, children, totalAmount,
  bookingType, discountApplied
}: GroomingPetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [petData, setPetData] = useState<GroomingPetData[]>([]);
  const [fetchMessage, setFetchMessage] = useState("");
  const hiddenButton = useRef<HTMLButtonElement>(null);
  const [cancellationMessage, setCancellationMessage] = useState<string>("");
  const [cancellationDate, setCancellationDate] = useState<string>("");

  // For cancellation reason dialog
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === "cancelled") {
      getCancellationMessage();
    }
  }, [status, bookingUUID]);

  useEffect(() => {
    setTimeout(() => {
      if (fetchMessage !== "") setFetchMessage("");
    }, 5000);
  }, [fetchMessage]);

  async function onOpenDialog(): Promise<void> {
    setLoading(true);
    const { message, returnData } = await getGroomingPetDataByBookingUid(bookingUUID) ;
    
    if (!returnData) {
      setLoading(false);
      return;
    }
    if (message === "No pet data found") {
      setFetchMessage(message);
      setLoading(false);
      return;
    }
    setPetData(returnData);
    setFetchMessage(message);
    setLoading(false);
  }

  async function onCheckButtonPressed() {
    if (status === "pending") {
      try {
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
      const { message } = await updateBookingStatus(bookingUUID, "ongoing");
      if (message) {
        ondelete(bookingUUID);
        setFetchMessage(message);
      }
    } else if (status === "ongoing") {
      const { message } = await updateBookingStatus(bookingUUID, "completed");
      if (message) {
        ondelete(bookingUUID);
        setFetchMessage(message);
      }
    }
    hiddenButton.current && hiddenButton.current.click();
  }

  async function handleXPressed() {
    if (status === "confirmed"){
        const { message } = await updateBookingStatus(bookingUUID, "pending");
        if (message) {
            ondelete(bookingUUID);
            setFetchMessage(message);
        }
        return
    }
    setShowCancelDialog(true);
  }

  async function handleConfirmedCancellation(reasonMsg: string) {
    
    setIsProcessing(true);

    let newStatus : "pending" | "cancelled" = "pending"
    try {
    
      if (status === "pending") {
        newStatus = "cancelled";
      } else if (status === "confirmed") {
        newStatus = "pending";
      }
      // Pass cancellationReason to your API
      const { message } = await updateBookingStatus(bookingUUID, newStatus);
      if (message) {
        ondelete(bookingUUID);
        setFetchMessage(message);
      }
      const message2 = await AddCancelBookingMessage("<ADMIN>      " + reasonMsg, bookingUUID)
      if (!message2) {
        console.error("insert cancellation message error")
      }
    } finally {
      setIsProcessing(false);
      setShowCancelDialog(false);
      hiddenButton.current?.click();
    }
  }

  function getOnConfirmMessage() {
    if (status === "pending") {
      return "Are you sure you want to confirm this booking? Confirming the request would reflect the booking's stay duration on the calendar.";
    } else if (status === "confirmed") {
      return "Confirm guest check-in? Press continue if the owner has checked their pet(s) in for grooming";
    } else if (status === "ongoing") {
      return "Confirm guest check-out? Press continue if the owner has already picked up their pet(s).";
    }
    return "";
  }

  function getOnDenyMessage() {
    if (status === "pending") {
      return "Are you sure you want to reject the booking request?";
    } else if (status === "confirmed") {
      return "Are you sure you want to unconfirm this booking? You can confirm it again later if needed.";
    }
    return "";
  }

  async function getCancellationMessage() {
    if (status === "cancelled") {
      const { message, date } = await getCancelledBookingMessageByBookingUuid(bookingUUID);
      if (!message || !date) {
        return
      };
      setCancellationMessage(message);
      setCancellationDate(date);
    }
    return;
  }

  return (
    <div className={`flex w-full ${children ? "h-20" : "h-65 lg:h-45"}`}>
      <Dialog onOpenChange={(open) => { if (open) onOpenDialog(); }}>
        <DialogTrigger className="w-full">
          {children ? (
            children
          ) : (
            <div
              className={`relative flex w-full justify-between h-full p-3 rounded-2xl shadow-2xl border-2 transition-colors ${statusColors[status]}`}
              onClick={onOpenDialog}
            >
              {/* Main content - always visible */}
              <section className="flex flex-col items-start text-white w-full lg:w-auto">
                <h1 className="text-lg font-bold text-orange-400">{truncate(ownerName, 30)}</h1>
                <p className="text-sm"><span className="text-yellow-300">Address:</span> {address}</p>
                <p className="text-sm"><span className="text-yellow-300">Contact Number: </span>{contactNumber}</p>
                <p className="text-sm"><span className="text-yellow-300">Email: </span>{email}</p>
                <p className="text-sm"><span className="text-yellow-300">Status:</span> {status}</p>
                <p className="text-sm"><span className="text-yellow-300">Total:</span> ₱{totalAmount || "None"}</p>
                <p className="text-sm"><span className="text-yellow-300">Discount Applied:</span> ₱{discountApplied}</p>
                
                {/* Check-in/out for mobile - hidden on lg and up */}
                <div className="flex gap-2 mt-2 lg:hidden w-full">
                  <div className="flex flex-col items-start w-1/2 border-2 bg-purple-600 border-purple-400 rounded-xl p-2 text-white">
                    <span className="text-xs">Check-in:</span>
                    <h1 className="text-md font-bold">{checkInDate}</h1>
                  </div>
                  <div className="flex flex-col items-start w-1/2 border-2 bg-purple-600 border-purple-400 rounded-xl p-2 text-white">
                    <span className="text-xs">Check-out:</span>
                    <h1 className="text-md font-bold">{checkOutDate}</h1>
                  </div>
                </div>
              </section>

              {/* Check-in/out for desktop - hidden on mobile */}
              <div className="hidden lg:flex items-start w-80 gap-2">
                <div className="flex flex-col items-start w-40 border-2 bg-purple-600 border-purple-400 rounded-xl p-2 text-white">
                  <span className="text-xs">Check-in:</span>
                  <h1 className="text-md font-bold">{checkInDate}</h1>
                </div>
                <div className="flex flex-col items-start w-40 border-2 bg-purple-600 border-purple-400 rounded-xl p-2 text-white">
                  <span className="text-xs">Check-out:</span>
                  <h1 className="text-md font-bold">{checkOutDate}</h1>
                </div>
              </div>

              <footer className="text-xs absolute right-5 bottom-2 text-purple-200">Published at: {publishDateTime}</footer>
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="overflow-auto bg-purple-800 border border-purple-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-orange-400">{truncate(ownerName, 40)}</DialogTitle>
            <DialogDescription className="flex flex-col text-sm text-purple-200">
              <span><span className="text-yellow-300">Address:</span>{address}</span>
              <span><span className="text-yellow-300">Contact Number: </span>{contactNumber}</span>
              <span><span className="text-yellow-300">Email: </span>{email}</span>
              <span><span className="text-yellow-300">Status:</span> {status}</span>
              <span className="text-sm"><span className="text-yellow-300">Total:</span> ₱{totalAmount ? totalAmount : "None"}</span>
              <span className="text-sm"><span className="text-yellow-300">Discount Applied:</span> ₱{discountApplied}</span>
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
                    <TableHead className="text-sm"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {petData.map((pet) => (
                    <TableRow key={pet.petUuid} className="hover:bg-purple-700 transition-colors">
                      <TableCell className="text-xs">{truncate(pet.name)}</TableCell>
                      <TableCell className="text-xs">{truncate(pet.petType)}</TableCell>
                      <TableCell className="text-xs">{truncate(pet.breed)}</TableCell>
                      <TableCell className="text-xs">{truncate(pet.age)}</TableCell>
                      <TableCell className="text-xs">
                        <GroomingPetDetails
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
                                  isCompleted={pet.isCompleted}
                                  status={status}
                                  bookingType={bookingType} 
                                  serviceVariant={pet.serviceVariant} 
                                  serviceDate={pet.serviceDate} 
                                  serviceTime={pet.serviceTime}
                                  >
                          <div className="bg-orange-500 rounded-2xl w-fit cursor-pointer h-full text-white px-4 hover:bg-orange-400 transition-colors">
                            Details
                          </div>
                        </GroomingPetDetails>
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
            {(status !== "ongoing" && status !== "completed" && status !== "cancelled") && (
              <ConfirmationMessage title="Confirm action" description={getOnDenyMessage()} onConfirm={handleXPressed}>
                <div className="p-1 rounded-md bg-red-500 hover:bg-red-400 active:bg-red-600 cursor-pointer text-white">
                  {status === "pending" && <span>Reject</span>}
                  {status === "confirmed" && <span>Unconfirm</span>}
                  {status === "completed" && <span>Delete</span>}
                </div>
              </ConfirmationMessage>
            )}
            {status !== "completed" && status !== "cancelled" && (
              <ConfirmationMessage
                title="Confirm action"
                description={getOnConfirmMessage()}
                onConfirm={onCheckButtonPressed}
              >
                <div className={`" p-1 rounded-md bg-green-600 hover:bg-green-500 active:bg-green-700 cursor-pointer text-white`}>
                  {status === "pending" && <span>Confirm</span>}
                  {status === "confirmed" && <span>Check-in</span>}
                  {status === "ongoing" && <span>Check-out</span>}
                </div>
              </ConfirmationMessage>
            )}
            <DialogClose ref={hiddenButton} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className={`flex flex-col pl-1 pt-2 gap-1 h-40 text-white w-10`}>
        {status !== "completed" && status !== "cancelled" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 flex items-center justify-center cursor-pointer">
                  <ConfirmationMessage title="Confirm action" description={getOnConfirmMessage()} onConfirm={onCheckButtonPressed}>
                    <FaCheck />
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
        {(status !== "ongoing" && status !== "completed" && status !== "cancelled") && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-400 active:bg-red-600 flex items-center justify-center cursor-pointer">
                  <ConfirmationMessage title="Confirm action" description={getOnDenyMessage()} onConfirm={handleXPressed}>
                    <FaMinus />
                  </ConfirmationMessage>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {status === "pending" && <span>Reject Booking Request</span>}
                {status === "confirmed" && <span>Unconfirm Booking</span>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {(status === "cancelled") && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-7 h-7 rounded-full bg-gray-500 hover:bg-gray-400 active:bg-gray-600 flex items-center justify-center cursor-pointer">
                  <ConfirmationMessage title="Confirm action" description={cancellationMessage} closeOnly={true} closeButtonText="Close" date={cancellationDate}>
                    <FaEnvelope />
                  </ConfirmationMessage>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {status === "cancelled" && <span>Read Cancellation Message</span>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {fetchMessage && <AlertMessage message={fetchMessage} borderColor="green"/>}

      {/* Cancellation Reason Dialog */}
        <RejectionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleConfirmedCancellation}
        onCancel={() => setShowCancelDialog(false)}
        isProcessing={isProcessing}
        description={getOnDenyMessage()}
        bookingType={bookingType}
        />

    </div>
  );
}
