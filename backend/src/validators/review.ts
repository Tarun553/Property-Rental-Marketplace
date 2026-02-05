import { z } from "zod";
import { UserRole } from "../types/index.js";

export const reviewCreateSchema = z.object({
  reviewee: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid reviewee ID"),
  property: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid property ID"),
  lease: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid lease ID")
    .optional(),
  reviewerRole: z.enum([UserRole.LANDLORD, UserRole.TENANT]),
  rating: z.number().min(1).max(5),
  criteria: z
    .object({
      communication: z.number().min(1).max(5).optional(),
      cleanliness: z.number().min(1).max(5).optional(),
      respectfulness: z.number().min(1).max(5).optional(),
      responsiveness: z.number().min(1).max(5).optional(),
      propertyCondition: z.number().min(1).max(5).optional(),
      paymentTimeliness: z.number().min(1).max(5).optional(),
      propertyMaintenance: z.number().min(1).max(5).optional(),
    })
    .optional(),
  comment: z.string().min(1).max(500).optional(),
});

export const reviewResponseSchema = z.object({
  response: z.string().min(1).max(500),
});
