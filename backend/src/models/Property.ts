import mongoose from "mongoose";
import { PropertyStatus } from "../types/index.js";

const propertySchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["apartment", "house", "condo", "commercial", "other"],
      required: true,
    },
    address: {
      street: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: String,
      country: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    pricing: {
      monthlyRent: { type: Number, required: true },
      securityDeposit: Number,
      utilitiesIncluded: { type: Boolean, default: false },
    },
    details: {
      bedrooms: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
      size: Number,
      furnished: { type: Boolean, default: false },
      petsAllowed: { type: Boolean, default: false },
      smokingAllowed: { type: Boolean, default: false },
    },
    amenities: [String],
    media: {
      photos: [String],
      virtualTourUrl: String,
    },
    availability: {
      status: {
        type: String,
        enum: Object.values(PropertyStatus),
        default: PropertyStatus.AVAILABLE,
      },
      availableFrom: Date,
      leaseDuration: Number,
    },
    viewingSlots: [
      {
        date: Date,
        timeSlot: String,
        booked: { type: Boolean, default: false },
      },
    ],
    stats: {
      views: { type: Number, default: 0 },
      applications: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

propertySchema.index({ landlord: 1 });
propertySchema.index({ "address.city": 1 });
propertySchema.index({ "pricing.monthlyRent": 1 });
propertySchema.index({ "availability.status": 1 });
propertySchema.index({ "address.coordinates": "2dsphere" });

const Property = mongoose.model("Property", propertySchema);

export default Property;
