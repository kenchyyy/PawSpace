"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any[]>([]);

/*   useEffect(() => {
    async function fetchUsers() {
      const res = await getAdminUsers();
      if (res.users) setUsers(res.users);
    }
    fetchUsers();
  }, []);

  const addUser = async () => {
    if (!email) return;
    await addAdminUser(email);
    setUsers([...users, { email }]);
    setEmail("");
  }; */

  return (
    <div className="p-8">
    </div>
  );
}
