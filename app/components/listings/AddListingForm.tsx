"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import type { IPlace, IServiceType } from "@/interfaces";

export default function AddListingForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [listingType, setListingType] = useState<"offer" | "demand">("offer");
  const [form, setForm] = useState({
    name: "",
    description: "",
    priceRange: "",
    date: "",
    place: "",
    serviceType: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch places and service types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, serviceTypesRes] = await Promise.all([
          fetch("/api/places"),
          fetch("/api/service-types"),
        ]);
        const placesData = await placesRes.json();
        const serviceTypesData = await serviceTypesRes.json();
        setPlaces(placesData.places || []);
        setServiceTypes(serviceTypesData.serviceTypes || []);
      } catch (err) {
        console.error(t("failedToFetch") || "Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  // Block if not logged in
  if (!user) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mb-10">
        <p className="text-red-500">{t("pleaseLogin") || "Please login to create a listing"}</p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (type: "offer" | "demand") => {
    setListingType(type);
  };

  const handleSubmit = async () => {
    setError("");

    // Validate required fields
    if (!form.name || !form.description) {
      setError(t("nameAndDescriptionRequired") || "Name and description are required");
      return;
    }

    if (!form.place) {
      setError(t("placeRequired") || "Place is required");
      return;
    }

    if (!form.serviceType) {
      setError(t("serviceTypeRequired") || "Service type is required");
      return;
    }

    // Validate priceRange is required
    if (!form.priceRange) {
      setError(t("priceRangeRequired") || "Price range is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          priceRange: form.priceRange,
          date: form.date || undefined,
          place: form.place,
          serviceType: form.serviceType,
          type: listingType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create listing");
        return;
      }

      // Reset form
      setForm({
        name: "",
        description: "",
        priceRange: "",
        date: "",
        place: "",
        serviceType: "",
      });

      // Close modal and notify parent
      if (onClose) {
        onClose();
      }
      
      // Reload the page to show the new listing
      window.location.reload();
    } catch (err) {
      setError("Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl mb-10">
      <h2 className="text-2xl font-semibold mb-4">
        {t("addNewListing") || "Add New Listing"}
      </h2>

      {/* Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {t("listingType") || "Listing Type"}
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="listingType"
              value="offer"
              checked={listingType === "offer"}
              onChange={() => handleTypeChange("offer")}
              className="w-4 h-4 text-blue-600"
            />
            <span>{t("offer") || "Offer"}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="listingType"
              value="demand"
              checked={listingType === "demand"}
              onChange={() => handleTypeChange("demand")}
              className="w-4 h-4 text-green-600"
            />
            <span>{t("demand") || "Demand"}</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          name="name"
          placeholder={t("listingName") || "Listing Name"}
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          name="description"
          placeholder={t("description") || "Description"}
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <select
          name="place"
          value={form.place}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        >
          <option value="">{t("selectPlace") || "Select Place"} *</option>
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
          required
        >
          <option value="">{t("selectServiceType") || "Select Service Type"} *</option>
          {serviceTypes.map((st) => (
            <option key={st._id} value={st._id}>
              {st.type}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="priceRange"
          placeholder={t("priceRange") + " * (e.g., 50-100 EUR)" || "Price Range * (e.g., 50-100 EUR)"}
          value={form.priceRange}
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
          {loading
            ? t("creating") || "Creating..."
            : listingType === "offer"
            ? t("createOffer") || "Create Offer"
            : t("createDemand") || "Create Demand"}
        </button>
      </div>
    </div>
  );
}
