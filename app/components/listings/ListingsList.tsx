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
import type { IListing } from "@/interfaces";

interface ListingsListProps {
  filter?: "all" | "offer" | "demand";
}

export default function ListingsList({ filter = "all" }: ListingsListProps) {
  const { t } = useLanguage();
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      setError(null);
      // Build query params based on filter
      const queryParams = filter !== "all" ? `?type=${filter}` : "";
      const res = await fetch(`/api/listings${queryParams}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || t("loginToViewDemands") || "Failed to load listings");
        setListings([]);
      } else {
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error("Failed to load listings");
      setError("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const handleOwnerClick = (owner: any) => {
    console.log("Owner clicked:", owner);
  };

  const getTypeLabel = (type: string) => {
    if (type === "offer") {
      return t("offer") || "Offer";
    }
    return t("demand") || "Demand";
  };

  if (loading) {
    return (
      <div className="card-grid card-grid--loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-grid">
        <div className="card card--empty">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="card-grid">
        <div className="card card--empty">
          <p>{t("noListings") || "No listings available"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {listings.map((listing) => (
        <Card key={listing._id} hoverable>
          <CardHeader>
            <div className="flex flex-col items-center gap-2">
              <CardLabel variant={listing.type === "offer" ? "offer" : "demand"}>
                {getTypeLabel(listing.type)}
              </CardLabel>
              <CardTitle>{listing.name}</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <p className="pb-4 ps-2">{listing.description}</p>
            {listing.place && (
              <p className="card__info">
                <span className="card__info-label">{t("place") || "Place"}:</span>{" "}
                {typeof listing.place === "object" 
                  ? `${listing.place.place}, ${listing.place.country}`
                  : listing.place}
              </p>
            )}
            {listing.serviceType && (
              <p className="card__info">
                <span className="card__info-label">{t("serviceType") || "Service Type"}:</span>{" "}
                {typeof listing.serviceType === "object" 
                  ? listing.serviceType.type
                  : listing.serviceType}
              </p>
            )}
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-4">
              <div
                className="card-owner"
                onClick={() => handleOwnerClick(listing.owner)}
              >
                <CardAvatar
                  initial={
                    typeof listing.owner === "object" && listing.owner?.username
                      ? listing.owner.username.substring(0, 1).toUpperCase()
                      : "U"
                  }
                  size="md"
                />
                <span className="card-owner__name">
                  {typeof listing.owner === "object"
                    ? listing.owner.username
                    : listing.owner}
                </span>
              </div>
              {listing.priceRange && (
                <CardBadge variant={listing.type === "offer" ? "success" : "info"}>
                  {listing.priceRange}
                </CardBadge>
              )}
            </div>
            <CardDate date={listing.date} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
