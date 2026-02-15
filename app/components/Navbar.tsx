"use client";

import Link from "next/link";
import { useState } from "react";
import "./navbar.scss";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">

        {/* Logo */}
        <Link href="/" className="navbar__logo">
          MyApp
        </Link>

        {/* Desktop Menu */}
        <div className="navbar__links">
          <Link href="/dashboard" className="navbar__link">
            Dashboard
          </Link>
          <Link href="/services" className="navbar__link">
            Services
          </Link>
          <Link href="/about" className="navbar__link">
            About
          </Link>
          <Link href="/contact" className="navbar__link">
            Contact
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="navbar__auth">
          <Link href="/login" className="navbar__btn navbar__btn--outline">
            Login
          </Link>
          <Link href="/register" className="navbar__btn navbar__btn--primary">
            Register
          </Link>
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
        <Link href="/dashboard" className="navbar__mobile-link">
          Dashboard
        </Link>
        <Link href="/services" className="navbar__mobile-link">
          Services
        </Link>
        <Link href="/about" className="navbar__mobile-link">
          About
        </Link>
        <Link href="/contact" className="navbar__mobile-link">
          Contact
        </Link>

        <div className="navbar__mobile-auth">
          <Link href="/login" className="navbar__mobile-btn">
            Login
          </Link>
          <Link href="/register" className="navbar__mobile-btn">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
