"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProperty, useUpdateProperty } from "@/hooks/useProperties";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInfoForm } from "@/components/property/BasicInfoForm";
import { LocationForm } from "@/components/property/LocationForm";
import { PropertyDetailsForm } from "@/components/property/PropertyDetailsForm";
import { PricingForm } from "@/components/property/PricingForm";
import { AmenitiesForm } from "@/components/property/AmenitiesForm";
import { AvailabilityForm } from "@/components/property/AvailabilityForm";
import { PhotoUpload } from "@/components/property/PhotoUpload";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["apartment", "house", "condo", "commercial", "other"]),

  address: z.object({
    street: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),

  pricing: z.object({
    monthlyRent: z.number().positive("Monthly rent must be positive"),
    securityDeposit: z.number().nonnegative().optional(),
    utilitiesIncluded: z.boolean(),
  }),

  details: z.object({
    bedrooms: z.number().int().nonnegative(),
    bathrooms: z.number().nonnegative(),
    size: z.number().positive().optional(),
    furnished: z.boolean(),
    petsAllowed: z.boolean(),
    smokingAllowed: z.boolean(),
  }),

  amenities: z.array(z.string()),

  media: z.object({
    virtualTourUrl: z.string().url().optional().or(z.literal("")),
  }),

  availability: z.object({
    status: z.enum(["available", "rented", "pending"]),
    availableFrom: z.string().optional(),
    leaseDuration: z.number().int().positive().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const { data: property, isLoading: isLoadingProperty } =
    useProperty(propertyId);
  const updateMutation = useUpdateProperty();

  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "apartment",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      pricing: {
        monthlyRent: 0,
        securityDeposit: 0,
        utilitiesIncluded: false,
      },
      details: {
        bedrooms: 0,
        bathrooms: 0,
        size: 0,
        furnished: false,
        petsAllowed: false,
        smokingAllowed: false,
      },
      amenities: [],
      media: {
        virtualTourUrl: "",
      },
      availability: {
        status: "available",
        availableFrom: "",
        leaseDuration: 12,
      },
    },
  });

  // Populate form with existing property data
  useEffect(() => {
    if (property && !isInitialized) {
      form.reset({
        title: property.title,
        description: property.description,
        type: property.type,
        address: {
          street: property.address.street || "",
          city: property.address.city,
          state: property.address.state,
          zipCode: property.address.zipCode || "",
          country: property.address.country,
          coordinates: {
            lat: property.address.coordinates.lat,
            lng: property.address.coordinates.lng,
          },
        },
        pricing: {
          monthlyRent: property.pricing.monthlyRent,
          securityDeposit: property.pricing.securityDeposit || 0,
          utilitiesIncluded: property.pricing.utilitiesIncluded,
        },
        details: {
          bedrooms: property.details.bedrooms,
          bathrooms: property.details.bathrooms,
          size: property.details.size || 0,
          furnished: property.details.furnished,
          petsAllowed: property.details.petsAllowed,
          smokingAllowed: property.details.smokingAllowed,
        },
        amenities: property.amenities,
        media: {
          virtualTourUrl: property.media.virtualTourUrl || "",
        },
        availability: {
          status: property.availability.status,
          availableFrom: property.availability.availableFrom
            ? new Date(property.availability.availableFrom)
                .toISOString()
                .split("T")[0]
            : "",
          leaseDuration: property.availability.leaseDuration || 12,
        },
      });

      // Set existing photos
      setExistingPhotos(property.media.photos || []);
      setIsInitialized(true);
    }
  }, [property, form, isInitialized]);

  const onSubmit = async (values: FormValues) => {
    const totalPhotos = existingPhotos.length + newPhotos.length;

    if (totalPhotos === 0) {
      toast.error("Please have at least one photo");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        propertyId,
        formData: {
          ...values,
          media: {
            ...values.media,
            photos: existingPhotos,
          },
        },
        newPhotos: newPhotos.length > 0 ? newPhotos : undefined,
      });
      toast.success("Property updated successfully!");
      router.push(`/dashboard/landlord/properties/${propertyId}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update property"
      );
    }
  };

  if (isLoadingProperty) {
    return (
      <ProtectedRoute allowedRoles={["landlord"]}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading property...</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!property) {
    return (
      <ProtectedRoute allowedRoles={["landlord"]}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
              <Link href="/dashboard/landlord">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href={`/dashboard/landlord/properties/${propertyId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Property
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Edit Property</h1>
            <p className="text-gray-600">
              Update your property listing details
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BasicInfoForm form={form} />
              <LocationForm form={form} />
              <PropertyDetailsForm form={form} />
              <PricingForm form={form} />
              <AmenitiesForm form={form} />
              <AvailabilityForm form={form} />
              <PhotoUpload
                photos={newPhotos}
                onPhotosChange={setNewPhotos}
                existingPhotos={existingPhotos}
                onExistingPhotosChange={setExistingPhotos}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Property"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
