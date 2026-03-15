import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome, admin.</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/admin/users"
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Users
          </Link>
          <Link
            href="/admin/sellers"
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Sellers
          </Link>
          <Link
            href="/admin/products"
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Products
          </Link>
        </div>
      </div>
    </main>
  );
}