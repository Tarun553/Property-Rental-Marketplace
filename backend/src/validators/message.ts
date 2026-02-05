import { z } from "zod";

export const messageStartSchema = z.object({
  recipientId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid recipient ID"),
  propertyId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid property ID")
    .optional(),
  message: z.string().optional(),
});
