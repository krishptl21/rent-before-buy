"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/all");
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to load products");
          setProducts([]);
          return;
        }

        setProducts(data.products || []);

        if ((data.products || []).length === 0) {
          setMessage("No products available right now.");
        } else {
          setMessage("");
        }
      } catch (error) {
        setMessage("Something went wrong");
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 text-gray-600">
          Browse available products from sellers
        </p>

        {message && <p className="mt-6 text-gray-700">{message}</p>}

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="rounded-xl bg-white p-6 shadow">
              
              {/* --- Image Logic Start --- */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
              {/* --- Image Logic End --- */}

              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="mt-2 text-gray-600">{product.category}</p>
              <p className="mt-2 font-medium text-gray-900">Rent: ₹{product.rentPrice}</p>
              <p className="font-medium text-gray-900">Buy: ₹{product.buyPrice}</p>
              <p className="text-sm">Stock: {product.stock}</p>
              <p className="mt-2 text-sm text-gray-500">
                Condition: {product.condition}
              </p>

              <Link
                href={`/products/${product._id}`}
                className="mt-4 block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/all");
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to load products");
          setProducts([]);
          return;
        }

        setProducts(data.products || []);

        if ((data.products || []).length === 0) {
          setMessage("No products available right now.");
        } else {
          setMessage("");
        }
      } catch (error) {
        setMessage("Something went wrong");
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 text-gray-600">
          Browse available products from sellers
        </p>

        {message && <p className="mt-6 text-gray-700">{message}</p>}

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="rounded-xl bg-white p-6 shadow">
              
              {/* --- Image Logic Start --- */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
              {/* --- Image Logic End --- */}

              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="mt-2 text-gray-600">{product.category}</p>
              <p className="mt-2 font-medium text-gray-900">Rent: ₹{product.rentPrice}</p>
              <p className="font-medium text-gray-900">Buy: ₹{product.buyPrice}</p>
              <p className="text-sm">Stock: {product.stock}</p>
              <p className="mt-2 text-sm text-gray-500">
                Condition: {product.condition}
              </p>

              <Link
                href={`/products/${product._id}`}
                className="mt-4 block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}