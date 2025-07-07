import { Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { AuthenticatedRequest } from "../types/authTypes";
import * as authService from "../services/authService";
import { jwtPayloadSchema } from "../validation/authValidation";

export const authenticateJWT: RequestHandler = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const token = req.cookies?.authToken;

  if (!token) {
    next(new AppError("Unauthorized - No valid token provided", 401));
    return;
  }

  if (!req.cookies) {
    next(new AppError("Unauthorized - No cookies found", 401));
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const payload = jwtPayloadSchema.parse(decoded); // Throws if invalid

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
