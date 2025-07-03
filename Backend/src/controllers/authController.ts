import { Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { AppError } from "../utils/AppError";
import { profileResponseSchema } from "../validation/authValidation";
import { AuthenticatedRequest, CheckEmailRequest, CheckUsernameRequest, RegisterRequest, LoginRequest } from "../types/authTypes";
import { z } from "zod";

export const checkUsername = async (
  req: CheckUsernameRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.body;
    const available = await authService.isUsernameAvailable(username);
    res.json({ available });
  } catch (error) {
    next(error);
  }
};

export const checkEmail = async (
  req: CheckEmailRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const available = await authService.isEmailAvailable(email);
    res.json({ available });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: RegisterRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body;
    const user = await authService.registerUser({ username, email, password });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: LoginRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const result = await authService.loginUser({ usernameOrEmail, password });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const profile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      next(new AppError("User not authenticated", 401));
      return;
    }

    const user = await authService.getUserProfile(req.user.id);
    
    const profileResponse = {
      id: user.id,
      username: user.username,
      email: user.email || undefined,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
    
    // Validate the response structure
    const validatedResponse = profileResponseSchema.parse(profileResponse);

    res.json(validatedResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError("Invalid user data structure", 500));
    } else {
      next(error);
    }
  }
};
