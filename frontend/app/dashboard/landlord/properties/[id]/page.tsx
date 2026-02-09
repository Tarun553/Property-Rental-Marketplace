"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useProperty } from "@/hooks/useProperties";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyApplications } from "@/components/property/PropertyApplications";
import { CreateLeaseDialog } from "@/components/lease/CreateLeaseDialog";
import { LeaseCard } from "@/components/lease/LeaseCard";
import { MaintenanceCard } from "@/components/maintenance/MaintenanceCard";
import { MaintenanceStatusUpdate } from "@/components/maintenance/MaintenanceStatusUpdate";
import { usePropertyLeases } from "@/hooks/useLeases";
import { usePropertyMaintenance } from "@/hooks/useMaintenance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Check,
  X,
  Loader2,
  ArrowLeft,
  Edit,
} from "lucide-react";
import Link from "next/link";

// Leases Tab Component
function LeasesTab({ propertyId }: { propertyId: string }) {
  const { data: leases, isLoading } = usePropertyLeases(propertyId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Property Leases</h2>
        <CreateLeaseDialog propertyId={propertyId} />
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          </CardContent>
        </Card>
      ) : leases && leases.length > 0 ? (
        <div className="grid gap-4">
          {leases.map((lease) => (
            <LeaseCard key={lease._id} lease={lease} userRole="landlord" />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 mb-4">No leases created yet.</p>
            <CreateLeaseDialog propertyId={propertyId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Maintenance Tab Component
function MaintenanceTab({ propertyId }: { propertyId: string }) {
  const { data: requests, isLoading } = usePropertyMaintenance(propertyId);
  console.log(requests);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Maintenance Requests</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          </CardContent>
        </Card>
      ) : requests && requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div key={request._id}>
              <MaintenanceCard request={request} userRole="landlord" />
              <div className="mt-2 flex justify-end">
                <MaintenanceStatusUpdate
                  maintenanceId={request._id}
                  currentStatus={request.status}
                  currentPriority={request.priority}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">No maintenance requests yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function LandlordPropertyDetailPage() {
  const params = useParams();
 
  const propertyId = params.id as string;
  const { data: property, isLoading, error } = useProperty(propertyId);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["landlord"]}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !property) {
    return (
      <ProtectedRoute allowedRoles={["landlord"]}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Property Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The property you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/dashboard/landlord">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <Link href="/dashboard/landlord">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card className="overflow-hidden">
                <div className="relative h-96 bg-gray-200">
                  {property.media.photos.length > 0 ? (
                    <Image
                      src={property.media.photos[selectedImage]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No images available
                    </div>
                  )}
                  <Badge className="absolute top-4 right-4 bg-blue-600">
                    {property.availability.status}
                  </Badge>
                </div>

                {property.media.photos.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {property.media.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 w-20 shrink-0 rounded overflow-hidden border-2 ${
                          selectedImage === index
                            ? "border-blue-600"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              {/* Tabs for Details, Applications, Leases, and Maintenance */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="leases">Leases</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  {/* Property Details */}
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">
                          {property.title}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-5 w-5" />
                          <span>
                            {property.address.street}, {property.address.city},{" "}
                            {property.address.state} {property.address.zipCode}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-lg">
                        <div className="flex items-center gap-2">
                          <Bed className="h-5 w-5 text-gray-600" />
                          <span>{property.details.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="h-5 w-5 text-gray-600" />
                          <span>{property.details.bathrooms} Baths</span>
                        </div>
                        {property.details.size && (
                          <div className="flex items-center gap-2">
                            <Square className="h-5 w-5 text-gray-600" />
                            <span>{property.details.size} sqft</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-3">
                          Description
                        </h2>
                        <p className="text-gray-700 whitespace-pre-line">
                          {property.description}
                        </p>
                      </div>

                      <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-3">
                          Property Features
                        </h2>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            {property.details.furnished ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-red-600" />
                            )}
                            <span>Furnished</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {property.details.petsAllowed ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-red-600" />
                            )}
                            <span>Pets Allowed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {property.details.smokingAllowed ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-red-600" />
                            )}
                            <span>Smoking Allowed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {property.pricing.utilitiesIncluded ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-red-600" />
                            )}
                            <span>Utilities Included</span>
                          </div>
                        </div>
                      </div>

                      {property.amenities.length > 0 && (
                        <div className="border-t pt-6">
                          <h2 className="text-xl font-semibold mb-3">
                            Amenities
                          </h2>
                          <div className="flex flex-wrap gap-2">
                            {property.amenities.map((amenity) => (
                              <Badge key={amenity} variant="secondary">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="applications">
                  <PropertyApplications propertyId={propertyId} />
                </TabsContent>

                <TabsContent value="leases" className="space-y-4">
                  <LeasesTab propertyId={propertyId} />
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-4">
                  <MaintenanceTab propertyId={propertyId} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-3xl font-bold text-blue-600 mb-2">
                      <DollarSign className="h-8 w-8" />
                      <span>
                        {property.pricing.monthlyRent.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600">per month</p>
                  </div>

                  {property.pricing.securityDeposit && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600">Security Deposit</p>
                      <p className="text-lg font-semibold">
                        ${property.pricing.securityDeposit.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Property Type</p>
                    <p className="text-lg font-semibold capitalize">
                      {property.type}
                    </p>
                  </div>

                  {property.availability.availableFrom && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600">Available From</p>
                      <p className="text-lg font-semibold">
                        {new Date(
                          property.availability.availableFrom,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <Link href={`/dashboard/landlord/properties/${propertyId}/edit`}>
                    <Button className="w-full" size="lg" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Property
                    </Button>
                  </Link>

                  {property.media.virtualTourUrl && (
                    <a
                      href={property.media.virtualTourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        Virtual Tour
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
