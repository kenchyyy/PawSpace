'use client';
import Link from 'next/link';
import React from 'react';

export default function ViewServicesButton() {
  return (
    <Link href="/customer" passHref>
      <button
        className="mt-6 px-8 py-4 cursor-pointer bg-purple-700 text-white text-xl font-bold rounded-full shadow-lg hover:bg-purple-900 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        View Our Services
      </button>
    </Link>
  );
}