import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  MaintenanceRequest,
  CreateMaintenanceData,
  UpdateMaintenanceStatusData,
} from "@/types/maintenance";

export const usePropertyMaintenance = (propertyId: string) => {
  return useQuery({
    queryKey: ["maintenance", "property", propertyId],
    queryFn: async () => {
      const { data } = await api.get<MaintenanceRequest[]>(
        `/maintenance/property/${propertyId}`,
      );
      return data;
    },
    enabled: !!propertyId,
  });
};

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      photos,
    }: {
      formData: CreateMaintenanceData;
      photos?: File[];
    }) => {
      const submitData = new FormData();

      submitData.append("property", formData.property);
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("priority", formData.priority);

      if (photos && photos.length > 0) {
        photos.forEach((photo) => {
          submitData.append("photos", photo);
        });
      }

      const { data } = await api.post<MaintenanceRequest>(
        "/maintenance",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
};

export const useUpdateMaintenanceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      maintenanceId,
      statusData,
    }: {
      maintenanceId: string;
      statusData: UpdateMaintenanceStatusData;
    }) => {
      const { data } = await api.put<MaintenanceRequest>(
        `/maintenance/${maintenanceId}/status`,
        statusData,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
};

export const useTenantMaintenance = (tenantId: string) => {
  return useQuery({
    queryKey: ["maintenance", "tenant", tenantId],
    queryFn: async () => {
      const { data } = await api.get<MaintenanceRequest[]>(
        `/maintenance/tenant/${tenantId}`,
      );
      return data;
    },
    enabled: !!tenantId,
  });
};
