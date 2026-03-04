"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import type { IPlace, IServiceType } from "@/interfaces";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [places, setPlaces] = useState<IPlace[]>([]);
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    place: "",
    serviceType: [] as string[],
    phone: "",
    isServiceProvider: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch places and service types on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, serviceTypesRes] = await Promise.all([
          fetch("/api/places"),
          fetch("/api/service-types"),
        ]);
        const placesData = await placesRes.json();
        const serviceTypesData = await serviceTypesRes.json();
        setPlaces(placesData.places || []);
        setServiceTypes(serviceTypesData.serviceTypes || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm({ ...form, [name]: checked });
  };

  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !form.serviceType.includes(value)) {
      setForm({ ...form, serviceType: [...form.serviceType, value] });
    }
  };

  const removeServiceType = (serviceTypeId: string) => {
    setForm({
      ...form,
      serviceType: form.serviceType.filter((id) => id !== serviceTypeId),
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError(t("passwordsDoNotMatch") || "Passwords do not match");
      return;
    }

    // Validate required fields
    if (!form.firstName || !form.lastName || !form.email || !form.username || !form.password) {
      setError(t("allRequiredFields") || "All required fields must be filled");
      return;
    }

    // Validate place is selected
    if (!form.place) {
      setError(t("placeRequired") || "Please select a place");
      return;
    }

    // If service provider, at least one service type should be selected
    if (form.isServiceProvider && form.serviceType.length === 0) {
      setError(t("serviceTypeRequired") || "Please select at least one service type");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          username: form.username,
          password: form.password,
          place: form.place,
          serviceType: form.serviceType,
          phone: form.phone || undefined,
          isServiceProvider: form.isServiceProvider,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(t("registrationFailed") || data.message || "Registration failed");
      }
    } catch (err) {
      setError(t("registrationFailed") || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {t("register") || "Register"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">{error}</p>
        )}

        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            {t("personalInformation") || "Personal Information"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("firstName") || "First Name"} *
              </label>
              <input
                type="text"
                name="firstName"
                placeholder={t("firstName") || "First Name"}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("lastName") || "Last Name"} *
              </label>
              <input
                type="text"
                name="lastName"
                placeholder={t("lastName") || "Last Name"}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("phone") || "Phone"} ({t("optional") || "optional"})
            </label>
            <input
              type="tel"
              name="phone"
              placeholder={t("phone") || "Phone number"}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Account Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            {t("accountInformation") || "Account Information"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("username") || "Username"} *
            </label>
            <input
              type="text"
              name="username"
              placeholder={t("username") || "Username"}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("email") || "Email"} *
            </label>
            <input
              type="email"
              name="email"
              placeholder={t("email") || "Email"}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("password") || "Password"} *
              </label>
              <input
                type="password"
                name="password"
                placeholder={t("password") || "Password"}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("confirmPassword") || "Confirm Password"} *
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("confirmPassword") || "Confirm Password"}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            {t("location") || "Location"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("place") || "Place"} *
            </label>
            <select
              name="place"
              value={form.place}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">{t("selectPlace") || "Select Place"}</option>
              {places.map((place) => (
                <option key={place._id} value={place._id}>
                  {place.place}, {place.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Service Provider Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            {t("serviceProvider") || "Service Provider"}
          </h3>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="isServiceProvider"
              checked={form.isServiceProvider}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">
              {t("registerAsServiceProvider") || "Register as Service Provider"}
            </span>
          </label>

          {form.isServiceProvider && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("serviceTypes") || "Service Types"} *
              </label>
              <select
                value=""
                onChange={handleServiceTypeChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">{t("selectServiceType") || "Select Service Type"}</option>
                {serviceTypes
                  .filter((st) => !form.serviceType.includes(st._id))
                  .map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.type}
                    </option>
                  ))}
              </select>

              {form.serviceType.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.serviceType.map((stId) => {
                    const serviceType = serviceTypes.find((st) => st._id === stId);
                    return serviceType ? (
                      <span
                        key={stId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {serviceType.type}
                        <button
                          type="button"
                          onClick={() => removeServiceType(stId)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {form.isServiceProvider && form.serviceType.length === 0 && (
                <p className="text-sm text-orange-500 mt-1">
                  {t("selectAtLeastOneServiceType") || "Please select at least one service type"}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
        >
          {loading ? t("registering") || "Registering..." : t("register") || "Register"}
        </button>

        <p className="text-sm text-center">
          {t("alreadyHaveAccount") || "Already have an account?"}{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            {t("login") || "Login"}
          </a>
        </p>
      </form>
    </div>
  );
}
