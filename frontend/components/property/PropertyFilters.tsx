"use client";

import { useState } from "react";
import { PropertyFilters as PropertyFiltersType } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  DollarSign,
  Home,
  Bed,
  PawPrint,
  Sofa,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFiltersType) => void;
  initialFilters?: PropertyFiltersType;
  className?: string;
}

interface FilterSectionProps {
  title: string;
  icon: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection = ({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
}: FilterSectionProps) => (
  <div className="border-b border-border/50 last:border-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-3 text-left hover:bg-muted/50 transition-colors rounded-lg px-2 -mx-2"
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium text-sm">{title}</span>
      </div>
      {isExpanded ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
    <div
      className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-96 pb-4" : "max-h-0",
      )}
    >
      {children}
    </div>
  </div>
);

export function PropertyFilters({
  onFilterChange,
  initialFilters = {},
  className,
}: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyFiltersType>(initialFilters);
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    price: true,
    details: true,
    type: false,
    amenities: false,
  });

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== "",
  ).length;

  const handleFilterChange = (
    key: keyof PropertyFiltersType,
    value: PropertyFiltersType[keyof PropertyFiltersType],
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Card
      className={cn(
        "border-0 shadow-lg bg-card/80 backdrop-blur-sm sticky top-24",
        className,
      )}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Filters</h2>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {activeFiltersCount} active
                </p>
              )}
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-primary/20 focus-visible:ring-2"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-border/50">
            {filters.city && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {filters.city}
                <button
                  onClick={() => handleFilterChange("city", undefined)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.type && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {filters.type}
                <button
                  onClick={() => handleFilterChange("type", undefined)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="gap-1 pr-1">
                ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
                <button
                  onClick={() => {
                    handleFilterChange("minPrice", undefined);
                    handleFilterChange("maxPrice", undefined);
                  }}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.bedrooms && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {filters.bedrooms}+ Beds
                <button
                  onClick={() => handleFilterChange("bedrooms", undefined)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.petsAllowed && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Pets OK
                <button
                  onClick={() => handleFilterChange("petsAllowed", undefined)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.furnished && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Furnished
                <button
                  onClick={() => handleFilterChange("furnished", undefined)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Filter Sections */}
        <div className="space-y-1">
          {/* Location Section */}
          <FilterSection
            title="Location"
            icon={MapPin}
            isExpanded={expandedSections.location}
            onToggle={() => toggleSection("location")}
          >
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  City
                </Label>
                <Input
                  placeholder="Enter city"
                  value={filters.city || ""}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="bg-muted/50 border-0"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  State
                </Label>
                <Input
                  placeholder="Enter state"
                  value={filters.state || ""}
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                  className="bg-muted/50 border-0"
                />
              </div>
            </div>
          </FilterSection>

          {/* Price Section */}
          <FilterSection
            title="Price Range"
            icon={DollarSign}
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection("price")}
          >
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Min
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "minPrice",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="pl-9 bg-muted/50 border-0"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Max
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Any"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxPrice",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="pl-9 bg-muted/50 border-0"
                  />
                </div>
              </div>
            </div>
            {/* Quick Price Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[1000, 2000, 3000, 5000].map((price) => (
                <Button
                  key={price}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs h-7",
                    filters.maxPrice === price &&
                      "bg-primary text-primary-foreground",
                  )}
                  onClick={() => handleFilterChange("maxPrice", price)}
                >
                  Under ${price.toLocaleString()}
                </Button>
              ))}
            </div>
          </FilterSection>

          {/* Details Section */}
          <FilterSection
            title="Bedrooms & Baths"
            icon={Bed}
            isExpanded={expandedSections.details}
            onToggle={() => toggleSection("details")}
          >
            <div className="space-y-4 pt-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Bedrooms
                </Label>
                <div className="flex gap-2">
                  {["any", "1", "2", "3", "4+"].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1 h-9",
                        (value === "any" && !filters.bedrooms) ||
                          filters.bedrooms?.toString() ===
                            value.replace("+", "")
                          ? "bg-primary text-primary-foreground border-primary"
                          : "",
                      )}
                      onClick={() =>
                        handleFilterChange(
                          "bedrooms",
                          value === "any"
                            ? undefined
                            : Number(value.replace("+", "")),
                        )
                      }
                    >
                      {value === "any" ? "Any" : value}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Bathrooms
                </Label>
                <div className="flex gap-2">
                  {["any", "1", "2", "3+"].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1 h-9",
                        (value === "any" && !filters.bathrooms) ||
                          filters.bathrooms?.toString() ===
                            value.replace("+", "")
                          ? "bg-primary text-primary-foreground border-primary"
                          : "",
                      )}
                      onClick={() =>
                        handleFilterChange(
                          "bathrooms",
                          value === "any"
                            ? undefined
                            : Number(value.replace("+", "")),
                        )
                      }
                    >
                      {value === "any" ? "Any" : value}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Property Type Section */}
          <FilterSection
            title="Property Type"
            icon={Home}
            isExpanded={expandedSections.type}
            onToggle={() => toggleSection("type")}
          >
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { value: "apartment", label: "Apartment" },
                { value: "house", label: "House" },
                { value: "condo", label: "Condo" },
                { value: "commercial", label: "Commercial" },
              ].map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start h-10",
                    filters.type === type.value &&
                      "bg-primary text-primary-foreground border-primary",
                  )}
                  onClick={() =>
                    handleFilterChange(
                      "type",
                      filters.type === type.value ? undefined : type.value,
                    )
                  }
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </FilterSection>

          {/* Amenities Section */}
          <FilterSection
            title="Amenities"
            icon={Sparkles}
            isExpanded={expandedSections.amenities}
            onToggle={() => toggleSection("amenities")}
          >
            <div className="space-y-3 pt-2">
              <div
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                  filters.petsAllowed ? "bg-primary/10" : "hover:bg-muted/50",
                )}
                onClick={() =>
                  handleFilterChange(
                    "petsAllowed",
                    filters.petsAllowed ? undefined : true,
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      filters.petsAllowed ? "bg-primary/20" : "bg-muted",
                    )}
                  >
                    <PawPrint
                      className={cn(
                        "h-4 w-4",
                        filters.petsAllowed
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Pets Allowed</p>
                    <p className="text-xs text-muted-foreground">
                      Dog & cat friendly
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={filters.petsAllowed || false}
                  className="pointer-events-none"
                />
              </div>

              <div
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                  filters.furnished ? "bg-primary/10" : "hover:bg-muted/50",
                )}
                onClick={() =>
                  handleFilterChange(
                    "furnished",
                    filters.furnished ? undefined : true,
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      filters.furnished ? "bg-primary/20" : "bg-muted",
                    )}
                  >
                    <Sofa
                      className={cn(
                        "h-4 w-4",
                        filters.furnished
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Furnished</p>
                    <p className="text-xs text-muted-foreground">
                      Move-in ready
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={filters.furnished || false}
                  className="pointer-events-none"
                />
              </div>
            </div>
          </FilterSection>
        </div>

        {/* Apply Button (Mobile) */}
        <div className="mt-6 lg:hidden">
          <Button className="w-full" size="lg">
            Apply Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-white/20">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
