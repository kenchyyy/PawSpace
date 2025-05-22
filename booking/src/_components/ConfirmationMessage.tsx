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
  onConfirm: () => void;
  title: string;
  description: string;
  children?: React.ReactNode;
  disabled?: boolean; // Add this
}

export default function ConfirmationMessage({ onConfirm, title, description, children, disabled }: ConfirmationMessageProps) {
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
          <AlertDialogDescription className="text-purple-200 mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-200 text-black hover:bg-gray-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
