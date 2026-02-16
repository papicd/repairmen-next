"use client";

import Link from "next/link";
import { use, useState } from 'react';
import "./navbar.scss";
import { useAuth } from '@/app/context/AuthContext';
import LogoutButton from '@/app/components/LogoutButton';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

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
            Home
          </Link>
          <Link href="/services" className="navbar__link">
            Services
          </Link>
          {user && <Link href="/users" className="navbar__link">
            Users
          </Link>}
          <Link href="/contact" className="navbar__link">
            Contact
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        {!user ? (<div className="navbar__auth">
          <Link href="/login" className="navbar__btn navbar__btn--outline">
            Login
          </Link>
          <Link href="/register" className="navbar__btn navbar__btn--primary">
            Register
          </Link>
            {
              user && <div className="navbar__user-icon"></div>
            }
        </div>) :
          (<div className="navbar__logout-container"> <LogoutButton /> {
            user && <div className="navbar__user-icon" onClick={() => router.push("/profile")}>
              {user?.firstName?.substring(0,1)}</div>
          }</div>)}


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
          Home
        </Link>
        <Link href="/services" className="navbar__mobile-link">
          Services
        </Link>
        {user && <Link href="/users" className="navbar__mobile-link">
          Users
        </Link>}

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
