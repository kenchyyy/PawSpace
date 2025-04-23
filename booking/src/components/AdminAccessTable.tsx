"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

import { useEffect, useState} from "react";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/Button";
import AddAdmin from "./AddAdmin";

type AdminAccessUser = {
    name: string;
    email: string;
    role: string
}

export default function AdminAccessTable({ data }: { data: AdminAccessUser[] }) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState(data);

    function handleRemoveAdmin(email: string) {
        
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
                        <Button variant="outline" size="icon">
                            <Trash></Trash>
                        </Button>
                    </TableCell>
                    :
                    ""}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {showOverlay && <AddAdmin onClose={() => setShowOverlay(false)} />}
        </main>

  );
}