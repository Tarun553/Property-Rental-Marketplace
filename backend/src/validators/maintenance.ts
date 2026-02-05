import { z } from "zod";
import { MaintenanceStatus, MaintenancePriority } from "../types/index.js";

export const maintenanceRequestCreateSchema = z.object({
  property: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid property ID"),
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  category: z.enum([
    "plumbing",
    "electrical",
    "heating",
    "appliance",
    "structural",
    "other",
  ]),
  priority: z
    .enum([
      MaintenancePriority.LOW,
      MaintenancePriority.MEDIUM,
      MaintenancePriority.HIGH,
      MaintenancePriority.URGENT,
    ])
    .optional(),
});

export const maintenanceStatusUpdateSchema = z.object({
  status: z.enum([
    MaintenanceStatus.SUBMITTED,
    MaintenanceStatus.ACKNOWLEDGED,
    MaintenanceStatus.IN_PROGRESS,
    MaintenanceStatus.COMPLETED,
    MaintenanceStatus.CANCELLED,
  ]),
  priority: z
    .enum([
      MaintenancePriority.LOW,
      MaintenancePriority.MEDIUM,
      MaintenancePriority.HIGH,
      MaintenancePriority.URGENT,
    ])
    .optional(),
  landlordResponse: z.string().optional(),
  resolutionNotes: z.string().optional(),
});
