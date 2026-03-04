"use client";

import Link from "next/link";
import { useState } from "react";
import "./navbar.scss";
import { useAuth } from "@/app/context/AuthContext";
import LogoutButton from "@/app/components/LogoutButton";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Navbar() {
  const { t, locale, changeLanguage } = useLanguage();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__container">

        {/* Logo */}
        <Link href="/" className="navbar__logo">
          MyApp
        </Link>

        {/* Desktop Menu */}
        <div className="navbar__links">
          <Link href="/home" className="navbar__link">
            {t("home")}
          </Link>

          <Link href="/listings" className="navbar__link">
            {t("listings")}
          </Link>

          {user && (
            <Link href="/users" className="navbar__link">
              {t("users")}
            </Link>
          )}

          {user && user.isAdmin && (
            <Link href="/admin" className="navbar__link">
              {t("admin")}
            </Link>
          )}

          <Link href="/contact" className="navbar__link">
            {t("contact")}
          </Link>
        </div>

        {/* Desktop Right Side */}
        <div className="navbar__right">

          {/* 🌍 Language Switch */}
          {/*TODO Remove display none for multi languages*/}
          <button
            className="navbar__lang d-none"
            style={{ display: 'none' }}
            onClick={() => changeLanguage(locale === "en" ? "sr" : "en")}
          >
            {locale === "en" ? "SR" : "EN"}
          </button>

          {/* Auth Section */}
          {!user ? (
            <div className="navbar__auth">
              <Link href="/login" className="navbar__btn navbar__btn--outline">
                {t("login")}
              </Link>
              <Link href="/register" className="navbar__btn navbar__btn--primary">
                {t("register")}
              </Link>
            </div>
          ) : (
            <div className="navbar__logout-container">
              <LogoutButton />
              <div
                className="navbar__user-icon"
                onClick={() => router.push("/profile")}
              >
                {user?.firstName?.substring(0, 1)}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar__bar"></span>
          <span className="navbar__bar"></span>
          <span className="navbar__bar"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${isOpen ? "active" : ""}`}>
        <Link href="/home" className="navbar__mobile-link">
          {t("home")}
        </Link>

        <Link href="/listings" className="navbar__mobile-link">
          {t("listings")}
        </Link>

        {user && (
          <Link href="/users" className="navbar__mobile-link">
            {t("users")}
          </Link>
        )}

        {user && user.isAdmin && (
          <Link href="/admin" className="navbar__mobile-link">
            {t("admin")}
          </Link>
        )}

        <Link href="/contact" className="navbar__mobile-link">
          {t("contact")}
        </Link>

        {/* 🌍 Mobile Language Switch */}
        <button
          className="navbar__mobile-btn"
          style={{ display: 'none' }}
          onClick={() => changeLanguage(locale === "en" ? "sr" : "en")}
        >
          {locale === "en" ? "Switch to Serbian" : "Prebaci na engleski"}
        </button>
      </div>
    </nav>
  );
}
