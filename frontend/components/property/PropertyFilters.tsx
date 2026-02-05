"use client";

import { useState } from "react";
import { PropertyFilters as PropertyFiltersType } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFiltersType) => void;
  initialFilters?: PropertyFiltersType;
}

export function PropertyFilters({
  onFilterChange,
  initialFilters = {},
}: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyFiltersType>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof PropertyFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Search & Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showAdvanced ? "Hide" : "Show"} Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title or location..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {showAdvanced && (
          <>
            {/* Location Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  placeholder="Enter city"
                  value={filters.city || ""}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  placeholder="Enter state"
                  value={filters.state || ""}
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Price</Label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </div>
              <div>
                <Label>Max Price</Label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bedrooms</Label>
                <Select
                  value={filters.bedrooms?.toString() || ""}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "bedrooms",
                      value ? Number(value) : undefined,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Bathrooms</Label>
                <Select
                  value={filters.bathrooms?.toString() || ""}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "bathrooms",
                      value ? Number(value) : undefined,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <Label>Property Type</Label>
              <Select
                value={filters.type || ""}
                onValueChange={(value) =>
                  handleFilterChange("type", value || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Filters */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pets"
                  checked={filters.petsAllowed || false}
                  onCheckedChange={(checked) =>
                    handleFilterChange(
                      "petsAllowed",
                      checked ? true : undefined,
                    )
                  }
                />
                <Label htmlFor="pets" className="cursor-pointer">
                  Pets Allowed
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="furnished"
                  checked={filters.furnished || false}
                  onCheckedChange={(checked) =>
                    handleFilterChange("furnished", checked ? true : undefined)
                  }
                />
                <Label htmlFor="furnished" className="cursor-pointer">
                  Furnished
                </Label>
              </div>
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full">
              Reset Filters
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
