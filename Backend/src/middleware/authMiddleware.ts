import { Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { AuthenticatedRequest } from "../types/authTypes";
import * as authService from "../services/authService";

type JwtPayload = {
  userId: string;
  iat: number;
  exp: number;
};

export const authenticateJWT: RequestHandler = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError("Unauthorized - No valid token provided", 401));
    return;
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Get fresh user data from database
    const user = await authService.getUserProfile(payload.userId);
    
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email || undefined,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid or expired token", 401));
    } else {
      next(new AppError("Authentication failed", 401));
    }
  }
};
