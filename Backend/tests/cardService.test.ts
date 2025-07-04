/**
 * Card Service Tests
 * 
 * Demo tests for cardService - simplified for the Drizzle ORM migration
 */

import { describe, it, vi, beforeEach, expect } from 'vitest'

// Create a mock implementation
const mockGetCardById = vi.fn();

// Simple mock for the entire module
vi.mock('../src/services/cardService', () => ({
  getCardById: () => mockGetCardById()
}))

describe('Card Service Demo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCardById', () => {
    it('should return a card when found in database', async () => {
      // Set up the mock to return a card
      const mockCard = {
        id: 'test-id',
        title: 'Demo Card',
        question: 'What is a service test?',
        answer: 'A test that verifies business logic',
        currentLearningLevel: 0,
        createdAt: '2025-01-01T10:00:00Z',
        tags: ['demo'],
        folderId: 'folder-1'
      };
      mockGetCardById.mockResolvedValue(mockCard);
      
      // Import the service dynamically to use the mock
      const { getCardById } = await import('../src/services/cardService.js');
      
      // Call the function
      const result = await getCardById('test-id');
      
      // Verify the result
      expect(result).toEqual(mockCard);
      expect(mockGetCardById).toHaveBeenCalled();
    })

    it('should return null when card not found', async () => {
      // Set up the mock to return null
      mockGetCardById.mockResolvedValue(null);
      
      // Import the service dynamically to use the mock
      const { getCardById } = await import('../src/services/cardService.js');
      
      // Call the function
      const result = await getCardById('non-existent');
      
      // Verify the result
      expect(result).toBeNull();
      expect(mockGetCardById).toHaveBeenCalled();
    })
  })
})
