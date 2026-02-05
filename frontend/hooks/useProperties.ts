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

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propertyId,
      formData,
    }: {
      propertyId: string;
      formData: any;
    }) => {
      const { data } = await api.put<Property>(
        `/properties/${propertyId}`,
        formData,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
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
