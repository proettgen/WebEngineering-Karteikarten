import { Request } from "express";
import { z } from "zod";
import {
  registerBody,
  loginBody,
  checkUsernameBody,
  checkEmailBody,
  userRecordSchema,
  profileResponseSchema,
} from "../validation/authValidation";

// Infer all types from Zod schemas - single source of truth
export type RegisterInput = z.infer<typeof registerBody>;
export type LoginInput = z.infer<typeof loginBody>;
export type UserRecord = z.infer<typeof userRecordSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;

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
export type CheckUsernameRequest = TypedRequest<z.infer<typeof checkUsernameBody>>;
export type CheckEmailRequest = TypedRequest<z.infer<typeof checkEmailBody>>;
export type RegisterRequest = TypedRequest<RegisterInput>;
export type LoginRequest = TypedRequest<LoginInput>;

// Authenticated request with user data
export interface AuthenticatedRequest extends Request {
  user?: ProfileResponse;
}
