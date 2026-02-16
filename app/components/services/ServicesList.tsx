"use client";

import { useEffect, useState } from "react";
import Table from '@/app/components/ui/Table';

interface Service {
  _id: string;
  name: string;
  description: string;
  price?: number;
  date?: string;
  owner: any;
}

type TableColumn<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const servicesColumns: TableColumn<Service>[] = [
    {
      key: "name",
      label: "Service Name",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "owner",
      label: "Owner",
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
      label: "Date",
      render: (row) =>
        row?.date
          ? new Date(row.date).toLocaleDateString()
          : "-",
    },
    {
      key: "price",
      label: "Price",
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
