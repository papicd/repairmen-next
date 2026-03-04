"use client";

import { useEffect, useState } from "react";
import Table, { TableColumn } from '@/app/components/ui/Table';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import type { IUserProfile } from "@/interfaces";

export default function UsersPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [users, setUsers] = useState<IUserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const usersColumns: TableColumn<IUserProfile>[] = [
    {
      key: "firstName",
      label: t("user") || "User",
      render: (row) => (
        <div className="table__avatar">
          <div className="table__avatar-initials">
            {row.firstName?.substring(0, 1)}{row.lastName?.substring(0, 1)}
          </div>
          <div>
            <div className="table__avatar-name">{row.firstName} {row.lastName}</div>
            <div className="table__avatar-email">@{row.username}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: t("email") || "Email",
      hideOnMobile: true,
    },
    {
      key: "phone",
      label: t("phone") || "Phone",
      render: (row) => row.phone || <span className="text-gray-400">-</span>,
    },
    {
      key: "isServiceProvider",
      label: t("role") || "Role",
      render: (row) => {
        if (row.isAdmin) {
          return <span className="table__badge table__badge--warning">{t("administrator") || "Admin"}</span>;
        }
        if (row.isServiceProvider) {
          return <span className="table__badge table__badge--success">{t("provider") || "Provider"}</span>;
        }
        return <span className="table__badge table__badge--default">{t("user") || "User"}</span>;
      },
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="table__loading">
              <div className="table__loading-spinner"></div>
              <p className="text-gray-500">{t("loadingUsers") || "Loading users..."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("users") || "Users"}</h1>
          <p className="text-gray-500 mt-2">{t("manageUsers") || "Manage and view all registered users"}</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {users.length === 0 ? (
            <div className="table__empty">
              <div className="table__empty-icon">👥</div>
              <p className="table__empty-text">{t("noUsersFound") || "No users found"}</p>
            </div>
          ) : (
            <Table 
              columns={usersColumns} 
              data={users} 
              onRowClick={(row) => router.push(`/users/${row._id}`)} 
              getRowKey={(row) => row._id}
              mobileTitleColumn="firstName"
            />
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex gap-6 text-sm text-gray-500">
          <span>{t("totalUsers") || "Total Users"}: <strong className="text-gray-900">{users.length}</strong></span>
          <span>{t("providers") || "Providers"}: <strong className="text-green-600">{users.filter(u => u.isServiceProvider).length}</strong></span>
          <span>{t("admins") || "Admins"}: <strong className="text-amber-600">{users.filter(u => u.isAdmin).length}</strong></span>
        </div>
      </div>
    </div>
  );
}
