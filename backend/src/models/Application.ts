import mongoose from "mongoose";
import { ApplicationStatus } from "../types/index.js";

const applicationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
    },
    personalInfo: {
      occupation: String,
      employer: String,
      annualIncome: Number,
      moveInDate: Date,
    },
    documents: [
      {
        type: {
          type: String,
          enum: ["id", "payslip", "employment_letter", "reference", "other"],
          required: true,
        },
        url: { type: String, required: true },
        name: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    references: [
      {
        name: String,
        relationship: String,
        phone: String,
        email: String,
      },
    ],
    additionalInfo: String,
    landlordNotes: String,
  },
  {
    timestamps: true,
  },
);

applicationSchema.index({ property: 1 });
applicationSchema.index({ tenant: 1 });
applicationSchema.index({ landlord: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
