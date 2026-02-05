import mongoose from "mongoose";
import { LeaseStatus } from "../types/index.js";

const leaseSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
    terms: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      monthlyRent: { type: Number, required: true },
      securityDeposit: Number,
      paymentDueDate: { type: Number, min: 1, max: 31 },
      lateFeesPolicy: String,
      terminationNotice: Number, // days
    },
    responsibilities: {
      landlord: [String],
      tenant: [String],
    },
    additionalClauses: String,
    status: {
      type: String,
      enum: Object.values(LeaseStatus),
      default: LeaseStatus.DRAFT,
    },
    signatures: {
      landlord: {
        signed: { type: Boolean, default: false },
        signatureData: String,
        signedAt: Date,
      },
      tenant: {
        signed: { type: Boolean, default: false },
        signatureData: String,
        signedAt: Date,
      },
    },
    documentUrl: String,
  },
  {
    timestamps: true,
  },
);

leaseSchema.index({ property: 1 });
leaseSchema.index({ landlord: 1 });
leaseSchema.index({ tenant: 1 });
leaseSchema.index({ status: 1 });

const Lease = mongoose.model("Lease", leaseSchema);

export default Lease;
