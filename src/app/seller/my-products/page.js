"use client";

import { useEffect, useState } from "react";

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("Loading...");

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products/my-products");
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to load products");
        setProducts([]);
        return;
      }

      setProducts(data.products || []);
      setMessage((data.products || []).length ? "" : "No products added yet.");
    } catch (error) {
      setProducts([]);
      setMessage("Something went wrong");
    }
  }

  async function deleteProduct(productId) {
    try {
      const res = await fetch("/api/products/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      alert(data.message);
      fetchProducts();
    } catch (error) {
      alert("Delete failed");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">My Products</h1>
        <p className="mt-2 text-gray-600">All products added by this seller</p>

        {message && <p className="mt-6 text-gray-700">{message}</p>}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <div key={product._id} className="rounded-xl border p-5">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
              <p className="mt-2">Category: {product.category}</p>
              <p>Rent: ₹{product.rentPrice}</p>
              <p>Buy: ₹{product.buyPrice}</p>
              <p>Stock: {product.stock}</p>
              <p>Condition: {product.condition}</p>

              <button
                onClick={() => deleteProduct(product._id)}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Delete Product
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}