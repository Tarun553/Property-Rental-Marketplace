import { Types, Document } from "mongoose";

export enum UserRole {
  LANDLORD = "landlord",
  TENANT = "tenant",
  ADMIN = "admin",
}

export enum PropertyStatus {
  AVAILABLE = "available",
  RENTED = "rented",
  PENDING = "pending",
}

export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWING = "reviewing",
  APPROVED = "approved",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
  CANCELLED = "cancelled",
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

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: UserRole;
  profile: IUserProfile;
  verified: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
}

export interface IProperty extends Document {
  _id: Types.ObjectId;
  landlord: Types.ObjectId | IUser;
  title: string;
  description: string;
  type: string;
  address: ILocation;
  pricing: {
    monthlyRent: number;
    securityDeposit?: number;
    utilitiesIncluded: boolean;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    size?: number;
    furnished: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
  };
  amenities: string[];
  media: {
    photos: string[];
    virtualTourUrl?: string;
  };
  availability: {
    status: PropertyStatus;
    availableFrom?: Date;
    leaseDuration?: number;
  };
  viewingSlots: {
    date: Date;
    timeSlot: string;
    booked: boolean;
  }[];
  stats: {
    views: number;
    applications: number;
    averageRating: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplication extends Document {
  _id: Types.ObjectId;
  property: Types.ObjectId | IProperty;
  tenant: Types.ObjectId | IUser;
  landlord: Types.ObjectId | IUser;
  status: ApplicationStatus;
  personalInfo: {
    fullName: string;
    phone: string;
    currentAddress: string;
    occupation: string;
    monthlyIncome: number;
  };
  references?: {
    name: string;
    relationship: string;
    phone: string;
  }[];
  documents: {
    type: string;
    url: string;
    name: string;
  }[];
  landlordNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}
