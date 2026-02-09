"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { useProperties } from "@/hooks/useProperties";
import { PropertyFilters as PropertyFiltersType } from "@/types/property";
import {
  Loader2,
  Map as MapIcon,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Home,
  TrendingUp,
  Sparkles,
  ArrowUpDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Dynamically import PropertyMap to avoid SSR issues with Leaflet
const PropertyMap = dynamic(
  () =>
    import("@/components/property/PropertyMap").then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-muted animate-pulse rounded-2xl" />
    ),
  },
);

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<string>();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data, isLoading, error } = useProperties(filters);

  const handlePropertyClick = (propertyId: string) => {
    setHighlightedPropertyId(propertyId);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== "",
  ).length;

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-linear-to-b from-primary/10 via-background to-background pt-8 pb-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Home className="h-3 w-3 mr-1" />
              {data?.total || 0} Properties Available
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Find Your Perfect
              <span className="text-primary"> Rental Home</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Browse through our curated selection of rental properties. Use
              filters to narrow down your search and find the perfect place.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        {/* Controls Bar */}
        <div className="bg-card/95 rounded-2xl shadow-lg border border-border/50 p-4 mb-6 sticky top-20 z-30 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left Side - Results & Mobile Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile Filter Button */}
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 w-5 p-0 flex items-center justify-center"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-[400px] p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="overflow-y-auto h-[calc(100vh-80px)]">
                    <PropertyFilters
                      onFilterChange={(f) => {
                        setFilters(f);
                        setMobileFiltersOpen(false);
                      }}
                      initialFilters={filters}
                      className="border-0 shadow-none rounded-none"
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Results Count */}
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <span className="font-semibold text-lg">
                      {data?.total || 0}
                    </span>
                    <span className="text-muted-foreground">
                      {data?.total === 1 ? "property" : "properties"} found
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right Side - Sort & View */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-muted/50 border-0">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Newest
                    </span>
                  </SelectItem>
                  <SelectItem value="price-low">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 rotate-180" /> Price: Low
                    </span>
                  </SelectItem>
                  <SelectItem value="price-high">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Price: High
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-muted/50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    viewMode === "grid" && "bg-background shadow-sm",
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    viewMode === "list" && "bg-background shadow-sm",
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    viewMode === "map" && "bg-background shadow-sm",
                  )}
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 pb-12">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <PropertyFilters
              onFilterChange={setFilters}
              initialFilters={filters}
            />
          </div>

          {/* Property Grid/List/Map */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Home className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                </div>
                <p className="mt-4 text-muted-foreground">
                  Loading properties...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-destructive/20">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Error Loading Properties
                </h3>
                <p className="text-muted-foreground">
                  Something went wrong. Please try again later.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : data?.properties && data.properties.length > 0 ? (
              <>
                {/* Map View */}
                {viewMode === "map" && (
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-border/50">
                    <PropertyMap
                      properties={data.properties}
                      height="calc(100vh - 300px)"
                      highlightedPropertyId={highlightedPropertyId}
                      onPropertyClick={(id) => setHighlightedPropertyId(id)}
                    />
                  </div>
                )}

                {/* Grid View */}
                {viewMode === "grid" && (
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

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-4">
                    {data.properties.map((property) => (
                      <div
                        key={property._id}
                        onClick={() => handlePropertyClick(property._id)}
                        className="cursor-pointer"
                      >
                        <PropertyCard property={property} variant="compact" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination placeholder */}
                {data.total > data.properties.length && (
                  <div className="mt-8 flex justify-center">
                    <Button variant="outline" size="lg" className="gap-2">
                      Load More Properties
                      <Badge variant="secondary">
                        {data.total - data.properties.length} more
                      </Badge>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Home className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-xl mb-2">
                  No Properties Found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn&apos;t find any properties matching your criteria.
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setFilters({})}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
