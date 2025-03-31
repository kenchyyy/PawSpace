"use client";

//basic functionality. no design and error handling

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../../actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await login(email, password);
    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push("/admin");
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mt-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 mt-2">
        Login
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
