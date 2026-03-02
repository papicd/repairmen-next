"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AddPlaceForm from "@/app/components/admin/AddPlaceForm";
import AddServiceTypeForm from "@/app/components/admin/AddServiceTypeForm";
import { useLanguage } from "@/app/context/LanguageContext";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t("loading") || "Loading..."}</p>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t("adminDashboard") || "Admin Dashboard"}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <AddPlaceForm />
        <AddServiceTypeForm />
      </div>
    </div>
  );
}
