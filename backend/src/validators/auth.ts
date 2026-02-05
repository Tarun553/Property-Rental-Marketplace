import { z } from "zod";
import { UserRole } from "../types/index.js";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole),
  profile: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
