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
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(100, { message: "Password cannot exceed 100 characters." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one symbol." });

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

export const updateProfileBody = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  newPassword: passwordSchema.optional(),
  currentPassword: passwordSchema,
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

export const jwtPayloadSchema = z.object({
  userId: z.string(),
  iat: z.number(),
  exp: z.number(),
});
