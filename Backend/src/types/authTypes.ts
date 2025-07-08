import { Request } from "express";
import { z } from "zod";
import {
  registerBody,
  loginBody,
  checkUsernameBody,
  checkEmailBody,
  profileResponseSchema,
  updateProfileBody,
} from "../validation/authValidation";

// Infer all types from Zod schemas - single source of truth
export type RegisterInput = z.infer<typeof registerBody>;
export type LoginInput = z.infer<typeof loginBody>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileBody>;
export type UpdateProfileInputWithId = UpdateProfileInput & { userId: string };

// Auth response (for login endpoint)
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
  };
}

// Generic typed request interface
interface TypedRequest<T> extends Request {
  body: T;
}

// Typed request interfaces using generics
export type CheckUsernameRequest = TypedRequest<
  z.infer<typeof checkUsernameBody>
>;
export type CheckEmailRequest = TypedRequest<z.infer<typeof checkEmailBody>>;
export type RegisterRequest = TypedRequest<RegisterInput>;
export type LoginRequest = TypedRequest<LoginInput>;
export interface UpdateProfileRequest extends Request {
  body: UpdateProfileInput;
  user?: ProfileResponse;
}

// Authenticated request with user data
export interface AuthenticatedRequest extends Request {
  user?: ProfileResponse;
}

// Simple User interface for basic operations
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}


