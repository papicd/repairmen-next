"use client";

import { useState } from "react";
import Modal from "@/app/components/ui/Modal";
import AddServiceForm from "@/app/components/services/AddServiceForm";
import ServicesList from "@/app/components/services/ServicesList";

export default function ServicesPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Services</h1>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-lg add-button"
            style={{width: '48px'}}
          >
            +
          </button>
        </div>

        <ServicesList />

      </div>

      {/* Modal is rendered OUTSIDE layout so it doesn't affect spacing */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Service"
      >
        <AddServiceForm onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
}
