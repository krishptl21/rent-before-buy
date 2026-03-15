"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("Loading...");

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to load users");
        return;
      }

      setUsers(data.users);
      setMessage(data.users.length ? "" : "No users found.");
    } catch {
      setMessage("Something went wrong");
    }
  }

  async function toggleBlock(userId) {
    const res = await fetch("/api/admin/toggle-block", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    alert(data.message);
    fetchUsers();
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Admin Users</h1>
        {message && <p className="mt-4">{message}</p>}

        <div className="mt-6 grid gap-4">
          {users.map((user) => (
            <div key={user._id} className="rounded-lg border p-4">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Blocked:</strong> {user.isBlocked ? "Yes" : "No"}</p>

              <button
                onClick={() => toggleBlock(user._id)}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}