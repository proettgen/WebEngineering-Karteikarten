import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { eq, or } from "drizzle-orm";
import { db } from "../db";
import { users } from "../../drizzle/schema";
import {
  RegisterInput,
  LoginInput,
  AuthResponse,
  ProfileResponse,
  UpdateProfileInputWithId,
} from "../types";
import { AppError } from "../utils/AppError";

dotenv.config();

const SALT_ROUNDS = 12;

// validation for JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1h";

// Check availability
export const isUsernameAvailable = async (
  username: string,
): Promise<boolean> => {
  try {
    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return result.length === 0;
  } catch (error) {
    console.error("Database error checking username availability:", error);
    throw new AppError(
      "Database error while checking username availability",
      500,
    );
  }
};

export const isEmailAvailable = async (email: string): Promise<boolean> => {
  if (!email) return true;
  try {
    const result = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result.length === 0;
  } catch (error) {
    console.error("Database error checking Email availability:", error);
    throw new AppError("Database error while checking email availability", 500);
  }
};

// Register new user
export const registerUser = async (
  input: RegisterInput,
): Promise<ProfileResponse> => {
  try {
    // Check if username already exists
    const usernameAvailable = await isUsernameAvailable(input.username);
    if (!usernameAvailable) {
      throw new AppError("Username already exists", 400);
    }

    // Check if email already exists (if provided)
    if (input.email) {
      const emailAvailable = await isEmailAvailable(input.email);
      if (!emailAvailable) {
        throw new AppError("Email already exists", 400);
      }
    }

    const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
    const result = await db
      .insert(users)
      .values({
        username: input.username,
        email: input.email || null,
        password: hashed,
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        created_at: users.createdAt,
      });

    if (result.length === 0) {
      throw new AppError("Failed to create user", 500);
    }

    return result[0] as ProfileResponse;
  } catch (error) {
    // Re-throw AppError instances, wrap others
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Database error during user registration", 500);
  }
};

// Login user and issue JWT
export const loginUser = async (
  loginData: LoginInput,
): Promise<AuthResponse> => {
  try {
    const { usernameOrEmail, password } = loginData;

    const result = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
      })
      .from(users)
      .where(
        or(
          eq(users.username, usernameOrEmail),
          eq(users.email, usernameOrEmail),
        ),
      )
      .limit(1);

    if (result.length === 0) {
      throw new AppError("Invalid credentials", 401);
    }

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email || undefined,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Server error during login", 500);
  }
};

// Get user profile by ID
export const getUserProfile = async (
  userId: string,
): Promise<ProfileResponse> => {
  try {
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        created_at: users.createdAt,
        updated_at: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) {
      throw new AppError("User not found", 404);
    }

    return result[0] as ProfileResponse;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Database error while fetching user profile", 500);
  }
};

// Delete user by ID
export const deleteUserById = async (userId: string): Promise<void> => {
  try {
    const result = await db.delete(users).where(eq(users.id, userId));
    if (result.rowCount === 0) {
      throw new AppError("User not found", 404);
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Database error while deleting user", 500);
  }
};

export const updateUserProfile = async ({
  userId,
  username,
  email,
  newPassword,
  currentPassword,
}: UpdateProfileInputWithId): Promise<ProfileResponse> => {
  // Fetch user
  const userArr = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      password: users.password,
      created_at: users.createdAt,
      updated_at: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userArr.length === 0) throw new AppError("User not found", 404);
  const user = userArr[0];

  // Verify current password
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new AppError("Current password is incorrect", 401);

  // Check username/email availability if changed
  if (username && username !== user.username) {
    const available = await isUsernameAvailable(username);
    if (!available) throw new AppError("Username already exists", 409);
  }
  if (email && email !== user.email) {
    const available = await isEmailAvailable(email);
    if (!available) throw new AppError("Email already exists", 409);
  }

  // Check if any changes are actually being made
  let changes = 0;
  const updateData: { username?: string; email?: string; password?: string } =
    {};

  if (username && username !== user.username) {
    updateData.username = username;
    changes++;
  }
  if (email !== undefined && email !== user.email) {
    updateData.email = email;
    changes++;
  }
  if (newPassword) {
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      throw new AppError(
        "New password must be different from the current password",
        400,
      );
    }
    updateData.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    changes++;
  }

  if (changes === 0) {
    throw new AppError(
      "No changes provided or values are the same as current",
      400,
    );
  }

  // Update user
  const updatedArr = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      created_at: users.createdAt,
      updated_at: users.updatedAt,
    });

  return updatedArr[0] as ProfileResponse;
};
