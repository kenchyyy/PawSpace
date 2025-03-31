/* "use client";
import { useEffect, useState } from "react";
import { addAdminUser, getAdminUsers } from "../../../actions/admin";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
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
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div>
        <input
          type="email"
          placeholder="Add admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <button onClick={addUser} className="bg-green-500 text-white p-2 ml-2">
          Add Admin
        </button>
      </div>
      <ul className="mt-4">
        {users.map((user, index) => (
          <li key={index} className="border p-2 mt-2">
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
 */