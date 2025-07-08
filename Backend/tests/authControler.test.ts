import { describe, it, expect, vi, beforeEach } from "vitest";
import { Response, NextFunction } from "express";
import * as authController from "../src/controllers/authController";
import * as authService from "../src/services/authService";
import { AppError } from "../src/utils/AppError";
import { 
  ProfileResponse, 
  AuthResponse,
  CheckUsernameRequest,
  CheckEmailRequest,
  RegisterRequest,
  LoginRequest,
  AuthenticatedRequest,
  UpdateProfileRequest
} from "../src/types/authTypes";

// Mock auth service
vi.mock("../src/services/authService", () => ({
  isUsernameAvailable: vi.fn(),
  isEmailAvailable: vi.fn(),
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  getUserProfile: vi.fn(),
  deleteUserById: vi.fn(),
  updateUserProfile: vi.fn()
}));

vi.mock("../src/validation/authValidation", () => ({
  profileResponseSchema: {
    parse: vi.fn(data => data)
  }
}));

describe("authController", () => {
  // Setup mock objects
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock response object
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    };

    mockNext = vi.fn();
  });

  describe("checkUsername", () => {
    it("should return available true if username is available", async () => {
      // Arrange
      const mockRequest: Partial<CheckUsernameRequest> = {
        body: { username: "testuser" }
      };
      vi.mocked(authService.isUsernameAvailable).mockResolvedValue(true);

      // Act
      await authController.checkUsername(
        mockRequest as CheckUsernameRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(authService.isUsernameAvailable).toHaveBeenCalledWith("testuser");
      expect(mockResponse.json).toHaveBeenCalledWith({ available: true });
    });
  });

  describe("checkEmail", () => {
    it("should return available false if email is not available", async () => {
      // Arrange
      const mockRequest: Partial<CheckEmailRequest> = {
        body: { email: "test@example.com" }
      };
      vi.mocked(authService.isEmailAvailable).mockResolvedValue(false);

      // Act
      await authController.checkEmail(
        mockRequest as CheckEmailRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(authService.isEmailAvailable).toHaveBeenCalledWith("test@example.com");
      expect(mockResponse.json).toHaveBeenCalledWith({ available: false });
    });
  });

  describe("register", () => {
    it("should register a user and return user object", async () => {
      // Arrange
      const user: ProfileResponse = {
        id: "user-1",
        username: "test",
        email: "test@example.com",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const mockRequest: Partial<RegisterRequest> = {
        body: { username: "test", email: "test@example.com", password: "pw" }
      };
      vi.mocked(authService.registerUser).mockResolvedValue(user);

      // Act
      await authController.register(
        mockRequest as RegisterRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(authService.registerUser).toHaveBeenCalledWith({
        username: "test", 
        email: "test@example.com", 
        password: "pw"
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ user });
    });
  });

  describe("login", () => {
    it("should login and set auth cookie", async () => {
      // Arrange
      const authResponse: AuthResponse = {
        user: {
          id: "user-1",
          username: "test",
          email: "test@example.com",
        },
        token: "token123"
      };
      const mockRequest: Partial<LoginRequest> = {
        body: { usernameOrEmail: "test", password: "pw" }
      };
      vi.mocked(authService.loginUser).mockResolvedValue(authResponse);

      // Act
      await authController.login(
        mockRequest as LoginRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(authService.loginUser).toHaveBeenCalledWith({ 
        usernameOrEmail: "test", 
        password: "pw" 
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith("authToken", { path: "/" });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "authToken",
        authResponse.token,
        expect.objectContaining({ httpOnly: true, secure: true })
      );
      expect(mockResponse.json).toHaveBeenCalledWith({ user: authResponse.user });
    });
  });

  describe("profile", () => {
    it("should return user profile if authenticated", async () => {
      // Arrange
      const user: ProfileResponse = {
        id: "user-1",
        username: "test",
        email: "test@example.com",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const mockRequest: Partial<AuthenticatedRequest> = {
        user: { 
          id: "user-1",
          username: "test",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
      vi.mocked(authService.getUserProfile).mockResolvedValue(user);

      // Act
      await authController.profile(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(authService.getUserProfile).toHaveBeenCalledWith("user-1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ 
        id: "user-1", 
        username: "test", 
        email: "test@example.com" 
      }));
    });

    it("should call next with AppError if not authenticated", async () => {
      // Arrange
      const mockRequest: Partial<AuthenticatedRequest> = {
        user: undefined
      };

      // Act
      await authController.profile(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("deleteMyAccount", () => {
    it("should delete user and return 204", async () => {
      // Arrange
      const mockRequest: Partial<AuthenticatedRequest> = {
        user: { 
          id: "user-1",
          username: "test",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
      vi.mocked(authService.deleteUserById).mockResolvedValue(undefined);

      // Act
      await authController.deleteMyAccount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(authService.deleteUserById).toHaveBeenCalledWith("user-1");
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("should call next with AppError if not authenticated", async () => {
      // Arrange
      const mockRequest: Partial<AuthenticatedRequest> = {
        user: undefined
      };

      // Act
      await authController.deleteMyAccount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("updateProfile", () => {
    it("should update user and return updated user", async () => {
      // Arrange
      const updatedUser: ProfileResponse = {
        id: "user-1",
        username: "new",
        email: "new@example.com",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const mockRequest: Partial<UpdateProfileRequest> = {
        user: { 
          id: "user-1",
          username: "test",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        body: { 
          username: "new", 
          email: "new@example.com", 
          newPassword: "pw", 
          currentPassword: "oldpw" 
        }
      };
      vi.mocked(authService.updateUserProfile).mockResolvedValue(updatedUser);

      // Act
      await authController.updateProfile(
        mockRequest as UpdateProfileRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(authService.updateUserProfile).toHaveBeenCalledWith({
        userId: "user-1",
        username: "new",
        email: "new@example.com",
        newPassword: "pw",
        currentPassword: "oldpw"
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ user: updatedUser });
    });

    it("should call next with AppError if not authenticated", async () => {
      // Arrange
      const mockRequest: Partial<UpdateProfileRequest> = {
        user: undefined,
        body: { 
          username: "new", 
          email: "new@example.com", 
          newPassword: "pw", 
          currentPassword: "oldpw" 
        }
      };

      // Act
      await authController.updateProfile(
        mockRequest as UpdateProfileRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("validLogin", () => {
    it("should return validLogin true", () => {
      // Arrange
      const mockRequest = {};

      // Act
      authController.validLogin(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ validLogin: true });
    });
  });

  describe("logout", () => {
    it("should clear authToken cookie and return message", () => {
      // Arrange
      const mockRequest = {};

      // Act
      authController.logout(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.clearCookie).toHaveBeenCalledWith("authToken", 
        expect.objectContaining({ path: "/" })
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: "Logged out successfully" 
      });
    });
  });
});
