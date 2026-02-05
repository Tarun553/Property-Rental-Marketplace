"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateProperty } from "@/hooks/useCreateProperty";
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

export default function CreatePropertyPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const mutation = useCreateProperty();

  const form = useForm<z.infer<typeof formSchema>>({
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (photos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    try {
      await mutation.mutateAsync({ formData: values, photos });
      toast.success("Property created successfully!");
      router.push("/dashboard/landlord");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create property");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/dashboard/landlord">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create New Property</h1>
            <p className="text-gray-600">
              Fill out the form below to list your property for rent
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
              <PhotoUpload photos={photos} onPhotosChange={setPhotos} />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Property"
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
