"use client";

import { useEffect, useState } from "react";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [message, setMessage] = useState("Loading...");

  async function fetchSellers() {
    try {
      const res = await fetch("/api/admin/sellers");
      const data = await res.json();

      console.log("ADMIN SELLERS API RESPONSE:", data);

      if (!res.ok) {
        setMessage(data.message || "Failed to load sellers");
        setSellers([]);
        return;
      }

      const safeSellers = Array.isArray(data.sellers) ? data.sellers : [];
      setSellers(safeSellers);
      setMessage(safeSellers.length ? "" : "No sellers found.");
    } catch (error) {
      console.error("FETCH SELLERS ERROR:", error);
      setSellers([]);
      setMessage("Something went wrong");
    }
  }

  async function approveSeller(sellerId) {
    try {
      const res = await fetch("/api/admin/approve-seller", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId }),
      });

      const data = await res.json();
      alert(data.message);
      fetchSellers();
    } catch (error) {
      alert("Approve failed");
    }
  }

  async function toggleBlock(userId) {
    try {
      const res = await fetch("/api/admin/toggle-block", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      alert(data.message);
      fetchSellers();
    } catch (error) {
      alert("Block/unblock failed");
    }
  }

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Admin Sellers</h1>

        {message && <p className="mt-4">{message}</p>}

        <div className="mt-6 grid gap-4">
          {sellers.map((seller) => (
            <div key={seller._id} className="rounded-lg border p-4">
              <p><strong>Name:</strong> {seller.name}</p>
              <p><strong>Email:</strong> {seller.email}</p>
              <p><strong>Approved:</strong> {seller.isApproved ? "Yes" : "No"}</p>
              <p><strong>Blocked:</strong> {seller.isBlocked ? "Yes" : "No"}</p>

              <div className="mt-3 flex gap-3">
                {!seller.isApproved && (
                  <button
                    onClick={() => approveSeller(seller._id)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                  >
                    Approve
                  </button>
                )}

                <button
                  onClick={() => toggleBlock(seller._id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  {seller.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}