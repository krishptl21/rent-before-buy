"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState("Loading...");
  const [loading, setLoading] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setMessage("Invalid product id");
        return;
      }

      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to load product");
          return;
        }

        setProduct(data.product);
        setSeller(data.seller);
        setMessage("");
      } catch (error) {
        setMessage("Something went wrong");
      }
    }

    fetchProduct();
  }, [id]);

  async function placeOrder(type) {
    if (!product) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          type,
          rentalDays: type === "rent" ? rentalDays : 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to place order");
        setLoading(false);
        return;
      }

      setMessage("Order placed successfully");
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (message && !product) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
          <p>{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">{product?.title}</h1>

        <p className="mt-3 text-gray-700">{product?.description}</p>

        <div className="mt-6 space-y-2">
          <p>Category: {product?.category}</p>
          <p>Rent Price: ₹{product?.rentPrice}</p>
          <p>Buy Price: ₹{product?.buyPrice}</p>
          <p>Deposit: ₹{product?.deposit}</p>
          <p>Stock: {product?.stock}</p>
          <p>Condition: {product?.condition}</p>
          <p>
            Seller: {seller?.name} {seller?.email ? `(${seller.email})` : ""}
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block">Rental Days</label>
          <input
            type="number"
            min="1"
            value={rentalDays}
            onChange={(e) => setRentalDays(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => placeOrder("rent")}
            disabled={loading}
            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Rent Now"}
          </button>

          <button
            onClick={() => placeOrder("buy")}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        </div>

        {message && <p className="mt-6 text-gray-700">{message}</p>}
      </div>
    </main>
  );
}