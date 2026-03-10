"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "./navbar.scss";
import { useAuth } from "@/app/context/AuthContext";
import LogoutButton from "@/app/components/LogoutButton";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";

interface Notification {
  _id: string;
  sender: {
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    phone?: string;
  };
  listing: {
    name: string;
    type: string;
  };
  message: string;
  isRead: boolean;
  applicationStatus: "pending" | "accepted" | "denied";
  createdAt: string;
}

export default function Navbar() {
  const { t, locale, changeLanguage } = useLanguage();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAllRead: true }),
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const handleAcceptApplication = async (notificationId: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId, acceptApplication: true }),
      });

      if (res.ok) {
        // Refresh notifications
        fetchNotifications();
        alert(t("applicationAccepted") || "Application accepted!");
      }
    } catch (err) {
      console.error("Failed to accept application:", err);
    }
  };

  const handleDenyApplication = async (notificationId: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId, denyApplication: true }),
      });

      if (res.ok) {
        // Refresh notifications
        fetchNotifications();
        alert(t("applicationDenied") || "Application denied!");
      }
    } catch (err) {
      console.error("Failed to deny application:", err);
    }
  };

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
              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        {t("notifications") || "Notifications"}
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-500 hover:text-blue-700"
                        >
                          {t("markAllRead") || "Mark all as read"}
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-gray-500 text-sm">
                          {t("noNotifications") || "No notifications"}
                        </p>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                              !notification.isRead ? "bg-blue-50" : ""
                            }`}
                          >
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                            {/* Accept/Deny buttons for pending applications */}
                            {notification.type === "apply" && notification.applicationStatus === "pending" && (
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => handleAcceptApplication(notification._id)}
                                  className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                  {t("accept") || "Accept"}
                                </button>
                                <button
                                  onClick={() => handleDenyApplication(notification._id)}
                                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  {t("deny") || "Deny"}
                                </button>
                              </div>
                            )}
                            {/* Show status for processed applications */}
                            {notification.type === "apply" && notification.applicationStatus && notification.applicationStatus !== "pending" && (
                              <p className={`text-xs mt-1 font-medium ${
                                notification.applicationStatus === "accepted" 
                                  ? "text-green-600" 
                                  : "text-red-600"
                              }`}>
                                {notification.applicationStatus === "accepted" 
                                  ? (t("accepted") || "Accepted")
                                  : (t("denied") || "Denied")
                                }
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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
