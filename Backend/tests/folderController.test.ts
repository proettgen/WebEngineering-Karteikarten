/**
 * Folder Controller Tests
 * 
 * Tests für folderController mit user-basierte Operationen
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Response, NextFunction } from 'express'
import * as folderController from '../src/controllers/folderController'
import { AuthenticatedRequest } from '../src/types/authTypes'

// Mock für folderService
vi.mock('../src/services/folderService', () => ({
  getUserFolders: vi.fn(),
  getUserFolder: vi.fn(),
  createUserFolder: vi.fn(),
  updateUserFolder: vi.fn(),
  deleteUserFolder: vi.fn(),
  getUserRootFolders: vi.fn(),
  searchUserFolders: vi.fn(),
  verifyFolderOwnership: vi.fn(),
}))

// Import der gemockten Services
import * as folderService from '../src/services/folderService'

describe('Folder Controller', () => {
  // Mock AuthenticatedRequest, Response und NextFunction
  let mockRequest: Partial<AuthenticatedRequest>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    vi.clearAllMocks()

    mockRequest = {
      user: {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2025-01-01T10:00:00Z',
        updated_at: '2025-01-01T10:00:00Z'
      },
      query: {},
      params: {},
      body: {}
    }

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    }

    mockNext = vi.fn()
  })

  describe('getAllFolders', () => {
    it('should return folders with pagination', async () => {
      // Arrange
      const mockFolders = [
        {
          id: 'folder-1',
          name: 'JavaScript Basics',
          parentId: null,
          userId: 'user-1',
          createdAt: '2025-01-01T10:00:00Z',
          lastOpenedAt: '2025-01-01T10:00:00Z'
        },
        {
          id: 'folder-2',
          name: 'TypeScript Advanced',
          parentId: null,
          userId: 'user-1',
          createdAt: '2025-01-02T10:00:00Z',
          lastOpenedAt: '2025-01-02T10:00:00Z'
        }
      ]

      const mockServiceResult = {
        folders: mockFolders,
        total: 2
      }

      // Mock der Service-Funktion
      const mockGetUserFolders = vi.mocked(folderService.getUserFolders)
      mockGetUserFolders.mockResolvedValue(mockServiceResult)

      // Act
      await folderController.getAllFolders(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      )

      // Assert
      expect(mockGetUserFolders).toHaveBeenCalledWith('user-123', 20, 0)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        results: 2,
        limit: 20,
        offset: 0,
        total: 2,
        data: { folders: mockFolders }
      })

      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle service errors', async () => {
      // Arrange
      const mockError = new Error('Database connection failed')
      const mockGetUserFolders = vi.mocked(folderService.getUserFolders)
      mockGetUserFolders.mockRejectedValue(mockError)

      // Act
      await folderController.getAllFolders(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      )

      // Assert
      expect(mockNext).toHaveBeenCalledWith(mockError)
      expect(mockResponse.status).not.toHaveBeenCalled()
    })
  })
})
