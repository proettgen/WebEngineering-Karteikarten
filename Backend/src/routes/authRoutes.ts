import express from "express";
import * as authController from "../controllers/authController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateBody";

import {
  checkUsernameBody,
  checkEmailBody,
  registerBody,
  loginBody,
  updateProfileBody,
} from "../validation/authValidation";

const router = express.Router();

/**
 * @swagger
 * /api/auth/check-username:
 *   post:
 *     summary: Check username availability
 *     description: Checks if a username is available for registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: "^[a-zA-Z0-9_]+$"
 *                 description: "Username to check (letters, numbers, underscores only)"
 *                 example: "john_doe123"
 *     responses:
 *       200:
 *         description: Username availability check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   description: "True if username is available, false if taken"
 *                   example: true
 *       400:
 *         description: Invalid username format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   description: "Validation Error"
 *                   example: "Validation failed: Only letters, numbers, underscores allowed"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   description: "Error Message"
 *                   example: "Database error while checking username availability"
 */
router.post(
  "/check-username",
  validateBody(checkUsernameBody),
  authController.checkUsername,
);

/**
 * @swagger
 * /api/auth/check-email:
 *   post:
 *     summary: Check email availability
 *     description: Checks if an email address is available for registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Email address to check"
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Email availability check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   description: "True if email is available, false if taken"
 *                   example: true
 *       400:
 *         description: Invalid email format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   description: "Validation Error"
 *                   example: "Validation failed: email: Invalid email"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   description: "Error Message"
 *                   example: "Database error while checking email availability"
 */
router.post(
  "/check-email",
  validateBody(checkEmailBody),
  authController.checkEmail,
);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with username, optional email, and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: "^[a-zA-Z0-9_]+$"
 *                 description: "Unique username (letters, numbers, underscores only)"
 *                 example: "john_doe123"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Optional email address"
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 100
 *                 description: "User password"
 *                 example: "SecurePassword123!"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     username:
 *                       type: string
 *                       example: "john_doe123"
 *                     email:
 *                       type: string
 *                       format: email
 *                       nullable: true
 *                       example: "john.doe@example.com"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-05-01T10:30:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-05-01T10:30:00.000Z"
 *       400:
 *         description: Invalid input data or username/email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Email already exists"
 *       500:
 *         description: Server error during registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Database error during user registration"
 */
router.post("/register", validateBody(registerBody), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with username/email and password, returns JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usernameOrEmail, password]
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *                 description: "Username or email address"
 *                 example: "john_doe123"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 100
 *                 description: "User password"
 *                 example: "SecurePassword123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: "JWT authentication token"
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     username:
 *                       type: string
 *                       example: "john_doe123"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john.doe@example.com"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Invalid credentials"
 *       400:
 *         description: Invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Validation failed: usernameOrEmail: Required, password: Required"
 *       500:
 *         description: Server error during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Server error during login"
 */
router.post("/login", validateBody(loginBody), authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the authenticated user's profile information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: "User's unique identifier"
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 username:
 *                   type: string
 *                   maxLength: 20
 *                   description: "User's username"
 *                   example: "john_doe123"
 *                 email:
 *                   type: string
 *                   format: email
 *                   maxLength: 255
 *                   description: "User's email address (optional)"
 *                   example: "john.doe@example.com"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: "Account creation timestamp"
 *                   example: "2024-05-01T10:30:00.000Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: "Last profile update timestamp"
 *                   example: "2024-05-15T14:20:00.000Z"
 *       401:
 *         description: Authentication required or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Unauthorized - No valid token provided"
 *       404:
 *         description: User Id not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "User not found"
 *       500:
 *         description: Server error retrieving profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Database error while fetching user profile"
 */
router.get("/profile", authenticateJWT, authController.profile);

/**
 * @swagger
 * /api/auth/delete:
 *   delete:
 *     summary: Delete your own user account
 *     description: Deletes the authenticated user's account
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/delete",
  authenticateJWT,
  authController.deleteMyAccount,
);

/**
 * @swagger
 * /api/auth/update:
 *   patch:
 *     summary: Update your profile (username, email, or password)
 *     description: Change username, email, or password. Requires current password for verification.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 example: "new_username"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "new.email@example.com"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "NewPassword123!"
 *               currentPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "CurrentPassword!"
 *             required: [currentPassword]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error or no changes provided
 *       401:
 *         description: Unauthorized or wrong password
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/update",
  authenticateJWT,
  validateBody(updateProfileBody),
  authController.updateProfile,
);

/**
 * @swagger
 * /api/auth/valid-login:
 *   get:
 *     summary: Check if the current login is valid
 *     description: Validates the current login session using the provided JWT
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Valid login session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: "True if the login is valid, false otherwise"
 *                   example: true
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Invalid or expired token"
 *       500:
 *         description: Server error during validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Server error during login validation"
 */
router.get("/valid-login", authenticateJWT, authController.validLogin);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the authenticated user, invalidating the JWT token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       401:
 *         description: Unauthorized or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Unauthorized - No valid token provided"
 *       500:
 *         description: Server error during logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: "Error Status"
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *                   example: "Server error during logout"
 */
router.post("/logout", authController.logout);

export default router;
