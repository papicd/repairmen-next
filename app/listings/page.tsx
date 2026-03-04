"use client";

import { useState } from "react";
import Modal from "@/app/components/ui/Modal";
import AddListingForm from "@/app/components/listings/AddListingForm";
import ListingsList from "@/app/components/listings/ListingsList";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ListingsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "offer" | "demand">("all");
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("listings") || "Listings"}</h1>

          {user && (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-lg add-button"
              style={{ width: "48px" }}
            >
              +
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("all") || "All"}
          </button>
          <button
            onClick={() => setFilter("offer")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "offer"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("offers") || "Offers"}
          </button>
          <button
            onClick={() => setFilter("demand")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "demand"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("demands") || "Demands"}
          </button>
        </div>

        <ListingsList filter={filter} />
      </div>

      {/* Modal is rendered OUTSIDE layout so it doesn't affect spacing */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("addNewListing") || "Add New Listing"}
      >
        <AddListingForm onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
}
