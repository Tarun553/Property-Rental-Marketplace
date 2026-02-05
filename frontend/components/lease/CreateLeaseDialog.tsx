"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateLease } from "@/hooks/useLeases";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      tenant: tenantId || "",
      paymentDueDate: "1",
      landlordResponsibilities: "Maintenance, Repairs, Property Taxes",
      tenantResponsibilities: "Utilities, Cleaning, Minor Repairs",
    },
  });

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="tenant">Tenant ID</Label>
            <Input
              id="tenant"
              {...register("tenant")}
              placeholder="Enter tenant user ID"
            />
            {errors.tenant && (
              <p className="text-sm text-red-600 mt-1">
                {errors.tenant.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
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
              <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
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
              <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
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
              Payment Due Date (day of month)
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
              disabled={createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? "Creating..." : "Create Lease"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
