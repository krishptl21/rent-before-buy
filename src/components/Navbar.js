"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Rent Before You Buy
        </Link>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/" className="rounded px-3 py-2 hover:bg-gray-100">
            Home
          </Link>
          <Link href="/products" className="rounded px-3 py-2 hover:bg-gray-100">
            Products
          </Link>
          <Link href="/login" className="rounded px-3 py-2 hover:bg-gray-100">
            Login
          </Link>
          <Link href="/register" className="rounded px-3 py-2 hover:bg-gray-100">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}