"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMaintenance } from "@/hooks/useMaintenance";
import { MaintenanceCategory, MaintenancePriority } from "@/types/maintenance";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

const maintenanceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.nativeEnum(MaintenanceCategory),
  priority: z.nativeEnum(MaintenancePriority),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface MaintenanceRequestFormProps {
  propertyId: string;
  onSuccess?: () => void;
}

export function MaintenanceRequestForm({
  propertyId,
  onSuccess,
}: MaintenanceRequestFormProps) {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const createMutation = useCreateMaintenance();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      priority: MaintenancePriority.MEDIUM,
      category: MaintenanceCategory.OTHER,
    },
  });

  const category = watch("category");
  const priority = watch("priority");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: MaintenanceFormData) => {
    try {
      await createMutation.mutateAsync({
        formData: {
          property: propertyId,
          title: values.title,
          description: values.description,
          category: values.category,
          priority: values.priority,
        },
        photos,
      });

      toast.success("Maintenance request submitted successfully!");
      setOpen(false);
      reset();
      setPhotos([]);
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit maintenance request",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Submit Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Maintenance Request</DialogTitle>
          <DialogDescription>
            Describe the issue and we'll get it resolved as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Leaking Kitchen Faucet"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Please provide detailed information about the issue..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setValue("category", value as MaintenanceCategory)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MaintenanceCategory.PLUMBING}>
                    Plumbing
                  </SelectItem>
                  <SelectItem value={MaintenanceCategory.ELECTRICAL}>
                    Electrical
                  </SelectItem>
                  <SelectItem value={MaintenanceCategory.HVAC}>HVAC</SelectItem>
                  <SelectItem value={MaintenanceCategory.APPLIANCE}>
                    Appliance
                  </SelectItem>
                  <SelectItem value={MaintenanceCategory.STRUCTURAL}>
                    Structural
                  </SelectItem>
                  <SelectItem value={MaintenanceCategory.PEST_CONTROL}>
                    Pest Control
                  </SelectItem>
                  <SelectItem value={MaintenanceCategory.OTHER}>
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setValue("priority", value as MaintenancePriority)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MaintenancePriority.LOW}>Low</SelectItem>
                  <SelectItem value={MaintenancePriority.MEDIUM}>
                    Medium
                  </SelectItem>
                  <SelectItem value={MaintenancePriority.HIGH}>High</SelectItem>
                  <SelectItem value={MaintenancePriority.URGENT}>
                    Urgent
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="photos">Photos (optional)</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="cursor-pointer"
            />
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              {createMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
