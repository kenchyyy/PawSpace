"use client";

import { useRouter } from "next/navigation";

export default function ViewServicesButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/services");
  };

  return (
    <button
      onClick={handleClick}
      className="mx-auto block px-6 py-3 rounded-md font-semibold text-white text-lg bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-800 hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 cursor-pointer"
    >
      View Our Services
    </button>
  );
}
