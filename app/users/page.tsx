"use client";

import { useEffect, useState } from "react";
import Table, { TableColumn } from '@/app/components/ui/Table';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isServiceProvider: boolean;
}

export default function UsersPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const usersColumns: TableColumn<User>[] = [

    {
      key: "firstName",
      label: t("firstName"),
      sortable: true,
    },
    {
      key: "lastName",
      label: t("lastName"),
      sortable: true
    },
    {
      key: "email",
      label: t("email"),
    },
    {
      key: "username",
      label: t("username"),
    },
    {
      key: "isServiceProvider",
      label: t("provideServices"),
      render: (row) => {
        return (<span>{row.isServiceProvider ? t('yes'): t('no')}</span>)
      }
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

  if (loading) return <p className="p-10">Loading users...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <Table columns={usersColumns} data={users} onRowClick={(row) => router.push(`/users/${row._id}`)} getRowKey={(row) => row._id} />
      </div>
    </div>
  );
}
