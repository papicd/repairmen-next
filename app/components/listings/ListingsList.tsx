"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import ButtonGroup from "@/app/components/ui/ButtonGroup";
import Select from "@/app/components/ui/Select";
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
import type { IListing, IPlace, IServiceType } from "@/interfaces";

interface ListingsListProps {
  filter?: "all" | "offer" | "demand";
}

export default function ListingsList({ filter = "all" }: ListingsListProps) {
  const { t } = useLanguage();
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>(filter);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);

  // Type options for ButtonGroup
  const typeOptions = [
    { value: "all", label: t("all") || "All" },
    { value: "offer", label: t("offer") || "Offer" },
    { value: "demand", label: t("demand") || "Demand" },
  ];

  // Convert to Select options
  const serviceTypeOptions: { value: string; label: string }[] = serviceTypes.map(
    (st) => ({ value: st._id, label: st.type })
  );
  
  const placeOptions: { value: string; label: string }[] = places.map((p) => ({
    value: p._id,
    label: `${p.place}, ${p.country}`,
  }));

  // Fetch places and service types for filters
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [placesRes, serviceTypesRes] = await Promise.all([
          fetch("/api/places"),
          fetch("/api/service-types"),
        ]);
        
        const placesData = await placesRes.json();
        const serviceTypesData = await serviceTypesRes.json();
        
        setPlaces(placesData.places || []);
        setServiceTypes(serviceTypesData.serviceTypes || []);
      } catch (err) {
        console.error("Failed to load filter options:", err);
      }
    };
    
    fetchFilterOptions();
  }, []);

  const fetchListings = async () => {
    try {
      setError(null);
      
      // Build query params
      const params = new URLSearchParams();
      if (typeFilter !== "all") {
        params.set("type", typeFilter);
      }
      if (selectedServiceTypes.length > 0) {
        params.set("serviceType", selectedServiceTypes.join(","));
      }
      if (selectedPlaces.length > 0) {
        params.set("place", selectedPlaces.join(","));
      }
      
      const queryString = params.toString();
      const res = await fetch(`/api/listings${queryString ? `?${queryString}` : ""}`);
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

  // Fetch when filters change
  useEffect(() => {
    setLoading(true);
    fetchListings();
  }, [typeFilter, selectedServiceTypes, selectedPlaces]);

  // Also refetch when prop filter changes
  useEffect(() => {
    setTypeFilter(filter);
  }, [filter]);

  const clearFilters = () => {
    setTypeFilter("all");
    setSelectedServiceTypes([]);
    setSelectedPlaces([]);
  };

  const handleOwnerClick = (owner: any) => {
    console.log("Owner clicked:", owner);
  };

  const getTypeLabel = (type: string) => {
    if (type === "offer") {
      return t("offer") || "Offer";
    }
    return t("demand") || "Demand";
  };

  const hasActiveFilters = typeFilter !== "all" || selectedServiceTypes.length > 0 || selectedPlaces.length > 0;

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Filters skeleton */}
        <div className="bg-white rounded-lg p-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        {/* Cards skeleton */}
        <div className="card-grid card-grid--loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Type Filter - ButtonGroup */}
          <ButtonGroup
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            label={t("type") || "Type"}
          />

          {/* Service Type Multi-select */}
          <Select
            options={serviceTypeOptions}
            value={selectedServiceTypes}
            onChange={setSelectedServiceTypes}
            label={`${t("serviceType") || "Service Type"}${selectedServiceTypes.length > 0 ? ` (${selectedServiceTypes.length})` : ""}`}
            placeholder={t("selectServiceTypes") || "Select service types..."}
            multiple={true}
            searchable={true}
          />

          {/* Place Multi-select */}
          <Select
            options={placeOptions}
            value={selectedPlaces}
            onChange={setSelectedPlaces}
            label={`${t("place") || "Place"}${selectedPlaces.length > 0 ? ` (${selectedPlaces.length})` : ""}`}
            placeholder={t("selectPlaces") || "Select places..."}
            multiple={true}
            searchable={true}
          />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:underline self-end"
            >
              {t("clearFilters") || "Clear Filters"}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card-grid">
          <div className="card card--empty">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!error && listings.length === 0 && (
        <div className="card-grid">
          <div className="card card--empty">
            <p>{t("noListings") || "No listings available"}</p>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {listings.length > 0 && (
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
      )}
    </div>
  );
}
