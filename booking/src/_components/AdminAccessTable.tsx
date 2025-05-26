"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/_components/ui/table";
import { removeAdmin } from "@/_components/serverSide/AdminDataHandler";
import { useEffect, useState } from "react";
import ConfirmationMessage from "./ConfirmationMessage";
import { Button } from "@/_components/ui/Button";
import AddAdmin from "./AddAdmin";
import AlertMessage from "@/_components/AlertMessage";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

type AdminAccessUser = {
    name: string;
    email: string;
    role: string;
};

interface AdminAccessTableProps {
    data: AdminAccessUser[];
}

export default function AdminAccessTable({ data }: AdminAccessTableProps) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();

    function showMessage(msg: string) {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 6000);
    }

    async function handleRemoveAdmin(email: string) {
        const { success, message } = await removeAdmin(email);
        if (!success) {
            showMessage(message);
        } else {
            showMessage(message);
            router.refresh();
        }
    }

    function closeAddAdmin(emailAddress: string) {
        if (emailAddress === "") {
            setShowOverlay(false);
            return;
        }
        setShowOverlay(false);
        showMessage("Admin added successfully!");
        router.refresh();
    }

    return (
        <main className=" rounded-lg shadow-xl p-6 h-full" style={{ backgroundColor: "#3b0764", color: "white" }}>
            <Table className="bg-violet-900 rounded-lg overflow-hidden">
                <TableHeader>
                    <TableRow className="bg-violet-950 hover:bg-violet-900">
                        <TableHead className="text-white font-medium">Name</TableHead>
                        <TableHead className="text-white font-medium">Email</TableHead>
                        <TableHead className="text-white font-medium">Role</TableHead>
                        <TableHead className="w-0 text-white font-medium">
                            <Button
                                onClick={() => setShowOverlay(true)}
                                className="bg-violet-800 hover:bg-violet-700 text-white"
                            >
                                +
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((user) => (
                        <TableRow
                            key={user.email}
                            className="hover:bg-violet-900 text-white border-violet-800"
                        >
                            <TableCell className="text-white">{user.name}</TableCell>
                            <TableCell className="text-white">{user.email}</TableCell>
                            <TableCell className="text-white">{user.role}</TableCell>
                            {user.role !== "owner" ? (
                                <TableCell className="w-0">
                                    <ConfirmationMessage
                                        onConfirm={() => handleRemoveAdmin(user.email)}
                                        title="Remove the admin?"
                                        description="You can add back them again later!"
                                    >
                                        <Button
                                            variant="outline"
                                            className="bg-violet-800 hover:bg-violet-700 text-white border-violet-600"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </ConfirmationMessage>
                                </TableCell>
                            ) : (
                                ""
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {showOverlay && <AddAdmin onClose={closeAddAdmin} />}
            {message && (
                <AlertMessage
                    message={message}
                    borderColor="green"
                    />
            )}
        </main>
    );
}
