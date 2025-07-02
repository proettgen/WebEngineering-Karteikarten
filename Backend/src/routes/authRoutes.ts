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

router.post(
  "/check-username",
  validateBody(checkUsernameBody),
  authController.checkUsername,
);
router.post(
  "/check-email",
  validateBody(checkEmailBody),
  authController.checkEmail,
);
router.post("/register", validateBody(registerBody), authController.register);
router.post("/login", validateBody(loginBody), authController.login);
router.get("/profile", authenticateJWT, authController.profile);

export default router;
