"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useRouter } from "next/navigation";
import type { IUserProfile } from "@/interfaces";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "professional" | "account">("personal");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Users
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex items-end -mt-16 mb-4">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl flex items-center justify-center text-4xl font-bold text-white border-4 border-white">
                {user.firstName?.substring(0, 1)}
                {user.lastName?.substring(0, 1)}
              </div>
              <div className="ml-6 pb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-500">@{user.username}</p>
              </div>
              {user.isAdmin && (
                <span className="ml-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  Admin
                </span>
              )}
              {user.isServiceProvider && !user.isAdmin && (
                <span className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  Service Provider
                </span>
              )}
              {!user.isServiceProvider && !user.isAdmin && (
                <span className="ml-auto bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  User
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === "personal"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Info
              </span>
            </button>
            <button
              onClick={() => setActiveTab("professional")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === "professional"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Professional
              </span>
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === "account"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account
              </span>
            </button>
          </div>

          <div className="p-8">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">First Name</label>
                    <p className="mt-1 text-gray-900 font-medium">{user.firstName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Name</label>
                    <p className="mt-1 text-gray-900 font-medium">{user.lastName}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                  <p className="mt-1 text-gray-900 font-medium">{user.email}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</label>
                  <p className="mt-1 text-gray-900 font-medium">@{user.username}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                  <p className="mt-1 text-gray-900 font-medium">{user.phone || <span className="text-gray-400">Not provided</span>}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {user.place ? (
                      <>
                        {user.place.place}, {user.place.country}
                        {user.place.currency && <span className="text-gray-500 text-sm ml-2">({user.place.currency})</span>}
                      </>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Professional Tab */}
            {activeTab === "professional" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Service Provider</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {user.isServiceProvider 
                          ? "This user offers services to other users" 
                          : "This user does not offer services"}
                      </p>
                    </div>
                    <span className={`table__badge ${user.isServiceProvider ? 'table__badge--success' : 'table__badge--default'}`}>
                      {user.isServiceProvider ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {user.isServiceProvider && user.serviceType && user.serviceType.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Service Types</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.serviceType.map((st) => (
                        <div
                          key={st._id}
                          className="flex items-center p-4 rounded-xl border-2 border-gray-100 bg-gray-50"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <span className="block font-medium text-gray-900">{st.type}</span>
                            {st.description && (
                              <span className="block text-sm text-gray-500">{st.description}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {user.isServiceProvider && (!user.serviceType || user.serviceType.length === 0) && (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-gray-500">No service types assigned</p>
                  </div>
                )}
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Account Type</span>
                      <span className="font-medium">
                        {user.isAdmin ? (
                          <span className="text-amber-600">Administrator</span>
                        ) : user.isServiceProvider ? (
                          <span className="text-green-600">Service Provider</span>
                        ) : (
                          <span className="text-gray-600">User</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Member since</span>
                      <span className="font-medium text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        }) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Last updated</span>
                      <span className="font-medium text-gray-900">
                        {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        }) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">User ID</span>
                      <span className="font-mono text-sm text-gray-500">{user._id}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
