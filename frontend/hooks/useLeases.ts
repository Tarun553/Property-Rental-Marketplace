import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Lease, CreateLeaseData, SignLeaseData } from "@/types/lease";

export const usePropertyLeases = (propertyId: string) => {
  return useQuery({
    queryKey: ["leases", "property", propertyId],
    queryFn: async () => {
      const { data } = await api.get<Lease[]>(`/leases/property/${propertyId}`);
      return data;
    },
    enabled: !!propertyId,
  });
};

export const useLease = (leaseId: string) => {
  return useQuery({
    queryKey: ["lease", leaseId],
    queryFn: async () => {
      const { data } = await api.get<Lease>(`/leases/${leaseId}`);
      return data;
    },
    enabled: !!leaseId,
  });
};

export const useCreateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leaseData: CreateLeaseData) => {
      const { data } = await api.post<Lease>("/leases", leaseData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
};

export const useSignLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      leaseId,
      signatureData,
    }: {
      leaseId: string;
      signatureData: SignLeaseData;
    }) => {
      const { data } = await api.put<Lease>(
        `/leases/${leaseId}/sign`,
        signatureData,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
};

export const useTenantLeases = (tenantId: string) => {
  return useQuery({
    queryKey: ["leases", "tenant", tenantId],
    queryFn: async () => {
      const { data } = await api.get<Lease[]>(`/leases/tenant/${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};
