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
import { useAuth } from "@/app/context/AuthContext";

interface ListingsListProps {
  filter?: "all" | "offer" | "demand";
}

export default function ListingsList({ filter = "all" }: ListingsListProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  
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
      if (showClosed) {
        params.set("showClosed", "true");
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
  }, [typeFilter, selectedServiceTypes, selectedPlaces, showClosed]);

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

  const handleApply = async (listingId: string) => {
    if (!user) {
      alert(t("pleaseLogin") || "Please login to apply");
      return;
    }

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || t("somethingWentWrong") || "Something went wrong");
        return;
      }

      alert(t("applicationSubmitted") || "Application submitted successfully!");
    } catch (err) {
      console.error("Failed to apply:", err);
      alert(t("somethingWentWrong") || "Something went wrong");
    }
  };

  const handleCloseListing = async (listingId: string, currentlyClosed: boolean) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ closed: !currentlyClosed }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || t("somethingWentWrong") || "Something went wrong");
        return;
      }

      // Refresh the listings
      fetchListings();
    } catch (err) {
      console.error("Failed to close listing:", err);
      alert(t("somethingWentWrong") || "Something went wrong");
    }
  };

  const isListingOwner = (listing: IListing) => {
    if (!user) return false;
    const owner = listing.owner as any;
    return owner && owner._id === user._id;
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

          {/* Show Expired Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer self-end">
            <input
              type="checkbox"
              checked={showClosed}
              onChange={(e) => setShowClosed(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              {t("showExpired") || "Show expired/closed listings"}
            </span>
          </label>
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
                {listing.place ? (
                  <p className="card__info">
                    <span className="card__info-label">{t("place") || "Place"}:</span>{" "}
                    {typeof listing.place === "object" && (listing.place as any).place
                      ? `${(listing.place as any).place}, ${(listing.place as any).country}`
                      : String(listing.place)}
                  </p>
                ) : null}
                {listing.serviceType ? (
                  <p className="card__info">
                    <span className="card__info-label">{t("serviceType") || "Service Type"}:</span>{" "}
                    {typeof listing.serviceType === "object" && (listing.serviceType as any).type
                      ? (listing.serviceType as any).type
                      : String(listing.serviceType)}
                  </p>
                ) : null}
              </CardContent>

              <CardFooter>
                <div className="flex items-center gap-4">
                  <div
                    className="card-owner"
                    onClick={() => handleOwnerClick(listing.owner)}
                  >
                    <CardAvatar
                      initial={
                        typeof listing.owner === "object" && (listing.owner as any)?.username
                          ? (listing.owner as any).username.substring(0, 1).toUpperCase()
                          : "U"
                      }
                      size="md"
                    />
                    <span className="card-owner__name">
                      {typeof listing.owner === "object"
                        ? (listing.owner as any).username
                        : listing.owner}
                    </span>
                  </div>
                  {listing.priceRange ? (
                    <CardBadge variant={listing.type === "offer" ? "success" : "info"}>
                      {listing.priceRange}
                    </CardBadge>
                  ) : null}
                </div>
                <CardDate date={listing.date ? listing.date.toString() : null} />
              </CardFooter>

              {/* Action Buttons */}
              <div className="px-4 pb-4 flex gap-2">
                {/* Close/Reopen Button - Only for owners */}
                {user && isListingOwner(listing) && (
                  <button
                    type="button"
                    onClick={() => handleCloseListing(listing._id, listing.closed || false)}
                    className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
                      listing.closed
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {listing.closed 
                      ? (t("reopenListing") || "Reopen")
                      : (t("closeListing") || "Close")
                    }
                  </button>
                )}

                {/* Apply Button - For logged in users who are service providers */}
                {user && !isListingOwner(listing) && (
                  <button
                    type="button"
                    onClick={() => handleApply(listing._id)}
                    disabled={
                      (!user.isServiceProvider && listing.type === "demand") || 
                      listing.closed
                    }
                    className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
                      (!user.isServiceProvider && listing.type === "demand") || listing.closed
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    title={
                      !user.isServiceProvider && listing.type === "demand"
                        ? (t("onlyServiceProvidersCanApply") || "Only service providers can apply for demands")
                        : listing.closed
                          ? (t("listingClosed") || "This listing is closed")
                          : (t("applyForListing") || "Apply for this listing")
                    }
                  >
                    {t("apply") || "Apply"}
                  </button>
                )}

                {/* Login prompt - For non-logged in users */}
                {!user && (
                  <a
                    href="/login"
                    className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors text-center block ${
                      listing.type === "offer"
                        ? "bg-gray-500 hover:bg-gray-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title={listing.type === "demand" 
                      ? (t("loginToViewDemands") || "Please login to view demands")
                      : (t("login") || "Login to apply")
                    }
                  >
                    {listing.type === "offer" 
                      ? (t("login") || "Login to apply")
                      : (t("loginToViewDemands") || "Login to view")
                    }
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
