"use client";

import { useEffect, useState } from "react";
import Table, { TableColumn } from '@/app/components/ui/Table';
import { useLanguage } from '@/app/context/LanguageContext';

interface Service {
  _id: string;
  name: string;
  description: string;
  price?: number;
  date?: string;
  owner: any;
}


export default function ServicesList() {
  const { t, locale } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const servicesColumns: TableColumn<Service>[] = [
    {
      key: "name",
      label: t("serviceName"),
      sortable: true,
    },
    {
      key: "description",
      label: t("description"),
    },
    {
      key: "owner",
      label: t("owner"),
      render: (row) => (
        <span
          className="table__link"
          onClick={() => handleOwnerClick(row.owner)}
        >
        {row?.owner?.username}
      </span>
      ),
    },
    {
      key: "date",
      label: t("date"),
      render: (row) =>
        row?.date
          ? new Date(row.date).toLocaleDateString()
          : "-",
    },
    {
      key: "price",
      label: t("price"),
      align: "right",
      render: (row) =>
        row.price ? `$${row.price}` : "-",
    },
  ];

  const handleOwnerClick = (owner: Owner) => {
    //TODO handle click later
    console.log("Owner clicked:", owner);
  };


  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <div>Loading services...</div>;

  return (
    <div>
      <Table columns={servicesColumns} data={services} />
    </div>
  );
}
