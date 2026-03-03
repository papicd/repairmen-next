"use client"

import Modal from '@/app/components/ui/Modal';
import { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import AddServiceRequestForm from '@/app/components/service-requests/AddServiceRequestForm';
import ServiceRequestsList from '@/app/components/service-requests/ServiceRequestsList';

export default function ServiceRequestsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Top Bar */}
        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold">{t("serviceRequests")}</h1>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-lg add-button"
            style={{width: '48px'}}
          >
            +
          </button>
        </div>

        {/* Service Requests List */}
        <ServiceRequestsList />

      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("addNewServiceRequest")}
      >
        <AddServiceRequestForm onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  )
}
