/**
 * Card Service Tests
 * 
 * Einfacher Demo-Test für cardService - zeigt Service-Layer Testing mit Mocks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock für pg (PostgreSQL) - einfacher Ansatz ohne Hoisting-Probleme
vi.mock('pg', () => {
  const mockQuery = vi.fn()
  return {
    Pool: vi.fn(() => ({
      query: mockQuery,
    })),
  }
})

// Mock für uuid
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-123',
}))

// Import nach den Mocks
import * as cardService from '../src/services/cardService'
import { Pool } from 'pg'

// Mock-Instanz holen
const mockPool = new Pool() as any
const mockQuery = mockPool.query as ReturnType<typeof vi.fn>

describe('Card Service Demo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCardById', () => {
    it('should return a card when found in database', async () => {
      // Arrange
      const mockCard = {
        id: 'test-id',
        title: 'Demo Card',
        question: 'What is a service test?',
        answer: 'A test that verifies business logic',
        currentLearningLevel: 0,
        createdAt: '2025-01-01T10:00:00Z',
        tags: ['demo'],
        folderId: 'folder-1'
      }

      // Mock der Datenbankabfrage
      mockQuery.mockResolvedValue({ rows: [mockCard] })

      // Act
      const result = await cardService.getCardById('test-id')

      // Assert
      expect(result).toEqual(mockCard)
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['test-id']
      )
    })

    it('should return null when card not found', async () => {
      // Arrange
      mockQuery.mockResolvedValue({ rows: [] })

      // Act
      const result = await cardService.getCardById('non-existent')

      // Assert
      expect(result).toBeNull()
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['non-existent']
      )
    })
  })
})
