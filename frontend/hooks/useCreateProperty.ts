import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Property } from "@/types/property";

export interface PropertyFormData {
  title: string;
  description: string;
  type: "apartment" | "house" | "condo" | "commercial" | "other";
  address: {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    monthlyRent: number;
    securityDeposit?: number;
    utilitiesIncluded: boolean;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    size?: number;
    furnished: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
  };
  amenities: string[];
  media: {
    virtualTourUrl?: string;
  };
  availability: {
    status: "available" | "rented" | "pending";
    availableFrom?: string;
    leaseDuration?: number;
  };
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      photos,
    }: {
      formData: PropertyFormData;
      photos: File[];
    }) => {
      const submitData = new FormData();

      // Append basic fields
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("type", formData.type);

      // Append complex fields as JSON strings
      submitData.append("address", JSON.stringify(formData.address));
      submitData.append("pricing", JSON.stringify(formData.pricing));
      submitData.append("details", JSON.stringify(formData.details));
      submitData.append("amenities", JSON.stringify(formData.amenities));
      submitData.append("media", JSON.stringify(formData.media));
      submitData.append("availability", JSON.stringify(formData.availability));

      // Append photos
      photos.forEach((photo) => {
        submitData.append("photos", photo);
      });

      const { data } = await api.post<Property>("/properties", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};
