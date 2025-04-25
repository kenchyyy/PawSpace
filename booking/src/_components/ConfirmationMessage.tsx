"use client";

import { AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/_components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { Button } from "@/_components/ui/Button";

interface ConfirmationMessageProps {
  onConfirm: () => void;
  title: string;
  description: string;
  
}

export default function ConfirmationMessage({ onConfirm, title, description }: ConfirmationMessageProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline"><Trash></Trash></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}