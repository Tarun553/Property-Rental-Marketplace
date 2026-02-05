"use client";

import { useState } from "react";
import { useUpdateMaintenanceStatus } from "@/hooks/useMaintenance";
import { MaintenanceStatus, MaintenancePriority } from "@/types/maintenance";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit } from "lucide-react";

interface MaintenanceStatusUpdateProps {
  maintenanceId: string;
  currentStatus: MaintenanceStatus;
  currentPriority: MaintenancePriority;
}

export function MaintenanceStatusUpdate({
  maintenanceId,
  currentStatus,
  currentPriority,
}: MaintenanceStatusUpdateProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<MaintenanceStatus>(currentStatus);
  const [priority, setPriority] =
    useState<MaintenancePriority>(currentPriority);
  const [response, setResponse] = useState("");
  const updateMutation = useUpdateMaintenanceStatus();

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        maintenanceId,
        statusData: {
          status,
          priority,
          landlordResponse: response || undefined,
        },
      });

      toast.success("Maintenance status updated successfully!");
      setOpen(false);
      setResponse("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update maintenance status",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Maintenance Request</DialogTitle>
          <DialogDescription>
            Update the status, priority, and add a response for the tenant.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as MaintenanceStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MaintenanceStatus.SUBMITTED}>
                  Submitted
                </SelectItem>
                <SelectItem value={MaintenanceStatus.ACKNOWLEDGED}>
                  Acknowledged
                </SelectItem>
                <SelectItem value={MaintenanceStatus.IN_PROGRESS}>
                  In Progress
                </SelectItem>
                <SelectItem value={MaintenanceStatus.COMPLETED}>
                  Completed
                </SelectItem>
                <SelectItem value={MaintenanceStatus.CANCELLED}>
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value) =>
                setPriority(value as MaintenancePriority)
              }
            >
              <SelectTrigger>
                <SelectValue />
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
          </div>

          <div>
            <Label htmlFor="response">Response to Tenant</Label>
            <Textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="I will send a plumber tomorrow at 10 AM..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
