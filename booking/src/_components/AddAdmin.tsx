"use client";

import { Button } from "@/_components/ui/Button";
import { addAdmin } from "@/_components/serverSide/AdminDataHandler";
import { useState } from "react";
import { Card, CardContent } from "@/_components/ui/card";

interface AddAdminProps {
  onClose: (email: string) => void;
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
      onClose(email);
      setName("");
      setEmail("");
    } else {
      setStatusMessage(message || "Failed to add admin.");
    }
  }
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center gap-0'>
      <Card className='w-96 max-w-md'>
        <CardContent className='flex flex-col gap-4 pt-4'>
          <span className='text-2xl font-bold'>Add Admin</span>
          <form
            className='flex flex-col gap-4'
            onSubmit={(e) => {
              handleAddAdmin(e);
            }}
          >
            <input
              type='text'
              placeholder='Name'
              className='border p-2 rounded focus:bg-gray-100'
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type='email'
              placeholder='Email'
              className='border p-2 rounded focus:bg-gray-100'
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className='text-sm text-red-700'>{statusMessage}</p>
            <div className='flex self-end gap-2'>
              <Button type='submit'>Add Admin</Button>
              <Button onClick={() => onClose("")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
