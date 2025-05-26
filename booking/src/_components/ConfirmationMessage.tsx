"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/_components/ui/alert-dialog";

interface ConfirmationMessageProps {
  onConfirm?: () => void;
  title: string;
  description: string;
  children?: React.ReactNode;
  disabled?: boolean; // Add this
  closeButtonText?: string;
  closeOnly?: boolean;
  date?: string;
}

export default function ConfirmationMessage({ onConfirm, title, description, children, disabled, closeOnly, closeButtonText, date }: ConfirmationMessageProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-purple-800 border-2 border-purple-600 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-orange-400 text-xl font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-purple-200 mt-2 flex flex-col">
          
            <span className="pb-2 border-b-2 border-violet-600 text-gray-400">{date}</span>
            <span className="p-4 max-h-64">{description}</span>
            
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {closeOnly ? 

            <AlertDialogCancel className="bg-gray-200 text-black hover:bg-gray-300">
              {closeButtonText ? closeButtonText : "Cancel"}
            </AlertDialogCancel>

          : 

          <div className=" flex gap-4">
            <AlertDialogCancel className="bg-gray-200 text-black hover:bg-gray-300">
              {closeButtonText ? closeButtonText : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white"
            >
              Continue
            </AlertDialogAction>
          </div>
          }
          
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
