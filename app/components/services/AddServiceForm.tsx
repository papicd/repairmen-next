"use client";

import { useState } from "react";
import { useAuth } from '@/app/context/AuthContext';

export default function AddServiceForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  // 👇 Block if not provider
  if (!user || !user.isServiceProvider) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description) {
      alert("Name and description are required");
      return;
    }

    setLoading(true);

    try {
      await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: form.price ? Number(form.price) : undefined,
          date: form.date || undefined,
        }),
      });

      setForm({
        name: "",
        description: "",
        price: "",
        date: "",
      });

    } catch (err) {
      alert("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mb-10">
      <h2 className="text-2xl font-semibold mb-4">
        Add New Service
      </h2>

      <div className="space-y-4">
        <input
          name="name"
          placeholder="Service Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          name="description"
          placeholder="Service Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="number"
          name="price"
          placeholder="Price (optional)"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Service"}
        </button>
      </div>
    </div>
  );
}
