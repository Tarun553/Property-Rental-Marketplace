"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { useProperties } from "@/hooks/useProperties";
import { PropertyFilters as PropertyFiltersType } from "@/types/property";
import { Loader2 } from "lucide-react";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const { data, isLoading, error } = useProperties(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Properties</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PropertyFilters
              onFilterChange={setFilters}
              initialFilters={filters}
            />
          </div>

          {/* Property Grid */}
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
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
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
