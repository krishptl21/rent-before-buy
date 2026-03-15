"use client";

import { useEffect, useState } from "react";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders/seller-orders");
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to load seller orders");
          return;
        }

        setOrders(data.orders);

        if (data.orders.length === 0) {
          setMessage("No orders for your products yet.");
        } else {
          setMessage("");
        }
      } catch (error) {
        setMessage("Something went wrong");
      }
    }

    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Seller Orders</h1>
        <p className="mt-2 text-gray-600">
          Orders placed on your products
        </p>

        {message && <p className="mt-6 text-gray-700">{message}</p>}

        <div className="mt-6 grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border p-5">
              <h2 className="text-xl font-semibold">
                {order.productId?.title || "Product"}
              </h2>
              <p className="mt-2">Buyer: {order.userId?.name || "Unknown"}</p>
              <p>Email: {order.userId?.email || "Unknown"}</p>
              <p>Type: {order.type}</p>
              <p>Status: {order.status}</p>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <p>Deposit Amount: ₹{order.depositAmount}</p>
              <p>Rental Days: {order.rentalDays}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}