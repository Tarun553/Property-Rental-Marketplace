import { Property } from "./property";

export interface User {
  _id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export enum MaintenanceCategory {
  PLUMBING = "plumbing",
  ELECTRICAL = "electrical",
  HVAC = "hvac",
  APPLIANCE = "appliance",
  STRUCTURAL = "structural",
  PEST_CONTROL = "pest_control",
  OTHER = "other",
}

export enum MaintenancePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum MaintenanceStatus {
  SUBMITTED = "submitted",
  ACKNOWLEDGED = "acknowledged",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface MaintenanceRequest {
  _id: string;
  property: string | Property; // Property ID or populated property
  tenant: string | User; // User ID or populated user
  title: string;

  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  photos: string[];
  landlordResponse?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaintenanceData {
  property: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
}

export interface UpdateMaintenanceStatusData {
  status: MaintenanceStatus;
  landlordResponse?: string;
  priority?: MaintenancePriority;
}
