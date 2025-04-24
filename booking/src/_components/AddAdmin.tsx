"use client";

import { Button } from "@/_components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
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

        const { success, message } = await addAdmin(name, email);
    }
    return(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-96 max-w-md">

                <CardHeader className="flex items-end justify-end">
                    <Button variant="ghost" onClick={onClose} className="bg-red-600 hover:bg-red-700 active:bg-red-500">
                        X
                    </Button>
                </CardHeader>

                <CardTitle className="text-2xl self-center">Add admin</CardTitle>

                <CardContent className="flex flex-col gap-2">
                    <form className="flex flex-col gap-2" onSubmit={handleAddAdmin}>
                        <input type="text" placeholder="Name" className="border p-2 rounded focus:bg-gray-100" onChange={(e) => setName(e.target.value)}/>
                        <input type="email" placeholder="Email" className="border p-2 rounded focus:bg-gray-100" onChange={(e) => setEmail(e.target.value)}/>
                        <button type="submit" className="bg-gray-500 text-white p-2 rounded w-32 self-center">Add Admin</button>
                        <p className="text-sm text-gray-700">{statusMessage}</p>
                    
                    </form>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-2">
                    
                </CardFooter>

                {statusMessage && (
                    <p className="mt-2 text-sm text-gray-700">{statusMessage}</p>
                )}
            </Card>
        </div>
    );
}