/**
 * Card Types - Frontend
 * 
 * Type definitions for flashcard operations.
 * These types are synchronized with Backend/src/types/cardTypes.ts
 * 
 * NOTE: Keep these types synchronized with backend types manually when backend changes.
 */

// =============================================================================
// CORE CARD TYPES
// =============================================================================

/**
 * Full Card entity as returned by the API
 */
export interface Card {
  id: string;
  title: string;
  question: string;
  answer: string;
  currentLearningLevel: number; // 0-5 for spaced repetition
  createdAt: string; // ISO datetime string
  tags: string[] | null; // Optional array of tag strings
  folderId: string; // UUID of the parent folder
}

/**
 * Card input data for creation (without server-generated fields)
 */
export interface CardInput {
  title: string;
  question: string;
  answer: string;
  currentLearningLevel?: number; // Optional, defaults to 0
  tags?: string[] | null;
  folderId: string;
}

/**
 * Card update data (all fields optional except what's being updated)
 */
export interface CardUpdateInput {
  title?: string;
  question?: string;
  answer?: string;
  currentLearningLevel?: number;
  tags?: string[] | null;
}

// =============================================================================
// QUERY & FILTER TYPES
// =============================================================================

/**
 * Card filtering options for API queries
 */
export interface CardFilter {
  folderId?: string;
  tags?: string; // Comma-separated string
  title?: string; // Partial match
  limit?: number;
  offset?: number;
  sortBy?: 'title' | 'createdAt' | 'currentLearningLevel';
  order?: 'asc' | 'desc';
}

/**
 * Complete card service filter (includes all query parameters)
 */
export interface CardServiceFilter extends CardFilter {
  // Extends CardFilter with any additional frontend-specific filters
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Paginated response for card queries
 */
export interface CardListResponse {
  status: 'success';
  results: number;
  limit: number;
  offset: number;
  total: number;
  data: {
    cards: Card[];
  };
}

/**
 * Single card response
 */
export interface CardResponse {
  status: 'success';
  data: {
    card: Card;
  };
}

/**
 * Card creation response
 */
export interface CardCreateResponse {
  status: 'success';
  data: {
    card: Card;
  };
}