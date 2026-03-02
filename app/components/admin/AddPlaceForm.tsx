"use client";

import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function AddPlaceForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    country: "",
    place: "",
    currency: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.country || !form.place) {
      setMessage(t("countryAndPlaceRequired") || "Country and place are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: form.country,
          place: form.place,
          currency: form.currency || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(t("placeCreated") || "Place created successfully!");
        setForm({
          country: "",
          place: "",
          currency: "",
        });
      } else {
        setMessage(data.message || "Failed to create place");
      }
    } catch (err) {
      setMessage("Failed to create place");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl">
      <h2 className="text-2xl font-semibold mb-4">
        {t("addNewPlace") || "Add New Place"}
      </h2>

      <div className="space-y-4">
        <input
          name="country"
          placeholder={t("country") || "Country"}
          value={form.country}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          name="place"
          placeholder={t("place") || "Place"}
          value={form.place}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          name="currency"
          placeholder={t("currency") || "Currency (optional)"}
          value={form.currency}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? t("creating") || "Creating..." : t("createPlace") || "Create Place"}
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
