"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateLease } from "@/hooks/useLeases";
import { usePropertyApplications } from "@/hooks/useApplications";
import { useProperty } from "@/hooks/useProperties";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, AlertCircle } from "lucide-react";

const leaseSchema = z.object({
  tenant: z.string().min(1, "Tenant is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  monthlyRent: z.string().min(1, "Monthly rent is required"),
  securityDeposit: z.string().min(1, "Security deposit is required"),
  paymentDueDate: z.string().min(1, "Payment due date is required"),
  landlordResponsibilities: z.string().optional(),
  tenantResponsibilities: z.string().optional(),
});

type LeaseFormData = z.infer<typeof leaseSchema>;

interface CreateLeaseDialogProps {
  propertyId: string;
  tenantId?: string;
  onSuccess?: () => void;
}

export function CreateLeaseDialog({
  propertyId,
  tenantId,
  onSuccess,
}: CreateLeaseDialogProps) {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateLease();

  // Fetch approved applications for this property
  const { data: applications, isLoading: applicationsLoading } =
    usePropertyApplications(propertyId);

  // Fetch property details to pre-fill rent amount
  const { data: property } = useProperty(propertyId);

  // Filter only approved applications
  const approvedApplications =
    applications?.filter((app) => app.status === "approved") || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      tenant: tenantId || "",
      paymentDueDate: "1",
      landlordResponsibilities: "Maintenance, Repairs, Property Taxes",
      tenantResponsibilities: "Utilities, Cleaning, Minor Repairs",
    },
  });

  const selectedTenant = watch("tenant");

  // Pre-fill rent and deposit from property when it loads
  useEffect(() => {
    if (property) {
      setValue("monthlyRent", property.pricing.monthlyRent.toString());
      setValue(
        "securityDeposit",
        (property.pricing.securityDeposit || property.pricing.monthlyRent).toString()
      );
    }
  }, [property, setValue]);

  // If tenantId is passed as prop, set it
  useEffect(() => {
    if (tenantId) {
      setValue("tenant", tenantId);
    }
  }, [tenantId, setValue]);

  const onSubmit = async (values: LeaseFormData) => {
    try {
      await createMutation.mutateAsync({
        property: propertyId,
        tenant: values.tenant,
        terms: {
          startDate: values.startDate,
          endDate: values.endDate,
          monthlyRent: Number(values.monthlyRent),
          securityDeposit: Number(values.securityDeposit),
          paymentDueDate: Number(values.paymentDueDate),
        },
        responsibilities: {
          landlord: values.landlordResponsibilities
            ? values.landlordResponsibilities.split(",").map((r) => r.trim())
            : [],
          tenant: values.tenantResponsibilities
            ? values.tenantResponsibilities.split(",").map((r) => r.trim())
            : [],
        },
      });

      toast.success("Lease created successfully!");
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create lease");
    }
  };

  const handleTenantSelect = (tenantId: string) => {
    setValue("tenant", tenantId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Lease
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Lease Agreement</DialogTitle>
          <DialogDescription>
            Fill in the lease details. Both parties will need to sign the lease.
          </DialogDescription>
        </DialogHeader>

        {applicationsLoading ? (
          <div className="p-8 text-center text-gray-600">
            Loading approved applications...
          </div>
        ) : approvedApplications.length === 0 && !tenantId ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg font-medium mb-2">No Approved Applications</h3>
            <p className="text-gray-600 text-sm">
              You need to approve a tenant application before creating a lease.
              Go to the Applications tab to review and approve applications.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Tenant Selection */}
            <div>
              <Label htmlFor="tenant">Select Tenant *</Label>
              {tenantId ? (
                <Input
                  id="tenant"
                  {...register("tenant")}
                  disabled
                  className="bg-gray-100"
                />
              ) : (
                <Select
                  value={selectedTenant}
                  onValueChange={handleTenantSelect}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select an approved tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedApplications.map((application) => {
                      const tenant = application.tenant as any;
                      return (
                        <SelectItem key={tenant._id} value={tenant._id}>
                          {tenant?.profile?.firstName} {tenant?.profile?.lastName}{" "}
                          ({tenant?.email})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
              {errors.tenant && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.tenant.message}
                </p>
              )}
              {!tenantId && approvedApplications.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Only tenants with approved applications are shown
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyRent">Monthly Rent ($) *</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  {...register("monthlyRent")}
                  placeholder="3500"
                />
                {errors.monthlyRent && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.monthlyRent.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="securityDeposit">Security Deposit ($) *</Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  {...register("securityDeposit")}
                  placeholder="3500"
                />
                {errors.securityDeposit && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.securityDeposit.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="paymentDueDate">
                Payment Due Date (day of month) *
              </Label>
              <Input
                id="paymentDueDate"
                type="number"
                min="1"
                max="31"
                {...register("paymentDueDate")}
                placeholder="1"
              />
              {errors.paymentDueDate && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.paymentDueDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="landlordResponsibilities">
                Landlord Responsibilities (comma-separated)
              </Label>
              <Textarea
                id="landlordResponsibilities"
                {...register("landlordResponsibilities")}
                placeholder="Maintenance, Repairs, Property Taxes"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="tenantResponsibilities">
                Tenant Responsibilities (comma-separated)
              </Label>
              <Textarea
                id="tenantResponsibilities"
                {...register("tenantResponsibilities")}
                placeholder="Utilities, Cleaning, Minor Repairs"
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !selectedTenant}
                className="flex-1"
              >
                {createMutation.isPending ? "Creating..." : "Create Lease"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
