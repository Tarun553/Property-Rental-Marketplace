import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Property,
  PropertyFilters,
  PropertyListResponse,
} from "@/types/property";

export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      const { data } = await api.get<Property[]>(
        `/properties?${params.toString()}`,
      );

      // Backend returns array directly, transform to expected structure
      return {
        properties: data,
        total: data.length,
        page: 1,
        pages: 1,
      } as PropertyListResponse;
    },
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data } = await api.get<Property>(`/properties/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useLandlordProperties = (userId: string) => {
  return useQuery({
    queryKey: ["properties", "landlord", userId],
    queryFn: async () => {
      const { data } = await api.get<Property[]>(
        `/properties/landlord/${userId}`,
      );
      return data;
    },
    enabled: !!userId,
  });
};

export interface UpdatePropertyPayload {
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
    photos?: string[]; // Existing photos to keep
    virtualTourUrl?: string;
  };
  availability: {
    status: "available" | "rented" | "pending";
    availableFrom?: string;
    leaseDuration?: number;
  };
}

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propertyId,
      formData,
      newPhotos,
    }: {
      propertyId: string;
      formData: UpdatePropertyPayload;
      newPhotos?: File[];
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

      // Append new photos if any
      if (newPhotos && newPhotos.length > 0) {
        newPhotos.forEach((photo) => {
          submitData.append("photos", photo);
        });
      }

      const { data } = await api.put<Property>(
        `/properties/${propertyId}`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.propertyId] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      await api.delete(`/properties/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};
