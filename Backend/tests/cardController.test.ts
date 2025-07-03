/**
 * Card Controller Tests
 * 
 * Tests für die HTTP-Handler der Card-Funktionalität
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import * as cardController from '../src/controllers/cardController'

// Mock für cardService
vi.mock('../src/services/cardService', () => ({
  getAllCards: vi.fn()
}))

// Mock für folderService
vi.mock('../src/services/folderService', () => ({
  folderExists: vi.fn()
}))

// Import der gemockten Services
import * as cardService from '../src/services/cardService'

describe('Card Controller', () => {
  // Mock Request, Response und NextFunction
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    // Reset alle Mocks vor jedem Test
    vi.clearAllMocks()

    // Setup Mock-Objekte
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

  describe('getAllCards', () => {
    it('should return cards with default pagination when no query params provided', async () => {
      // Arrange
      const mockCards = [
        {
          id: '1',
          title: 'Test Card 1',
          question: 'What is testing?',
          answer: 'Testing is important',
          currentLearningLevel: 0,
          createdAt: '2025-01-01T10:00:00Z',
          tags: ['test'],
          folderId: 'folder-1'
        },
        {
          id: '2',
          title: 'Test Card 2',
          question: 'Why test?',
          answer: 'To ensure quality',
          currentLearningLevel: 1,
          createdAt: '2025-01-02T10:00:00Z',
          tags: ['quality'],
          folderId: 'folder-1'
        }
      ]

      const mockServiceResult = {
        cards: mockCards,
        total: 2
      }

      // Mock der Service-Funktion
      const mockGetAllCards = vi.mocked(cardService.getAllCards)
      mockGetAllCards.mockResolvedValue(mockServiceResult)

      // Act
      await cardController.getAllCards(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      // Assert
      expect(mockGetAllCards).toHaveBeenCalledWith({
        folderId: undefined,
        tags: undefined,
        title: undefined,
        limit: 20,
        offset: 0,
        sortBy: undefined,
        order: undefined
      })

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        results: 2,
        limit: 20,
        offset: 0,
        total: 2,
        data: { cards: mockCards }
      })

      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
