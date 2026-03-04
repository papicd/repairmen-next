"use client"

import { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

interface Props {
  onClose?: () => void;
}

import type { IPlace, IServiceType } from "@/interfaces";

export default function AddServiceRequestForm({ onClose }: Props) {
  const { t } = useLanguage();
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceRange: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
          place: formData.place || undefined,
          serviceType: formData.serviceType || undefined,
        }),
      });

      setFormData({
        name: "",
        description: "",
        priceRange: "",
        date: "",
        place: "",
        serviceType: "",
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
          {t("serviceName") || "Service Name"} *
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder={t("enterServiceName") || "Enter service name"}
          className="w-full px-4 py-3 rounded-xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          {t("description") || "Description"} *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder={t("describeServiceRequest") || "Describe the service request..."}
          className="w-full px-4 py-3 rounded-xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition resize-none"
        />
      </div>

      {/* Place */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          {t("place") || "Place"}
        </label>
        <select
          name="place"
          value={formData.place}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition"
        >
          <option value="">Select Place (optional)</option>
          {places.map((place) => (
            <option key={place._id} value={place._id}>
              {place.place}, {place.country}
            </option>
          ))}
        </select>
      </div>

      {/* Service Type */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          {t("serviceType") || "Service Type"}
        </label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition"
        >
          <option value="">Select Service Type (optional)</option>
          {serviceTypes.map((st) => (
            <option key={st._id} value={st._id}>
              {st.type}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          {t("priceRange") || "Price Range"}
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
          {t("date") || "Date"}
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
          {t("cancel") || "Cancel"}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white
                     font-medium hover:bg-blue-700 transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("saving") || "Saving..." : t("addNewServiceRequest") || "Create Service"}
        </button>
      </div>
    </form>
  );
}
