import mongoose from "mongoose";
import { UserRole } from "../types/index.js";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    lease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lease",
    },
    reviewerRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    criteria: {
      communication: { type: Number, min: 1, max: 5 },
      cleanliness: { type: Number, min: 1, max: 5 },
      respectfulness: { type: Number, min: 1, max: 5 },
      responsiveness: { type: Number, min: 1, max: 5 },
      propertyCondition: { type: Number, min: 1, max: 5 },
      paymentTimeliness: { type: Number, min: 1, max: 5 },
      propertyMaintenance: { type: Number, min: 1, max: 5 },
    },
    comment: String,
    response: String,
    helpful: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ property: 1 });
reviewSchema.index({ reviewerRole: 1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
