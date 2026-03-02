"use client"

import { useState } from "react";

interface Props {
  onClose?: () => void;
}

export default function AddServiceRequestForm({ onClose }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceRange: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          priceRange: formData.priceRange,
          date: formData.date || undefined,
        }),
      });

      setFormData({
        name: "",
        description: "",
        priceRange: "",
        date: "",
      });

      if (onClose) onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Name */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Service Name *
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter service name"
          className="w-full px-4 py-3 rounded-xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Description *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the service request..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition resize-none"
        />
      </div>

      {/* Price Range */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Price Range
        </label>
        <input
          type="text"
          name="priceRange"
          value={formData.priceRange}
          onChange={handleChange}
          placeholder="e.g. $100 - $300"
          className="w-full px-4 py-3 rounded-xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition"
        />
      </div>

      {/* Date */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Preferred Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-gray-300
                     text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white
                     font-medium hover:bg-blue-700 transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Create Service"}
        </button>
      </div>
    </form>
  );
}
