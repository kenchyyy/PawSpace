"use client"


import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/_components/ui/alert"

interface AlertMessageProps {
  message: string;
  borderColor: "red" | "green" | "yellow" | "orange" | "";
}

export default function AlertMessage({message, borderColor = ""}: AlertMessageProps) {
    const colorClass = {
        "red": "border-red-500",
        "green": "border-green-500",
        "yellow": "border-yellow-500",
        "orange": "border-orange-500",
        "": ""
    }[borderColor];

    return (
    <Alert className={`fixed bottom-4 left-4 z-[9999] border-2 ${colorClass} w-fit`}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
            {message}
        </AlertDescription>
    </Alert>
    )
}
