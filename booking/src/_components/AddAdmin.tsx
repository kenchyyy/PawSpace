"use client";

import { Button } from "@/_components/ui/Button";
import { addAdmin } from "@/_components/serverSide/AdminDataHandler";
import { useState } from "react";
import { Card, CardContent } from "@/_components/ui/card";

interface AddAdminProps {
    onClose: (name: string, email: string) => void;
}

export default function AddAdmin({ onClose }: AddAdminProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    async function handleAddAdmin(event: React.FormEvent) {
        event.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (name.trim() === "") {
            setStatusMessage("Please enter a name.");
            return;
        }
        if (email.trim() === "") {
            setStatusMessage("Please enter an email address.");
            return;
        }

        if (!emailRegex.test(email)) {
            setStatusMessage("Please enter a valid email address.");
            return;
        }

        const { success, message } = await addAdmin(name, email);

        if (success) {
            setStatusMessage("Admin added successfully!");
            onClose(name, email);
            setName("");
            setEmail("");
        } else {
            setStatusMessage(message || "Failed to add admin.");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-96 max-w-md bg-violet-900 border-violet-700">
                <CardContent className="flex flex-col gap-4 pt-4 text-white">
                    <span className="text-2xl font-bold text-white">Add Admin</span>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => handleAddAdmin(e)}
                    >
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-violet-700 bg-violet-800 p-2 rounded focus:bg-violet-700 text-white placeholder-violet-400"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="border border-violet-700 bg-violet-800 p-2 rounded focus:bg-violet-700 text-white placeholder-violet-400"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <p className="text-sm text-violet-200">
                            {statusMessage}
                        </p>
                        <div className="flex self-end gap-2">
                            <Button
                                type="submit"
                                className="bg-violet-600 hover:bg-violet-700 text-white"
                            >
                                Add Admin
                            </Button>
                            <Button
                                onClick={() => onClose("", "")}
                                className="bg-violet-800 hover:bg-violet-700 text-white border-violet-600"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
