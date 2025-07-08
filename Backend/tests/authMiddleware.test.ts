import { describe, it, expect, vi, beforeEach, MockInstance } from "vitest";
import { authenticateJWT } from "../src/middleware/authMiddleware";
import * as authService from "../src/services/authService";
import jwt from "jsonwebtoken";
import { AppError } from "../src/utils/AppError";
import type { Response, NextFunction } from "express";
import { AuthenticatedRequest, ProfileResponse } from "../src/types/authTypes";

// Create a properly typed mock user
const mockUser: ProfileResponse = {
  id: "123",
  username: "testuser",
  email: "test@example.com",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Type for our JWT payload
interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

describe("authenticateJWT middleware", () => {
  // Fix: Use MockInstance type from Vitest instead of incorrect Mock generic
  let next: MockInstance;
  let req: Partial<AuthenticatedRequest>;
  const res = {} as Response;

  beforeEach(() => {
    // Create a properly typed request with cookies
    req = { 
      cookies: { authToken: "valid.token" },
      user: undefined
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("calls next with AppError if no token", async () => {
    req.cookies = {};
    await authenticateJWT(
      req as AuthenticatedRequest,
      res,
      next as unknown as NextFunction
    );
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0] as AppError;
    expect(error.message).toMatch(/No valid token/);
  });

  it("calls next with AppError if no cookies", async () => {
    req.cookies = undefined;
    await authenticateJWT(
      req as AuthenticatedRequest,
      res,
      next as unknown as NextFunction
    );
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0] as AppError;
    expect(error.message).toMatch(/No valid token/);
  });

  it("calls next with AppError if jwt is invalid", async () => {
    vi.spyOn(jwt, "verify").mockImplementation(() => {
      throw new jwt.JsonWebTokenError("invalid");
    });
    await authenticateJWT(
      req as AuthenticatedRequest,
      res,
      next as unknown as NextFunction
    );
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0] as AppError;
    expect(error.message).toMatch(/Invalid or expired token/);
  });

  it("calls next with AppError if authService throws", async () => {
    vi.spyOn(jwt, "verify").mockImplementation(() => ({ 
      userId: "123", 
      iat: 1, 
      exp: 2 
    } as JwtPayload));
    
    vi.spyOn(authService, "getUserProfile").mockRejectedValue(new Error("fail"));
    
    await authenticateJWT(
      req as AuthenticatedRequest,
      res,
      next as unknown as NextFunction
    );
    
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0] as AppError;
    expect(error.message).toMatch(/Authentication failed/);
  });

  it("attaches user to req and calls next on success", async () => {
    vi.spyOn(jwt, "verify").mockImplementation(() => ({ 
      userId: "123", 
      iat: 1, 
      exp: 2 
    } as JwtPayload));
    
    vi.spyOn(authService, "getUserProfile").mockResolvedValue(mockUser);
    
    await authenticateJWT(
      req as AuthenticatedRequest,
      res,
      next as unknown as NextFunction
    );
    
    // We know the user property will be defined after the middleware runs
    expect(req.user).toMatchObject({
      id: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
    });
    
    expect(next).toHaveBeenCalledWith();
  });
});