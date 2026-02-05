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
import { Separator } from "@/components/ui/separator";
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
  Heart,
  Share2,
  Calendar,
  Home,
  Sparkles,
  Shield,
  Zap,
  PawPrint,
  Cigarette,
  Sofa,
  ChevronLeft,
  ChevronRight,
  Eye,
  Star,
  Play,
  Building2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Dynamically import PropertyMap to avoid SSR issues
const PropertyMap = dynamic(
  () =>
    import("@/components/property/PropertyMap").then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-muted animate-pulse rounded-2xl" />
    ),
  }
);

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const propertyId = params.id as string;
  const { data: property, isLoading, error } = useProperty(propertyId);
  const { data: existingApplication } = useCheckUserApplication(
    propertyId,
    user?._id || ""
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const nextImage = () => {
    if (property?.media.photos.length) {
      setSelectedImage((prev) => (prev + 1) % property.media.photos.length);
    }
  };

  const prevImage = () => {
    if (property?.media.photos.length) {
      setSelectedImage(
        (prev) =>
          (prev - 1 + property.media.photos.length) % property.media.photos.length
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Home className="absolute inset-0 m-auto h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Home className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The property you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/properties">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Browse Properties
              </Button>
            </Link>
          </div>
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

  const statusColors: Record<string, string> = {
    available: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    rented: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  };

  const featureItems = [
    {
      icon: Sofa,
      label: "Furnished",
      value: property.details.furnished,
    },
    {
      icon: PawPrint,
      label: "Pets Allowed",
      value: property.details.petsAllowed,
    },
    {
      icon: Cigarette,
      label: "Smoking Allowed",
      value: property.details.smokingAllowed,
    },
    {
      icon: Zap,
      label: "Utilities Included",
      value: property.pricing.utilitiesIncluded,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/properties">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isLiked && "fill-rose-500 text-rose-500"
                )}
              />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="relative h-[500px] bg-muted group">
                {property.media.photos.length > 0 ? (
                  <>
                    <Image
                      src={property.media.photos[selectedImage]}
                      alt={property.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Navigation Arrows */}
                    {property.media.photos.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-black/50 text-white border-0 backdrop-blur-sm"
                      >
                        {selectedImage + 1} / {property.media.photos.length}
                      </Badge>
                      {property.stats?.views && property.stats.views > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-black/50 text-white border-0 backdrop-blur-sm"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {property.stats.views} views
                        </Badge>
                      )}
                    </div>

                    {/* Status Badge */}
                    <Badge
                      className={cn(
                        "absolute top-4 right-4 border backdrop-blur-sm font-medium",
                        statusColors[property.availability.status]
                      )}
                    >
                      {property.availability.status === "available" && (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      {property.availability.status.charAt(0).toUpperCase() +
                        property.availability.status.slice(1)}
                    </Badge>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Home className="h-16 w-16 mb-4 opacity-50" />
                    <p>No images available</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {property.media.photos.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto bg-muted/30">
                  {property.media.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative h-20 w-24 shrink-0 rounded-lg overflow-hidden transition-all",
                        selectedImage === index
                          ? "ring-2 ring-primary ring-offset-2"
                          : "opacity-70 hover:opacity-100"
                      )}
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

            {/* Property Info Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-8">
                {/* Title & Location */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                      {property.title}
                    </h1>
                    {property.stats?.averageRating &&
                      property.stats.averageRating > 0 && (
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-amber-700">
                            {property.stats.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-lg">
                      {property.address.street}, {property.address.city},{" "}
                      {property.address.state} {property.address.zipCode}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 p-5 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Bed className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {property.details.bedrooms}
                      </p>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-14" />
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Bath className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {property.details.bathrooms}
                      </p>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                    </div>
                  </div>
                  {property.details.size && (
                    <>
                      <Separator orientation="vertical" className="h-14" />
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <Square className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {property.details.size.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Sq Ft</p>
                        </div>
                      </div>
                    </>
                  )}
                  <Separator orientation="vertical" className="h-14" />
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold capitalize">
                        {property.type}
                      </p>
                      <p className="text-sm text-muted-foreground">Type</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    About This Property
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>

                {/* Property Features */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Property Features
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {featureItems.map((feature) => (
                      <div
                        key={feature.label}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border transition-colors",
                          feature.value
                            ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20"
                            : "bg-muted/50 border-transparent"
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            feature.value
                              ? "bg-emerald-100 dark:bg-emerald-500/20"
                              : "bg-muted"
                          )}
                        >
                          <feature.icon
                            className={cn(
                              "h-5 w-5",
                              feature.value
                                ? "text-emerald-600"
                                : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{feature.label}</p>
                        </div>
                        {feature.value ? (
                          <Check className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Amenities
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="secondary"
                          className="px-4 py-2 text-sm font-normal bg-muted hover:bg-muted/80"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Map */}
                {property.address?.coordinates && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Location
                    </h2>
                    <div className="rounded-xl overflow-hidden border">
                      <PropertyMap
                        properties={[property]}
                        height="400px"
                        zoom={15}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-xl">
              <CardContent className="p-6 space-y-6">
                {/* Price */}
                <div className="text-center pb-6 border-b">
                  <p className="text-sm text-muted-foreground mb-1">
                    Monthly Rent
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">
                      ${property.pricing.monthlyRent.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  {property.pricing.utilitiesIncluded && (
                    <Badge
                      variant="secondary"
                      className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Utilities Included
                    </Badge>
                  )}
                </div>

                {/* Quick Info */}
                <div className="space-y-4">
                  {property.pricing.securityDeposit && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Security Deposit</span>
                      </div>
                      <span className="font-semibold">
                        ${property.pricing.securityDeposit.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>Property Type</span>
                    </div>
                    <span className="font-semibold capitalize">
                      {property.type}
                    </span>
                  </div>

                  {property.availability.availableFrom && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Available From</span>
                      </div>
                      <span className="font-semibold">
                        {new Date(
                          property.availability.availableFrom
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {property.availability.leaseDuration && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Lease Duration</span>
                      </div>
                      <span className="font-semibold">
                        {property.availability.leaseDuration} months
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  {canApply ? (
                    <Dialog
                      open={showApplicationForm}
                      onOpenChange={setShowApplicationForm}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/25"
                          size="lg"
                        >
                          <Sparkles className="mr-2 h-5 w-5" />
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            Apply for {property.title}
                          </DialogTitle>
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
                    <div className="space-y-3">
                      <Button
                        className="w-full h-12"
                        size="lg"
                        disabled
                        variant="secondary"
                      >
                        <Check className="mr-2 h-5 w-5" />
                        Already Applied
                      </Button>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            existingApplication?.status === "approved" &&
                              "bg-emerald-50 text-emerald-700 border-emerald-200",
                            existingApplication?.status === "rejected" &&
                              "bg-rose-50 text-rose-700 border-rose-200",
                            existingApplication?.status === "pending" &&
                              "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {existingApplication?.status}
                        </Badge>
                      </div>
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="space-y-3">
                      <Link href="/login" className="block">
                        <Button
                          className="w-full h-12 text-lg font-semibold"
                          size="lg"
                        >
                          Login to Apply
                        </Button>
                      </Link>
                      <p className="text-sm text-muted-foreground text-center">
                        Don&apos;t have an account?{" "}
                        <Link
                          href="/register"
                          className="text-primary font-medium hover:underline"
                        >
                          Sign up
                        </Link>
                      </p>
                    </div>
                  ) : user?.role === "landlord" ? (
                    <Button className="w-full h-12" size="lg" disabled>
                      Landlords Cannot Apply
                    </Button>
                  ) : (
                    <Button className="w-full h-12" size="lg" disabled>
                      Not Available
                    </Button>
                  )}

                  {/* Contact Landlord */}
                  {isAuthenticated && isTenant && (
                    <Button
                      variant="outline"
                      className="w-full h-12"
                      size="lg"
                      onClick={handleContactLandlord}
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Contact Landlord
                    </Button>
                  )}

                  {/* Virtual Tour */}
                  {property.media.virtualTourUrl && (
                    <a
                      href={property.media.virtualTourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full h-12" size="lg">
                        <Play className="mr-2 h-5 w-5" />
                        Virtual Tour
                      </Button>
                    </a>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>Verified Listing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      <span>Secure Payments</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
