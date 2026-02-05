"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "@/types/property";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Fix default icon issue with Next.js
const createCustomIcon = () => {
  return new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Create highlighted (larger, different color) icon
const createHighlightedIcon = () => {
  return new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [35, 55],
    iconAnchor: [17, 55],
    popupAnchor: [1, -45],
    shadowSize: [55, 55],
  });
};

// Component to handle map centering
function MapController({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

interface PropertyMapProps {
  properties: Property[];
  center?: LatLngExpression;
  zoom?: number;
  height?: string;
  onPropertyClick?: (propertyId: string) => void;
  highlightedPropertyId?: string; // NEW: Property to highlight
}

export function PropertyMap({
  properties,
  center,
  zoom = 12,
  height = "600px",
  onPropertyClick,
  highlightedPropertyId,
}: PropertyMapProps) {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(
    center || [40.7128, -74.006], // Default to NYC
  );
  const [mapZoom, setMapZoom] = useState(zoom);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // If a property is highlighted, center on it
    if (highlightedPropertyId) {
      const highlightedProperty = properties.find(
        (p) => p._id === highlightedPropertyId,
      );
      if (highlightedProperty?.address?.coordinates) {
        setMapCenter([
          highlightedProperty.address.coordinates.lat,
          highlightedProperty.address.coordinates.lng,
        ]);
        setMapZoom(15); // Zoom in on highlighted property
        return;
      }
    }

    // Get user's current location from browser if no center provided
    if (!center && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LatLngExpression = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);
          if (!highlightedPropertyId) {
            setMapCenter(location);
          }
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          // Use first property's location if geolocation fails
          if (properties.length > 0 && properties[0].address?.coordinates) {
            setMapCenter([
              properties[0].address.coordinates.lat,
              properties[0].address.coordinates.lng,
            ]);
          }
        },
      );
    } else if (
      properties.length > 0 &&
      properties[0].address?.coordinates &&
      !highlightedPropertyId
    ) {
      // Use first property's location if no center and no geolocation
      setMapCenter([
        properties[0].address.coordinates.lat,
        properties[0].address.coordinates.lng,
      ]);
    }
  }, [center, properties, highlightedPropertyId]);

  // Don't render map until mounted (fixes SSR issues)
  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full bg-gray-100 animate-pulse rounded-lg"
      />
    );
  }

  const customIcon = createCustomIcon();
  const highlightedIcon = createHighlightedIcon();

  return (
    <div className="w-full" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
        className="z-0"
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Property Markers */}
        {properties.map((property) => {
          if (!property.address?.coordinates) return null;

          const position: LatLngExpression = [
            property.address.coordinates.lat,
            property.address.coordinates.lng,
          ];

          const isHighlighted = property._id === highlightedPropertyId;

          return (
            <Marker
              key={property._id}
              position={position}
              icon={isHighlighted ? highlightedIcon : customIcon}
              eventHandlers={{
                click: () => {
                  if (onPropertyClick) {
                    onPropertyClick(property._id);
                  }
                },
              }}
            >
              <Popup maxWidth={300} className="property-popup">
                <Card className="border-0 shadow-none">
                  <div className="space-y-2">
                    {/* Property Image */}
                    {property.media?.photos?.[0] && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <Image
                          src={property.media.photos[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Property Info */}
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {property.address.city}, {property.address.state}
                        </span>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        <span>{property.details?.bedrooms || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-3 w-3" />
                        <span>{property.details?.bathrooms || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-semibold">
                          ${property.pricing?.monthlyRent?.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant={
                        property.availability?.status === "available"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {property.availability?.status || "Available"}
                    </Badge>

                    {/* View Details Button */}
                    <Link href={`/properties/${property._id}`}>
                      <Button size="sm" className="w-full text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Popup>
            </Marker>
          );
        })}

        {/* User Location Marker (if available) */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={
              new Icon({
                iconUrl:
                  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                shadowUrl:
                  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              })
            }
          >
            <Popup>
              <div className="text-sm font-medium">Your Location</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
