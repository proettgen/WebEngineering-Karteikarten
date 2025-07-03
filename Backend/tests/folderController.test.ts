/**
 * Folder Controller Tests
 * 
 * Einfacher Demo-Test für folderController - zeigt Controller-Layer Testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import * as folderController from '../src/controllers/folderController'

// Mock für folderService
vi.mock('../src/services/folderService', () => ({
  getAllFolders: vi.fn(),
  getFolderById: vi.fn(),
  createFolder: vi.fn(),
}))

// Import der gemockten Services
import * as folderService from '../src/services/folderService'

describe('Folder Controller Demo', () => {
  // Mock Request, Response und NextFunction
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    vi.clearAllMocks()

    mockRequest = {
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
          description: 'Learn JS fundamentals',
          createdAt: '2025-01-01T10:00:00Z',
          lastOpenedAt: '2025-01-01T10:00:00Z',
          cardCount: 10
        },
        {
          id: 'folder-2',
          name: 'TypeScript Advanced',
          description: 'Advanced TS concepts',
          createdAt: '2025-01-02T10:00:00Z',
          lastOpenedAt: '2025-01-02T10:00:00Z',
          cardCount: 15
        }
      ]

      const mockServiceResult = {
        folders: mockFolders,
        total: 2
      }

      // Mock der Service-Funktion
      const mockGetAllFolders = vi.mocked(folderService.getAllFolders)
      mockGetAllFolders.mockResolvedValue(mockServiceResult)

      // Act
      await folderController.getAllFolders(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      // Assert
      expect(mockGetAllFolders).toHaveBeenCalledWith(20, 0)

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
      const mockGetAllFolders = vi.mocked(folderService.getAllFolders)
      mockGetAllFolders.mockRejectedValue(mockError)

      // Act
      await folderController.getAllFolders(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      // Assert
      expect(mockNext).toHaveBeenCalledWith(mockError)
      expect(mockResponse.status).not.toHaveBeenCalled()
    })
  })
})
