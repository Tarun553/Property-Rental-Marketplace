"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface AmenitiesFormProps {
  form: UseFormReturn<any>;
}

const COMMON_AMENITIES = [
  "Parking",
  "Gym",
  "Pool",
  "Laundry",
  "Air Conditioning",
  "Heating",
  "Dishwasher",
  "Balcony",
  "Elevator",
  "Security",
];

export function AmenitiesForm({ form }: AmenitiesFormProps) {
  const [customAmenity, setCustomAmenity] = useState("");
  const amenities = form.watch("amenities") || [];

  const toggleAmenity = (amenity: string) => {
    const current = amenities;
    if (current.includes(amenity)) {
      form.setValue(
        "amenities",
        current.filter((a: string) => a !== amenity),
      );
    } else {
      form.setValue("amenities", [...current, amenity]);
    }
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      form.setValue("amenities", [...amenities, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    form.setValue(
      "amenities",
      amenities.filter((a: string) => a !== amenity),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <FormLabel>Common Amenities</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {COMMON_AMENITIES.map((amenity) => (
              <Badge
                key={amenity}
                variant={amenities.includes(amenity) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleAmenity(amenity)}
              >
                {amenity}
                {amenities.includes(amenity) && <X className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <FormLabel>Add Custom Amenity</FormLabel>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="e.g., Rooftop Access"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCustomAmenity())
              }
            />
            <Button type="button" onClick={addCustomAmenity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {amenities.length > 0 && (
          <div>
            <FormLabel>Selected Amenities</FormLabel>
            <div className="flex flex-wrap gap-2 mt-2">
              {amenities.map((amenity: string) => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="amenities"
          render={() => <FormMessage />}
        />
      </CardContent>
    </Card>
  );
}
