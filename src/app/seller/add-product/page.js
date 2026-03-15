"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    rentPrice: "",
    buyPrice: "",
    deposit: "",
    stock: "",
    condition: "new",
    availableForRent: true,
    availableForBuy: true,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to add product");
        setLoading(false);
        return;
      }

      setMessage("Product added successfully");

      setTimeout(() => {
        router.push("/seller/my-products");
      }, 1000);
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="mt-2 text-gray-600">
          Add a new product for rent or buy
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            rows="4"
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="number"
            name="rentPrice"
            placeholder="Rent Price"
            value={formData.rentPrice}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="number"
            name="buyPrice"
            placeholder="Buy Price"
            value={formData.buyPrice}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="number"
            name="deposit"
            placeholder="Deposit"
            value={formData.deposit}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="used">Used</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availableForRent"
              checked={formData.availableForRent}
              onChange={handleChange}
            />
            Available for Rent
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availableForBuy"
              checked={formData.availableForBuy}
              onChange={handleChange}
            />
            Available for Buy
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 p-3 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </main>
  );
}