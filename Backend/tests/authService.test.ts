import { beforeEach, describe, expect, it, vi } from 'vitest';

// Step 2: Hoist the mock definitions
const { dbMocks } = vi.hoisted(() => {
  return {
    dbMocks: {
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockImplementation(() => []),
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockImplementation(() => []),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    },
  };
});

// Step 3: Mock the modules using the hoisted variables
vi.mock('../src/db', () => ({
  db: dbMocks,
}));

vi.mock('../src/utils/AppError', () => {
  return {
    AppError: class AppError extends Error {
      statusCode: number;

      constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
      }
    },
  };
});

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((column, value) => ({ column, value })),
  or: vi.fn((...conditions) => ({ conditions })),
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
  hash: vi.fn(),
  compare: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  // Add a default export to align with how jwt is likely imported
  default: {
    sign: vi.fn().mockReturnValue('jwt_token'),
  },
  sign: vi.fn().mockReturnValue('jwt_token'),
}));

vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}));

// Step 4: Import the dependencies and service AFTER mocks and env setup
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AppError } from '../src/utils/AppError';
import {
  RegisterInput,
  LoginInput,
  ProfileResponse,
  UpdateProfileInputWithId,
} from '../src/types/authTypes';

// Import the service under test - must be after all mocks AND env setup
import * as authService from '../src/services/authService';

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock database functions
    dbMocks.select.mockReturnThis();
    dbMocks.from.mockReturnThis();
    dbMocks.where.mockReturnThis();
    dbMocks.limit.mockImplementation(() => []);
    dbMocks.insert.mockReturnThis();
    dbMocks.values.mockReturnThis();
    dbMocks.returning.mockImplementation(() => []);
    dbMocks.update.mockReturnThis();
    dbMocks.set.mockReturnThis();
    dbMocks.delete.mockReturnThis();

    // The environment variable is already set, so you can remove it from here
  });

  describe('isUsernameAvailable', () => {
    it('should return true when username is available', async () => {
      // Arrange
      dbMocks.limit.mockResolvedValue([]);

      // Act
      const result = await authService.isUsernameAvailable('newuser');

      // Assert
      expect(result).toBe(true);
      expect(dbMocks.select).toHaveBeenCalled();
      expect(dbMocks.where).toHaveBeenCalled();
      expect(dbMocks.limit).toHaveBeenCalledWith(1);
    });

    it('should return false when username is taken', async () => {
      // Arrange
      dbMocks.limit.mockResolvedValue([{ id: 'user-1' }]);

      // Act
      const result = await authService.isUsernameAvailable('takenuser');

      // Assert
      expect(result).toBe(false);
    });

    it('should throw AppError on database error', async () => {
      // Arrange
      dbMocks.where.mockImplementation(() => {
        throw new Error('Database error');
      });
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(() => authService.isUsernameAvailable('testuser')).rejects.toThrow(AppError);

      // Restore the original console.error function
      consoleErrorSpy.mockRestore();
    });
  });

  describe('isEmailAvailable', () => {
    it('should return true when email is available', async () => {
      // Arrange
      dbMocks.limit.mockResolvedValue([]);

      // Act
      const result = await authService.isEmailAvailable('new@example.com');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when email is taken', async () => {
      // Arrange
      dbMocks.limit.mockResolvedValue([{ id: 'user-1' }]);

      // Act
      const result = await authService.isEmailAvailable('taken@example.com');

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when email is empty', async () => {
      // Act
      const result = await authService.isEmailAvailable('');

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const registerInput: RegisterInput = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      const expectedUser: ProfileResponse = {
        id: 'user-1',
        username: 'newuser',
        email: 'new@example.com',
        created_at: '2025-07-08T10:00:00.000Z',
        updated_at: '2025-07-08T10:00:00.000Z',
      };

      // Mock availability checks by controlling the db mock
      dbMocks.limit.mockResolvedValue([]);

      // Mock password hashing
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      vi.mocked(bcrypt.default.hash).mockResolvedValue('hashed_password' as never);

      // Mock insert returning
      dbMocks.returning.mockResolvedValue([expectedUser]);

      // Act
      const result = await authService.registerUser(registerInput);

      // Assert
      expect(result).toEqual(expectedUser);
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      expect(bcrypt.default.hash).toHaveBeenCalledWith('password123', 12);
      expect(dbMocks.insert).toHaveBeenCalled();
      expect(dbMocks.values).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashed_password',
      });
    });

    it('should throw AppError when username is already taken', async () => {
      // Arrange
      const registerInput: RegisterInput = {
        username: 'takenuser',
        email: 'new@example.com',
        password: 'password123',
      };

      // Mock username check to return a user (taken)
      dbMocks.limit.mockResolvedValueOnce([{ id: 'user-1' }]);

      // Act & Assert
      await expect(() => authService.registerUser(registerInput)).rejects.toThrow(AppError);
    });

    it('should throw AppError when email is already taken', async () => {
      // Arrange
      const registerInput: RegisterInput = {
        username: 'newuser',
        email: 'taken@example.com',
        password: 'password123',
      };

      // Mock username check to be available, then email check to be taken
      dbMocks.limit.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 'user-2' }]);

      // Act & Assert
      await expect(() => authService.registerUser(registerInput)).rejects.toThrow(AppError);
    });
  });

  describe('loginUser', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const loginInput: LoginInput = {
        usernameOrEmail: 'testuser',
        password: 'password123',
      };

      const dbUser = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
      };

      dbMocks.limit.mockResolvedValue([dbUser]);
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

      // Act
      const result = await authService.loginUser(loginInput);

      // Assert
      expect(result).toEqual({
        token: 'jwt_token',
        user: {
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
        },
      });
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      expect(bcrypt.default.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      // Reference the mock through the default export
      // @ts-expect-error: jwt.default is not recognized by TypeScript but is necessary for the mock
      expect(jwt.default.sign).toHaveBeenCalledWith(
        { userId: 'user-1' },
        'test-secret',
        { expiresIn: '1h' }
      );
    });

    it('should throw AppError when user not found', async () => {
      // Arrange
      const loginInput: LoginInput = {
        usernameOrEmail: 'nonexistent',
        password: 'password123',
      };

      dbMocks.limit.mockResolvedValue([]);

      // Act & Assert
      await expect(() => authService.loginUser(loginInput)).rejects.toThrow(AppError);
    });

    it('should throw AppError when password is incorrect', async () => {
      // Arrange
      const loginInput: LoginInput = {
        usernameOrEmail: 'testuser',
        password: 'wrongpassword',
      };

      const dbUser = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
      };

      dbMocks.limit.mockResolvedValue([dbUser]);
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      vi.mocked(bcrypt.default.compare).mockResolvedValue(false as never);

      // Act & Assert
      await expect(() => authService.loginUser(loginInput)).rejects.toThrow(AppError);
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      expect(bcrypt.default.compare).toHaveBeenCalledWith('wrongpassword', 'hashed_password');
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile when found', async () => {
      // Arrange
      const userId = 'user-1';
      const expectedProfile: ProfileResponse = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2025-07-08T10:00:00.000Z',
        updated_at: '2025-07-08T10:00:00.000Z',
      };

      dbMocks.limit.mockResolvedValue([expectedProfile]);

      // Act
      const result = await authService.getUserProfile(userId);

      // Assert
      expect(result).toEqual(expectedProfile);
      expect(dbMocks.select).toHaveBeenCalled();
      expect(dbMocks.where).toHaveBeenCalled();
    });

    it('should throw AppError when user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      dbMocks.limit.mockResolvedValue([]);

      // Act & Assert
      await expect(() => authService.getUserProfile(userId)).rejects.toThrow(AppError);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const updateInput: UpdateProfileInputWithId = {
        userId: 'user-1',
        username: 'newusername',
        email: 'new@example.com',
        currentPassword: 'correctpassword',
      };

      const existingUser = {
        id: 'user-1',
        username: 'oldusername',
        email: 'old@example.com',
        password: 'hashed_password',
        created_at: '2025-07-08T10:00:00.000Z',
        updated_at: '2025-07-08T10:00:00.000Z',
      };

      const updatedProfile: ProfileResponse = {
        id: 'user-1',
        username: 'newusername',
        email: 'new@example.com',
        created_at: '2025-07-08T10:00:00.000Z',
        updated_at: '2025-07-08T11:00:00.000Z',
      };

      // Mock db.select for fetching user
      dbMocks.limit.mockResolvedValueOnce([existingUser]);

      // Mock password verification
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

      // Mock availability checks by controlling db mock
      dbMocks.limit.mockResolvedValue([]); // for username and email checks

      // Mock the update returning
      dbMocks.returning.mockResolvedValue([updatedProfile]);

      // Act
      const result = await authService.updateUserProfile(updateInput);

      // Assert
      expect(result).toEqual(updatedProfile);
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      expect(bcrypt.default.compare).toHaveBeenCalledWith('correctpassword', 'hashed_password');
      expect(dbMocks.update).toHaveBeenCalled();
      expect(dbMocks.set).toHaveBeenCalledWith({
        username: 'newusername',
        email: 'new@example.com',
      });
    });

    it('should update password when newPassword is provided', async () => {
      // Arrange
      const updateInput: UpdateProfileInputWithId = {
        userId: 'user-1',
        currentPassword: 'correctpassword',
        newPassword: 'newpassword123',
      };

      const existingUser = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
        created_at: '2025-07-08T10:00:00.000Z',
        updated_at: '2025-07-08T10:00:00.000Z',
      };

      const updatedProfile: ProfileResponse = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2025-07-08T10:00:00.000Z',
        updated_at: '2025-07-08T11:00:00.000Z',
      };

      // Mock db.select for fetching user
      dbMocks.limit.mockResolvedValueOnce([existingUser]);

      // Mock password verification:
      // 1st call (current password check) -> true
      // 2nd call (new vs old password check) -> false
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      vi.mocked(bcrypt.default.compare)
        .mockResolvedValueOnce(true as never) // Correct current password
        .mockResolvedValueOnce(false as never); // New password is not the same as old

      // Mock password hashing
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      vi.mocked(bcrypt.default.hash).mockResolvedValue('new_hashed_password' as never);

      // Mock the update returning
      dbMocks.returning.mockResolvedValue([updatedProfile]);

      // Act
      const result = await authService.updateUserProfile(updateInput);

      // Assert
      expect(result).toEqual(updatedProfile);
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      expect(bcrypt.default.compare).toHaveBeenCalledWith('correctpassword', 'hashed_password');
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      expect(bcrypt.default.hash).toHaveBeenCalledWith('newpassword123', 12);
      expect(dbMocks.update).toHaveBeenCalled();
      expect(dbMocks.set).toHaveBeenCalledWith({
        password: 'new_hashed_password',
      });
    });

    it('should throw AppError when current password is incorrect', async () => {
      // Arrange
      const updateInput: UpdateProfileInputWithId = {
        userId: 'user-1',
        username: 'newusername',
        currentPassword: 'wrongpassword',
      };

      const existingUser = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
        created_at: '2025-07-08T10:00:00.000Z',
        updated_at: '2025-07-08T10:00:00.000Z',
      };

      // Mock db.select for fetching user
      dbMocks.limit.mockResolvedValueOnce([existingUser]);

      // Mock password verification to fail
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      vi.mocked(bcrypt.default.compare).mockResolvedValue(false as never);

      // Act & Assert
      await expect(() => authService.updateUserProfile(updateInput)).rejects.toThrow(AppError);
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      expect(bcrypt.default.compare).toHaveBeenCalledWith('wrongpassword', 'hashed_password');
    });

    it('should throw AppError when user not found', async () => {
      // Arrange
      const updateInput: UpdateProfileInputWithId = {
        userId: 'nonexistent',
        username: 'newusername',
        currentPassword: 'password123',
      };

      // Mock db.select to return empty array (user not found)
      dbMocks.limit.mockResolvedValueOnce([]);

      // Act & Assert
      await expect(() => authService.updateUserProfile(updateInput)).rejects.toThrow(AppError);
    });

    it('should throw AppError when new username is already taken', async () => {
      // Arrange
      const updateInput: UpdateProfileInputWithId = {
        userId: 'user-1',
        username: 'takenusername',
        currentPassword: 'correctpassword',
      };

      const existingUser = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
        created_at: '2025-07-08T10:00:00.000Z',
        updated_at: '2025-07-08T10:00:00.000Z',
      };

      // Mock db.select for fetching user
      dbMocks.limit.mockResolvedValueOnce([existingUser]);

      // Mock password verification
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

      // Mock username availability check to return false (taken)
      dbMocks.limit.mockResolvedValueOnce([{ id: 'another-user' }]);

      // Act & Assert
      await expect(() => authService.updateUserProfile(updateInput)).rejects.toThrow(AppError);
    });

    it('should throw AppError when no changes are made', async () => {
      // Arrange
      const updateInput: UpdateProfileInputWithId = {
        userId: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        currentPassword: 'correctpassword',
      };

      const existingUser = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
        created_at: '2025-07-08T10:00:00.000Z',
        updated_at: '2025-07-08T10:00:00.000Z',
      };

      // Mock db.select for fetching user
      dbMocks.limit.mockResolvedValueOnce([existingUser]);

      // Mock password verification
      // @ts-expect-error: bcrypt.default is not recognized by TypeScript but is necessary for the mock
      vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

      // Act & Assert
      await expect(() => authService.updateUserProfile(updateInput)).rejects.toThrow(AppError);
    });
  });

  describe('deleteUserById', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userId = 'user-1';
      // Correctly mock the final result of the delete chain
      dbMocks.delete.mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowCount: 1 }),
      });

      // Act
      await authService.deleteUserById(userId);

      // Assert
      expect(dbMocks.delete).toHaveBeenCalled();
    });

    it('should throw AppError when user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      // Mock the delete operation to return a rowCount of 0
      dbMocks.delete.mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowCount: 0 }),
      });

      // Act & Assert
      await expect(() => authService.deleteUserById(userId)).rejects.toThrow(AppError);
    });
  });
});