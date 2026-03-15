import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function UserDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome, user.</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            href="/products"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Browse Products
          </Link>
          <Link
            href="/user/my-orders"
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}