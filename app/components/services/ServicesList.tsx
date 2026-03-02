"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardBadge,
  CardAvatar,
  CardDate,
} from "@/app/components/ui/Card";

interface Owner {
  _id: string;
  username: string;
  email: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price?: number;
  date?: string;
  owner: Owner;
}

export default function ServicesList() {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleOwnerClick = (owner: Owner) => {
    console.log("Owner clicked:", owner);
  };

  if (loading) {
    return (
      <div className="card-grid card-grid--loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="card-grid">
        <div className="card card--empty">
          <p>{t("noServices") || "No services available"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {services.map((service) => (
        <Card key={service._id} hoverable>
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            {service.price && (
              <CardBadge variant="success">${service.price}</CardBadge>
            )}
          </CardHeader>

          <CardContent>{service.description}</CardContent>

          <CardFooter>
            <div
              className="card-owner"
              onClick={() => handleOwnerClick(service.owner)}
            >
              <CardAvatar
                initial={service.owner?.username?.substring(0, 1).toUpperCase()}
                size="md"
              />
              <span className="card-owner__name">
                {service.owner?.username}
              </span>
            </div>
            <CardDate date={service.date} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
