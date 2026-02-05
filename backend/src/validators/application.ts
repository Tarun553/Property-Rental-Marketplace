import { z } from "zod";
import { ApplicationStatus } from "../types/index.js";

export const applicationSubmitSchema = z.object({
  property: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid property ID"),
  personalInfo: z.object({
    occupation: z.string().min(2),
    employer: z.string().min(2),
    annualIncome: z.number().positive(),
    moveInDate: z.string().or(z.date()),
  }),
  references: z
    .array(
      z.object({
        name: z.string().min(2),
        relationship: z.string().min(2),
        phone: z.string().min(10),
        email: z.string().email(),
      }),
    )
    .optional(),
  additionalInfo: z.string().optional(),
});

export const applicationStatusUpdateSchema = z.object({
  status: z.enum([
    ApplicationStatus.PENDING,
    ApplicationStatus.REVIEWING,
    ApplicationStatus.APPROVED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
    ApplicationStatus.CANCELLED,
  ]),
  landlordNotes: z.string().optional(),
});
