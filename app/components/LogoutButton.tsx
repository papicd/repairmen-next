"use client";

import { useLanguage } from '@/app/context/LanguageContext';

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };
  const { t, locale } = useLanguage();


  return (
    <button
      onClick={handleLogout}
      className="navbar__btn navbar__btn--primary"
    >
      {t("logout")}
    </button>
  );
}
