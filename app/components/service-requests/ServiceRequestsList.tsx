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
import type { IServiceRequest, IOwner } from "@/interfaces";

export default function ServiceRequestsList() {
  const { t } = useLanguage();
  const [serviceRequests, setServiceRequests] = useState<IServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServiceRequests = async () => {
    try {
      const res = await fetch("/api/service-requests");
      const data = await res.json();
      setServiceRequests(data.services || []);
    } catch (err) {
      console.error("Failed to load service requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
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

  if (serviceRequests.length === 0) {
    return (
      <div className="card-grid">
        <div className="card card--empty">
          <p>{t("noServiceRequests") || "No service requests available"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {serviceRequests.map((request) => (
        <Card key={request._id} hoverable>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardLabel variant="service-request">{t("serviceRequest") || "Service Request"}</CardLabel>
              <CardTitle>{request.name}</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <p>{request.description}</p>
            {request.place && (
              <p className="card__info">
                <span className="card__info-label">{t("place") || "Place"}:</span>{" "}
                {request.place.place}, {request.place.country}
              </p>
            )}
            {request.serviceType && (
              <p className="card__info">
                <span className="card__info-label">{t("serviceType") || "Service Type"}:</span>{" "}
                {request.serviceType.type}
              </p>
            )}
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-4">
              <div
                className="card-owner"
                onClick={() => handleOwnerClick(request.requestOwner)}
              >
                <CardAvatar
                  initial={request.requestOwner?.username?.substring(0, 1).toUpperCase()}
                  size="md"
                />
                <span className="card-owner__name">
                  {request.requestOwner?.username}
                </span>
              </div>
              {request.priceRange && (
                <CardBadge variant="warning">{request.priceRange}</CardBadge>
              )}
            </div>
            <CardDate date={request.date} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
