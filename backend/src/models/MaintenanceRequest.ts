import mongoose from "mongoose";
import { MaintenanceStatus, MaintenancePriority } from "../types/index.js";

const maintenanceRequestSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "plumbing",
        "electrical",
        "heating",
        "appliance",
        "structural",
        "other",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(MaintenancePriority),
      default: MaintenancePriority.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(MaintenanceStatus),
      default: MaintenanceStatus.SUBMITTED,
    },
    photos: [String],
    landlordResponse: String,
    resolutionNotes: String,
    timeline: [
      {
        status: String,
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

maintenanceRequestSchema.index({ property: 1 });
maintenanceRequestSchema.index({ tenant: 1 });
maintenanceRequestSchema.index({ landlord: 1 });
maintenanceRequestSchema.index({ status: 1 });
maintenanceRequestSchema.index({ priority: 1 });

const MaintenanceRequest = mongoose.model(
  "MaintenanceRequest",
  maintenanceRequestSchema,
);

export default MaintenanceRequest;
