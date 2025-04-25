"use client";

import { Button } from "@/_components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/_components/ui/Card";
import { addAdmin } from "@/_components/serverSide/AdminDataHandler";
import { useState } from "react";

interface AddAdminProps {
    onClose: () => void;

}

export default function AddAdmin({onClose} : AddAdminProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    async function handleAddAdmin(event: React.FormEvent) {
        event.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setStatusMessage("Please enter a valid email address.");
            return;
        }

        const { success, message } = await addAdmin(name, email);

        if (success) {
            setStatusMessage("Admin added successfully!");
            setName("");
            setEmail("");
        } else {
            setStatusMessage(message || "Failed to add admin.");
        }
    }
    return(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center gap-0">
            <Card className="w-96 max-w-md">

                <CardContent className="flex flex-col gap-4 pt-4">
                    <span className="text-2xl font-bold">Add Admin</span>
                    <form className="flex flex-col gap-4" onSubmit={handleAddAdmin}>
                        <input type="text" placeholder="Name" className="border p-2 rounded focus:bg-gray-100" onChange={(e) => setName(e.target.value)}/>
                        <input type="email" placeholder="Email" className="border p-2 rounded focus:bg-gray-100" onChange={(e) => setEmail(e.target.value)}/>
                        <div className="flex self-end gap-2">
                            <Button type="submit">Add Admin</Button>
                            <Button onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                        <p className="text-sm text-gray-700">{statusMessage}</p>
                    
                    </form>
                </CardContent>

            </Card>
        </div>
    );
}