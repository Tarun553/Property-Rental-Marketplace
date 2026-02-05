"use client";

import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, DollarSign } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainPhoto = property.media.photos[0] || "/placeholder-property.jpg";

  return (
    <Link href={`/properties/${property._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative h-48 w-full">
          <Image
            src={mainPhoto}
            alt={property.title}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-blue-600">
            {property.availability.status}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">
              {property.address.city}, {property.address.state}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.details.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.details.bathrooms} Baths</span>
            </div>
            {property.details.size && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{property.details.size} sqft</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-blue-600 font-bold text-xl">
              <DollarSign className="h-5 w-5" />
              <span>{property.pricing.monthlyRent.toLocaleString()}</span>
              <span className="text-sm text-gray-500 font-normal">/month</span>
            </div>
            <Badge variant="outline">{property.type}</Badge>
          </div>

          {property.amenities.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {property.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
