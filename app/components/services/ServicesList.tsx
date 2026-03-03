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
  CardLabel,
} from "@/app/components/ui/Card";
import type { IService, IOwner } from "@/interfaces";

export default function ServicesList() {
  const { t } = useLanguage();
  const [services, setServices] = useState<IService[]>([]);
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

  const handleOwnerClick = (owner: IOwner) => {
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
            <div className="flex items-center gap-2">
              <CardLabel variant="service">{t("service") || "Service"}</CardLabel>
              <CardTitle>{service.name}</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <p>{service.description}</p>
            {service.place && (
              <p className="card__info">
                <span className="card__info-label">{t("place") || "Place"}:</span>{" "}
                {service.place.place}, {service.place.country}
              </p>
            )}
            {service.serviceType && (
              <p className="card__info">
                <span className="card__info-label">{t("serviceType") || "Service Type"}:</span>{" "}
                {service.serviceType.type}
              </p>
            )}
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-4">
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
              {service.price !== undefined && service.price !== null && (
                <CardBadge variant="success">${service.price}</CardBadge>
              )}
            </div>
            <CardDate date={service.date} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
