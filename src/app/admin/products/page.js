"use client";

import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("Loading...");

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();

      console.log("ADMIN PRODUCTS API RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.message || "Failed to load products");
        setProducts([]);
        return;
      }

      const safeProducts = Array.isArray(data.products) ? data.products : [];
      setProducts(safeProducts);
      setMessage(safeProducts.length ? "" : "No products found.");
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
      setProducts([]);
      setMessage("Something went wrong");
    }
  }

  async function deleteProduct(productId) {
    try {
      const res = await fetch("/api/admin/delete-product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
        <h1 className="text-3xl font-bold">Admin Products</h1>

        {message && <p className="mt-4">{message}</p>}

        <div className="mt-6 grid gap-4">
          {products.map((product) => (
            <div key={product._id} className="rounded-lg border p-4">
              <p><strong>Title:</strong> {product.title}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Rent:</strong> ₹{product.rentPrice}</p>
              <p><strong>Buy:</strong> ₹{product.buyPrice}</p>
              <p><strong>Stock:</strong> {product.stock}</p>

              <button
                onClick={() => deleteProduct(product._id)}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white"
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