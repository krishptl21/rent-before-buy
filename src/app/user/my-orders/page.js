"use client";

import { useEffect, useState } from "react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("Loading...");
  const [complaints, setComplaints] = useState({});

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders/my-orders");
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to load orders");
        return;
      }

      setOrders(data.orders);

      if (data.orders.length === 0) {
        setMessage("No orders placed yet.");
      } else {
        setMessage("");
      }
    } catch {
      setMessage("Something went wrong");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function submitComplaint(orderId) {
    const complaintText = complaints[orderId];

    if (!complaintText) {
      alert("Please write your complaint first.");
      return;
    }

    try {
      const res = await fetch("/api/complaints/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          message: complaintText,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        setComplaints((prev) => ({
          ...prev,
          [orderId]: "",
        }));
      }
    } catch {
      alert("Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-2 text-gray-600">Your rented and purchased products</p>

        {message && <p className="mt-6 text-gray-700">{message}</p>}

        <div className="mt-6 grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border p-5">
              <h2 className="text-xl font-semibold">
                {order.productId?.title || "Product"}
              </h2>
              <p className="mt-2">Type: {order.type}</p>
              <p>Status: {order.status}</p>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <p>Deposit Amount: ₹{order.depositAmount}</p>
              <p>Rental Days: {order.rentalDays}</p>
              <p>Seller: {order.sellerId?.name || "Unknown"}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Payment Status: {order.paymentStatus}</p>
              <p>Transaction ID: {order.transactionId || "N/A"}</p>

              <div className="mt-4">
                <textarea
                  placeholder="Write complaint for this order"
                  value={complaints[order._id] || ""}
                  onChange={(e) =>
                    setComplaints((prev) => ({
                      ...prev,
                      [order._id]: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border p-3"
                  rows="3"
                />
                <button
                  onClick={() => submitComplaint(order._id)}
                  className="mt-3 rounded-lg bg-orange-600 px-4 py-2 text-white"
                >
                  Submit Complaint
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}