import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(20, { message: "Username must be at most 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Only letters, numbers, underscores allowed",
  });

export const emailSchema = z.string().email({ message: "Invalid email" });

export const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(100, { message: "Password must be at most 100 characters" });

// Request body schemas
export const checkUsernameBody = z.object({ username: usernameSchema });
export const checkEmailBody = z.object({ email: emailSchema });

export const registerBody = z.object({
  username: usernameSchema,
  email: emailSchema.optional(),
  password: passwordSchema,
});

export const loginBody = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: passwordSchema,
});

// Response schemas
export const profileResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string().max(20),
  email: z.string().max(255).email().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Database record schema
export const userRecordSchema = z.object({
  id: z.string().uuid(),
  username: z.string().max(20),
  email: z.string().max(255).nullable(),
  password: z.string().max(100),
  created_at: z.date(),
  updated_at: z.date(),
});
