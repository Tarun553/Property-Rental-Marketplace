import { z } from "zod";
import { LeaseStatus } from "../types/index.js";

export const leaseCreateSchema = z.object({
  property: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid property ID"),
  tenant: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid tenant ID"),
  application: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid application ID")
    .optional(),
  terms: z.object({
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    monthlyRent: z.number().positive(),
    securityDeposit: z.number().nonnegative().optional(),
    paymentDueDate: z.number().min(1).max(31),
    lateFeesPolicy: z.string().optional(),
    terminationNotice: z.number().int().positive().optional(),
  }),
  responsibilities: z
    .object({
      landlord: z.array(z.string()).optional(),
      tenant: z.array(z.string()).optional(),
    })
    .optional(),
  additionalClauses: z.string().optional(),
});

export const leaseSignSchema = z.object({
  signatureData: z.string().min(2),
});
