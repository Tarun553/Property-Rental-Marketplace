"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useProperty } from "@/hooks/useProperties";
import { useCheckUserApplication } from "@/hooks/useApplications";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { ApplicationForm } from "@/components/application/ApplicationForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

// Dynamically import PropertyMap to avoid SSR issues
const PropertyMap = dynamic(
  () =>
    import("@/components/property/PropertyMap").then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-lg" />
    ),
  },
);

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const propertyId = params.id as string;
  const { data: property, isLoading, error } = useProperty(propertyId);
  const { data: existingApplication } = useCheckUserApplication(
    propertyId,
    user?._id || "",
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The property you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isTenant = user?.role === "tenant";
  const hasApplied = !!existingApplication;
  const canApply =
    isAuthenticated &&
    isTenant &&
    property.availability.status === "available" &&
    !hasApplied;

  const handleContactLandlord = () => {
    const landlordId =
      typeof property.landlord === "object"
        ? property.landlord._id
        : property.landlord;
    router.push(`/messages?start=${landlordId}&property=${property._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link href="/properties">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
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

            {/* Property Details */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
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
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
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
                    <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Map */}
                {property.address?.coordinates && (
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-3">Location</h2>
                    <PropertyMap
                      properties={[property]}
                      height="400px"
                      zoom={15}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-3xl font-bold text-blue-600 mb-2">
                    <DollarSign className="h-8 w-8" />
                    <span>{property.pricing.monthlyRent.toLocaleString()}</span>
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

                {canApply ? (
                  <Dialog
                    open={showApplicationForm}
                    onOpenChange={setShowApplicationForm}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Apply for {property.title}</DialogTitle>
                        <DialogDescription>
                          Fill out the application form below to apply for this
                          property.
                        </DialogDescription>
                      </DialogHeader>
                      <ApplicationForm
                        propertyId={propertyId}
                        onSuccess={() => {
                          setShowApplicationForm(false);
                          router.push("/dashboard/tenant");
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                ) : hasApplied ? (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      disabled
                      variant="secondary"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Already Applied
                    </Button>
                    <p className="text-sm text-gray-600 text-center">
                      Status:{" "}
                      <span className="font-semibold capitalize">
                        {existingApplication?.status}
                      </span>
                    </p>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="space-y-2">
                    <Link href="/login">
                      <Button className="w-full" size="lg">
                        Login to Apply
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-600 text-center">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/register"
                        className="text-blue-600 hover:underline"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                ) : user?.role === "landlord" ? (
                  <Button className="w-full" size="lg" disabled>
                    Landlords Cannot Apply
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    Not Available
                  </Button>
                )}

                {/* Contact Landlord Button - Always available for tenants */}
                {isAuthenticated && isTenant && (
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={handleContactLandlord}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Landlord
                  </Button>
                )}

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
  );
}
