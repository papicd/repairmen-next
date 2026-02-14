"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
