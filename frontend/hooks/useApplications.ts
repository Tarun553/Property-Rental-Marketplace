import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Application, ApplicationFormData } from "@/types/application";

export const useSubmitApplication = () => {
  return useMutation({
    mutationFn: async ({
      formData,
      files,
    }: {
      formData: ApplicationFormData;
      files?: File[];
    }) => {
      const submitData = new FormData();

      // Append form fields as JSON strings
      submitData.append("property", formData.property);
      submitData.append("personalInfo", JSON.stringify(formData.personalInfo));
      submitData.append("references", JSON.stringify(formData.references));

      // Append files if any
      if (files && files.length > 0) {
        files.forEach((file) => {
          submitData.append("documents", file);
        });
      }

      const { data } = await api.post<Application>(
        "/applications",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return data;
    },
  });
};

export const useTenantApplications = (userId: string) => {
  return useQuery({
    queryKey: ["applications", "tenant", userId],
    queryFn: async () => {
      const { data } = await api.get<Application[]>(
        `/applications/tenant/${userId}`,
      );
      return data;
    },
    enabled: !!userId,
  });
};

export const usePropertyApplications = (propertyId: string) => {
  return useQuery({
    queryKey: ["applications", "property", propertyId],
    queryFn: async () => {
      const { data } = await api.get<Application[]>(
        `/applications/property/${propertyId}`,
      );
      return data;
    },
    enabled: !!propertyId,
  });
};

export const useLandlordApplications = (userId: string) => {
  return useQuery({
    queryKey: ["applications", "landlord", userId],
    queryFn: async () => {
      const { data } = await api.get<Application[]>(
        `/applications/landlord/${userId}`,
      );
      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
      landlordNotes,
    }: {
      applicationId: string;
      status: string;
      landlordNotes?: string;
    }) => {
      const { data } = await api.put<Application>(
        `/applications/${applicationId}/status`,
        { status, landlordNotes },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useCheckUserApplication = (propertyId: string, userId: string) => {
  return useQuery({
    queryKey: ["applications", "check", propertyId, userId],
    queryFn: async () => {
      // Fetch tenant's applications and check if they applied to this property
      const { data } = await api.get<Application[]>(
        `/applications/tenant/${userId}`,
      );
      return data.find((app) => {
        const propertyIdFromApp =
          typeof app.property === "string"
            ? app.property
            : (app.property as any)?._id;
        return propertyIdFromApp === propertyId;
      });
    },
    enabled: !!propertyId && !!userId,
  });
};
