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
import type { IPlace, IServiceType, IOwner, IItem, IService, IServiceRequest, IServiceWithType, IServiceRequestWithType } from "@/interfaces";

type TypeFilter = "all" | "service" | "service-request";

export default function AllItemsList() {
  const { t } = useLanguage();
  const [items, setItems] = useState<IItem[]>([]);
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      // Fetch services
      const servicesRes = await fetch("/api/services");
      const servicesData = await servicesRes.json();
      const services: IServiceWithType[] = (servicesData.services || []).map((s: any) => ({
        ...s,
        __type: "service",
      }));

      // Fetch service requests
      const requestsRes = await fetch("/api/service-requests");
      const requestsData = await requestsRes.json();
      const requests: IServiceRequestWithType[] = (requestsData.services || []).map((s: any) => ({
        ...s,
        __type: "service-request",
      }));

      // Fetch places
      const placesRes = await fetch("/api/places");
      const placesData = await placesRes.json();
      setPlaces(placesData.places || []);

      // Combine and set items
      setItems([...services, ...requests]);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOwnerClick = (owner: IOwner) => {
    console.log("Owner clicked:", owner);
  };

  const togglePlace = (placeId: string) => {
    setSelectedPlaces((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    // Type filter
    if (typeFilter === "service" && item.__type !== "service") return false;
    if (typeFilter === "service-request" && item.__type !== "service-request") return false;

    // Place filter
    if (selectedPlaces.length > 0) {
      if (!item.place || !selectedPlaces.includes(item.place._id)) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="card-grid card-grid--loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              typeFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("all") || "All"}
          </button>
          <button
            onClick={() => setTypeFilter("service")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              typeFilter === "service"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("services") || "Services"}
          </button>
          <button
            onClick={() => setTypeFilter("service-request")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              typeFilter === "service-request"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("serviceRequests") || "Service Requests"}
          </button>
        </div>

        {/* Place Filter */}
        {places.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">
              {t("filterByPlace") || "Filter by place:"}
            </span>
            {places.map((place) => (
              <button
                key={place._id}
                onClick={() => togglePlace(place._id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  selectedPlaces.includes(place._id)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {place.place}, {place.country}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="card-grid">
          <div className="card card--empty">
            <p>{t("noItems") || "No items found"}</p>
          </div>
        </div>
      ) : (
        <div className="card-grid">
          {filteredItems.map((item) => (
            <Card key={item._id} hoverable>
              <CardHeader>
                <div className="flex flex-col gap-2">
                  <CardLabel variant={item.__type === "service" ? "service" : "service-request"}>
                    {item.__type === "service"
                      ? t("service") || "Service"
                      : t("serviceRequest") || "Service Request"}
                  </CardLabel>
                  <CardTitle>{item.name}</CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <p>{item.description}</p>
                {item.place && (
                  <p className="card__info">
                    <span className="card__info-label">{t("place") || "Place"}:</span>{" "}
                    {item.place.place}, {item.place.country}
                  </p>
                )}
                {item.serviceType && (
                  <p className="card__info">
                    <span className="card__info-label">{t("serviceType") || "Service Type"}:</span>{" "}
                    {item.serviceType.type}
                  </p>
                )}
              </CardContent>

              <CardFooter>
                <div className="flex items-center gap-4">
                  <div
                    className="card-owner"
                    onClick={() =>
                      handleOwnerClick(
                        item.__type === "service"
                          ? item.owner
                          : item.requestOwner
                      )
                    }
                  >
                    <CardAvatar
                      initial={
                        item.__type === "service"
                          ? item.owner?.username?.substring(0, 1).toUpperCase()
                          : item.requestOwner?.username?.substring(0, 1).toUpperCase()
                      }
                      size="md"
                    />
                    <span className="card-owner__name">
                      {item.__type === "service"
                        ? item.owner?.username
                        : item.requestOwner?.username}
                    </span>
                  </div>
                  {item.__type === "service" && "price" in item && item.price !== undefined && item.price !== null && (
                    <CardBadge variant="success">${item.price}</CardBadge>
                  )}
                  {item.__type === "service-request" && "priceRange" in item && item.priceRange && (
                    <CardBadge variant="warning">{item.priceRange}</CardBadge>
                  )}
                </div>
                <CardDate date={item.date} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
