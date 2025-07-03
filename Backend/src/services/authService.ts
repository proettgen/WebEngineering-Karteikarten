import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RegisterInput, LoginInput, AuthResponse, UserRecord } from "../types/authTypes";
import { AppError } from "../utils/AppError";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SALT_ROUNDS = 12;

// validation for JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1h";

// Check availability
export const isUsernameAvailable = async (
  username: string,
): Promise<boolean> => {
  try {
    const { rowCount } = await pool.query(
      "SELECT 1 FROM users WHERE username = $1",
      [username],
    );
    return rowCount === 0;
  } catch (error) {
    console.error("Database error checking username availability:", error);
    throw new AppError("Database error while checking username availability", 500);
  }
};

export const isEmailAvailable = async (email: string): Promise<boolean> => {
  if (!email) return true;
  try {
    const { rowCount } = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email],
    );
    return rowCount === 0;
  } catch (error) {
    console.error("Database error checking Email availability:", error);
    throw new AppError("Database error while checking email availability", 500);
  }
};

// Register new user
export const registerUser = async (input: RegisterInput): Promise<UserRecord> => {
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
    const { rows } = await pool.query<UserRecord>(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
         RETURNING id, username, email, created_at`,
      [input.username, input.email || null, hashed],
    );
    
    if (rows.length === 0) {
      throw new AppError("Failed to create user", 500);
    }
    
    return rows[0];
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
  loginData: LoginInput
): Promise<AuthResponse> => {
  try {
    const { usernameOrEmail, password } = loginData;
    
    const { rows } = await pool.query<UserRecord & { password: string }>(
      `SELECT id, username, email, password FROM users 
       WHERE username = $1 OR email = $1`,
      [usernameOrEmail],
    );
    
    if (rows.length === 0) {
      throw new AppError("Invalid credentials", 401);
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );
    
    return {
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email || undefined 
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
export const getUserProfile = async (userId: string): Promise<UserRecord> => {
  try {
    const { rows } = await pool.query<UserRecord>(
      `SELECT id, username, email, created_at, updated_at 
       FROM users WHERE id = $1`,
      [userId],
    );
    
    if (rows.length === 0) {
      throw new AppError("User not found", 404);
    }
    
    return rows[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Database error while fetching user profile", 500);
  }
};
