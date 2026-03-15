import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl bg-white p-10 shadow">
          <h1 className="text-5xl font-bold text-gray-900">
            Rent Before You Buy
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Try products first. Rent what you need, and buy only if you love it.
            A simple platform for users, sellers, and admin.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              Browse Products
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-gray-300 px-5 py-3 hover:bg-gray-100"
            >
              Become a User
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-gray-300 px-5 py-3 hover:bg-gray-100"
            >
              Become a Seller
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">How it works</h2>
            <p className="mt-2 text-gray-600">
              Browse products, rent them for a few days, and decide whether you
              want to buy.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">For sellers</h2>
            <p className="mt-2 text-gray-600">
              Add products, manage listings, and receive rent or buy orders from users.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">For admin</h2>
            <p className="mt-2 text-gray-600">
              Approve sellers, manage users, monitor products, and keep the platform safe.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}