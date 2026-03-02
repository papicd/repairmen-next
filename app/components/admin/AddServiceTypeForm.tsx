"use client";

import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function AddServiceTypeForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    type: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.type) {
      setMessage(t("typeRequired") || "Type is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/service-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: form.type,
          description: form.description || undefined,
          price: form.price || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(t("serviceTypeCreated") || "Service type created successfully!");
        setForm({
          type: "",
          description: "",
          price: "",
        });
      } else {
        setMessage(data.message || "Failed to create service type");
      }
    } catch (err) {
      setMessage("Failed to create service type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl">
      <h2 className="text-2xl font-semibold mb-4">
        {t("addNewServiceType") || "Add New Service Type"}
      </h2>

      <div className="space-y-4">
        <input
          name="type"
          placeholder={t("serviceType") || "Service Type"}
          value={form.type}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          name="description"
          placeholder={t("description") || "Description (optional)"}
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          name="price"
          placeholder={t("price") || "Price (optional)"}
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? t("creating") || "Creating..." : t("createServiceType") || "Create Service Type"}
        </button>

        {message && (
          <p className={`text-center ${message.includes("success") || message.includes("uspješno") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
