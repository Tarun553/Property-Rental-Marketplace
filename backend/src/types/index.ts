import { Types } from "mongoose";

export enum UserRole {
  LANDLORD = "landlord",
  TENANT = "tenant",
}

export enum PropertyStatus {
  AVAILABLE = "available",
  RENTED = "rented",
  PENDING = "pending",
}

export enum ApplicationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export enum LeaseStatus {
  DRAFT = "draft",
  PENDING_SIGNATURES = "pending_signatures",
  ACTIVE = "active",
  EXPIRED = "expired",
  TERMINATED = "terminated",
}

export enum MaintenanceStatus {
  SUBMITTED = "submitted",
  ACKNOWLEDGED = "acknowledged",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum MaintenancePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface IUserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
}

export interface ILocation {
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
