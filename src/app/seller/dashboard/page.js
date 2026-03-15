import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function SellerDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome, seller.</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/seller/add-product"
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Add Product
          </Link>
          <Link
            href="/seller/my-products"
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            My Products
          </Link>
          <Link
            href="/seller/orders"
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Orders
          </Link>
        </div>
      </div>
    </main>
  );
}