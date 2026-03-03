"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from "@/app/context/LanguageContext";
import type { IPlace, IServiceType } from "@/interfaces";

export default function AddServiceForm() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    date: "",
    place: "",
    serviceType: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch places
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, serviceTypesRes] = await Promise.all([
          fetch("/api/places"),
          fetch("/api/service-types")
        ]);
        const placesData = await placesRes.json();
        const serviceTypesData = await serviceTypesRes.json();
        setPlaces(placesData.places || []);
        setServiceTypes(serviceTypesData.serviceTypes || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  // 👇 Block if not provider
  if (!user || !user.isServiceProvider) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
          place: form.place || undefined,
          serviceType: form.serviceType || undefined,
        }),
      });

      setForm({
        name: "",
        description: "",
        price: "",
        date: "",
        place: "",
        serviceType: "",
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

        <select
          name="place"
          value={form.place}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Place (optional)</option>
          {places.map((place) => (
            <option key={place._id} value={place._id}>
              {place.place}, {place.country}
            </option>
          ))}
        </select>

        <select
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Service Type (optional)</option>
          {serviceTypes.map((st) => (
            <option key={st._id} value={st._id}>
              {st.type}
            </option>
          ))}
        </select>

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
