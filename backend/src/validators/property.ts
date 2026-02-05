import { z } from "zod";

export const propertyCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(["apartment", "house", "condo", "commercial", "other"]),
  address: z.object({
    street: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string().optional(),
    country: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  pricing: z.object({
    monthlyRent: z.number().positive(),
    securityDeposit: z.number().nonnegative().optional(),
    utilitiesIncluded: z.boolean().default(false),
  }),
  details: z.object({
    bedrooms: z.number().int().nonnegative(),
    bathrooms: z.number().nonnegative(),
    size: z.number().positive().optional(),
    furnished: z.boolean().default(false),
    petsAllowed: z.boolean().default(false),
    smokingAllowed: z.boolean().default(false),
  }),
  amenities: z.array(z.string()).optional(),
  media: z
    .object({
      photos: z.array(z.string()).optional(),
      virtualTourUrl: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  availability: z
    .object({
      status: z.enum(["available", "rented", "pending"]).default("available"),
      availableFrom: z.string().optional(),
      leaseDuration: z.number().int().positive().optional(),
    })
    .optional(),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();
