import express from "express";
import * as authController from "../controllers/authController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateBody";

import {
  checkUsernameBody,
  checkEmailBody,
  registerBody,
  loginBody,
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
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *       400:
 *         description: Invalid input data or username/email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error during registration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error during login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error retrieving profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/profile", authenticateJWT, authController.profile);

export default router;
