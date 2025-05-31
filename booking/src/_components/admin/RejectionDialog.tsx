"use client";

import { Button } from "@/_components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { useState } from "react";

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isProcessing: boolean;
  description?: string;
  bookingType?: "boarding" | "grooming";
}

const commonBoardingRejectionReasons = [
  "Owner did not provide required information",
  "No available rooms for requested dates",
  "Pet does not meet boarding requirements",
  "Other (please specify)",
];

const commonGroomingRejectionReasons = [
  "Owner did not provide required information",
  "No available groomers for requested dates",
  "Pet does not meet grooming requirements",
  "Other (please specify)",
]; 

export function RejectionDialog({
  bookingType = "boarding", 
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isProcessing,
  description,
}: RejectionDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== "Other (please specify)") {
      setCustomReason("");
    }
  };

  const handleConfirm = () => {
    const finalReason = selectedReason === "Other (please specify)" 
      ? customReason 
      : selectedReason;
    if (!finalReason.trim()) return;
    onConfirm(finalReason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-violet-900 text-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-orange-400">Rejection Message</DialogTitle>
          <DialogDescription className="mt-1 text-violet-300">
            Please select or provide a reason for rejecting:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {bookingType === 'boarding' ? commonBoardingRejectionReasons.map((reason) => (
            <div key={reason} className="flex items-center">
              <input
                type="radio"
                id={`reason-${reason}`}
                name="cancellationReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => handleReasonChange(reason)}
                className="mr-3 accent-orange-500"
              />
              <label htmlFor={`reason-${reason}`} className="cursor-pointer">
                {reason}
              </label>
            </div>
          ))
        
        
          : commonGroomingRejectionReasons.map((reason) => (
            <div key={reason} className="flex items-center">
              <input
                type="radio"
                id={`reason-${reason}`}
                name="cancellationReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => handleReasonChange(reason)}
                className="mr-3 accent-orange-500"
              />
              <label htmlFor={`reason-${reason}`} className="cursor-pointer">
                {reason}
              </label>
            </div>
            ))
            }
          {selectedReason === "Other (please specify)" && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please specify your reason..."
              className="w-full p-3 mt-2 bg-violet-800 border border-violet-700 rounded text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          )}
        </div>
        <DialogFooter className="mt-6 space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="border-violet-500 text-violet-500 hover:bg-violet-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedReason.trim() && !(selectedReason === "Other (please specify)" && customReason.trim()) || isProcessing}
            className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
