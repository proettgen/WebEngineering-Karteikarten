import { Response, NextFunction, Request } from "express";
import * as authService from "../services/authService";
import { AppError } from "../utils/AppError";
import { profileResponseSchema } from "../validation/authValidation";
import {
  AuthenticatedRequest,
  CheckEmailRequest,
  CheckUsernameRequest,
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
} from "../types";
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

    // First clear any existing auth cookie
    res.clearCookie("authToken", { path: "/" });

    // Set the new auth cookie with the token
    res.cookie("authToken", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Optionally, don't send the token in the body anymore
    res.json({ user: result.user });
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
      created_at: new Date(user.created_at).toISOString(),
      updated_at: new Date(user.updated_at).toISOString(),
    };
    // Validate the response structure
    const validatedResponse = profileResponseSchema.parse(profileResponse);

    res.status(200).json(validatedResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError("Invalid user data structure", 500));
    } else {
      next(error);
    }
  }
};

export const deleteMyAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }
    await authService.deleteUserById(req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: UpdateProfileRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }
    const { username, email, newPassword, currentPassword } = req.body;
    const updatedUser = await authService.updateUserProfile({
      userId: req.user.id,
      username,
      email,
      newPassword,
      currentPassword,
    });
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const validLogin = (
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  res.status(200).json({ validLogin: true });
};

export const logout = (
  _req: Request,
  res: Response,
) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
