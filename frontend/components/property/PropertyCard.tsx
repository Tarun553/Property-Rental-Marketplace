"use client";

import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart,
  Eye,
  Star,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  variant?: "default" | "compact" | "featured";
}

export function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const mainPhoto = property.media.photos[0] || "/placeholder-property.jpg";

  const statusColors: Record<string, string> = {
    available: "bg-emerald-500/90 text-white border-emerald-400",
    rented: "bg-rose-500/90 text-white border-rose-400",
    pending: "bg-amber-500/90 text-white border-amber-400",
  };

  const typeIcons: Record<string, string> = {
    apartment: "Apartment",
    house: "House",
    condo: "Condo",
    commercial: "Commercial",
    other: "Other",
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  if (variant === "compact") {
    return (
      <Link href={`/properties/${property._id}`}>
        <Card className="group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
          <div className="flex gap-4 p-3">
            <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden">
              <Image
                src={imageError ? "/placeholder-property.jpg" : mainPhoto}
                alt={property.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {property.address.city}
              </p>
              <p className="text-primary font-bold mt-1">
                ${property.pricing.monthlyRent.toLocaleString()}/mo
              </p>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/properties/${property._id}`}>
      <Card className={cn(
        "group overflow-hidden border-0 bg-card shadow-md",
        "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
        "transition-all duration-300 h-full",
        variant === "featured" && "ring-2 ring-primary/20"
      )}>
        {/* Image Container */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={imageError ? "/placeholder-property.jpg" : mainPhoto}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImageError(true)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          
          {/* Top Actions */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge className={cn(
              "backdrop-blur-md border font-medium shadow-lg",
              statusColors[property.availability.status] || statusColors.available
            )}>
              {property.availability.status === "available" && (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              {property.availability.status.charAt(0).toUpperCase() + property.availability.status.slice(1)}
            </Badge>
            
            <button
              onClick={handleLikeClick}
              className={cn(
                "p-2 rounded-full backdrop-blur-md transition-all duration-200",
                "hover:scale-110 active:scale-95",
                isLiked 
                  ? "bg-rose-500 text-white" 
                  : "bg-white/80 text-gray-600 hover:bg-white"
              )}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="flex items-center gap-2">
              {property.stats?.views && property.stats.views > 0 && (
                <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                  <Eye className="h-3 w-3 mr-1" />
                  {property.stats.views}
                </Badge>
              )}
              {property.stats?.averageRating && property.stats.averageRating > 0 && (
                <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {property.stats.averageRating.toFixed(1)}
                </Badge>
              )}
            </div>
            {property.media.photos.length > 1 && (
              <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                +{property.media.photos.length - 1} photos
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5">
          {/* Title & Location */}
          <div className="mb-4">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-200">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-1.5">
              <MapPin className="h-4 w-4 text-primary/70" />
              <span className="text-sm line-clamp-1">
                {property.address.city}, {property.address.state}
              </span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Bed className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-medium text-foreground">{property.details.bedrooms}</span>
              <span className="text-xs">Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Bath className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-medium text-foreground">{property.details.bathrooms}</span>
              <span className="text-xs">Baths</span>
            </div>
            {property.details.size && (
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Square className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{property.details.size}</span>
                <span className="text-xs">sqft</span>
              </div>
            )}
          </div>

          {/* Price & Type */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                ${property.pricing.monthlyRent.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              {property.pricing.utilitiesIncluded && (
                <p className="text-xs text-emerald-600 font-medium mt-0.5">
                  Utilities included
                </p>
              )}
            </div>
            <Badge variant="outline" className="font-medium bg-secondary/50">
              {typeIcons[property.type] || property.type}
            </Badge>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex gap-1.5 flex-wrap">
                {property.amenities.slice(0, 3).map((amenity) => (
                  <Badge 
                    key={amenity} 
                    variant="secondary" 
                    className="text-xs font-normal bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 3 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs font-normal bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    +{property.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
