"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { useProperties } from "@/hooks/useProperties";
import { PropertyFilters as PropertyFiltersType } from "@/types/property";
import { Loader2, Grid3x3, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import PropertyMap to avoid SSR issues with Leaflet
const PropertyMap = dynamic(
  () =>
    import("@/components/property/PropertyMap").then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg" />
    ),
  },
);

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<string>();
  const { data, isLoading, error } = useProperties(filters);

  const handlePropertyClick = (propertyId: string) => {
    setHighlightedPropertyId(propertyId);
    // Auto-switch to map view when property is clicked
    setViewMode("map");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Browse Properties</h1>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              List View
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Map View
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PropertyFilters
              onFilterChange={setFilters}
              initialFilters={filters}
            />
          </div>

          {/* Property Grid or Map */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600">
                  Error loading properties. Please try again.
                </p>
              </div>
            ) : data?.properties && data.properties.length > 0 ? (
              <>
                <div className="mb-4 text-gray-600">
                  Found {data.total}{" "}
                  {data.total === 1 ? "property" : "properties"}
                </div>

                {/* Conditional View Rendering */}
                {viewMode === "map" ? (
                  <PropertyMap
                    properties={data.properties}
                    height="calc(100vh - 300px)"
                    highlightedPropertyId={highlightedPropertyId}
                    onPropertyClick={(id) => setHighlightedPropertyId(id)}
                  />
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.properties.map((property) => (
                      <div
                        key={property._id}
                        onClick={() => handlePropertyClick(property._id)}
                        className="cursor-pointer"
                      >
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">
                  No properties found matching your criteria.
                </p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
