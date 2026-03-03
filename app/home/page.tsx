"use client";

import { useAuth } from '@/app/context/AuthContext';
import AllItemsList from '@/app/components/home/AllItemsList';
import { useLanguage } from '@/app/context/LanguageContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t("loading") || "Loading..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold">
            {t("welcome") || "Welcome"} {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {t("browseServicesAndRequests") || "Browse all services and service requests"}
          </p>
        </div>

        {/* All Items List with Filters */}
        <AllItemsList />
      </div>
    </div>
  );
}
