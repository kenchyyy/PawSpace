"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/_components/ui/table";

import { useEffect, useState} from "react";
import ConfirmationMessage from "./ConfirmationMessage";
import { Button } from "@/_components/ui/Button";
import AddAdmin from "./AddAdmin";
import AlertMessage from "./Alertmessage";

type AdminAccessUser = {
    name: string;
    email: string;
    role: string
}

interface AdminAccessTableProps {
    data: AdminAccessUser[];
}


export default function AdminAccessTable({ data }: AdminAccessTableProps) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState(data);

    function showMessage(msg: string) {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 5000);

    }

    async function handleRemoveAdmin() {

        showMessage("Admin removed successfully!");
    }

    return (
        <main>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="w-0">
                            <Button onClick={ () => setShowOverlay(true)} >
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {users.map((user) => (
                    <TableRow key={user.email}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    {user.role !== "owner"?
                    <TableCell className="w-0">
                        <ConfirmationMessage onConfirm={handleRemoveAdmin} title="Are You sure?" description="Removing an admin is irreversersible. However, you can add the same user when you decide to add them again"></ConfirmationMessage>
                    </TableCell>
                    :
                    ""}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {showOverlay && <AddAdmin onClose={() => setShowOverlay(false)} />}
            {message && <AlertMessage message={message} borderColor="green"/>}
        </main>

  );
}