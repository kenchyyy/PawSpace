// app/page.tsx
'use client';

import Link from "next/link";

export default function Home() {
  return(
    <Link href="/login" className="flex items-center justify-center h-screen text-2xl font-bold text-blue-500 hover:text-blue-700 transition-colors duration-300">
    Click me for Login
    </Link>
  )
};