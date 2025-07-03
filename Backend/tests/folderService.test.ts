/**
 * Folder Service Tests
 * 
 * Einfacher Demo-Test für folderService - zeigt Service-Layer Testing
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
  v4: () => 'test-folder-uuid-456',
}))

// Import nach den Mocks
import * as folderService from '../src/services/folderService'
import { Pool } from 'pg'

// Mock-Instanz holen
const mockPool = new Pool() as any
const mockQuery = mockPool.query as ReturnType<typeof vi.fn>

describe('Folder Service Demo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getFolderById', () => {
    it('should return a folder when found in database', async () => {
      // Arrange
      const mockFolder = {
        id: 'folder-123',
        name: 'Demo Folder',
        description: 'A test folder for demonstrations',
        createdAt: '2025-01-01T10:00:00Z',
        cardCount: 5
      }

      // Mock der Datenbankabfrage
      mockQuery.mockResolvedValue({ rows: [mockFolder] })

      // Act
      const result = await folderService.getFolderById('folder-123')

      // Assert
      expect(result).toEqual(mockFolder)
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['folder-123']
      )
    })

    it('should return null when folder not found', async () => {
      // Arrange
      mockQuery.mockResolvedValue({ rows: [] })

      // Act
      const result = await folderService.getFolderById('non-existent')

      // Assert
      expect(result).toBeNull()
    })
  })
})
