/**
 * Analytics Type Definitions
 *
 * TypeScript interfaces and types for analytics data structures.
 * Defines the schema for learning statistics and progress tracking data.
 * Used across backend services and shared with frontend via type synchronization.
 *
 * Pattern: Types are inferred from Zod validation schemas (single source of truth)
 * This ensures consistency between validation logic and TypeScript types.
 *
 * Main Interface - Analytics:
 * - id: Unique record identifier (UUID)
 * - userId: User who owns the analytics data (foreign key)
 * - totalLearningTime: Total learning time in seconds
 * - totalCardsLearned: Number of cards successfully learned
 * - totalCorrect: Number of correct answers given
 * - totalWrong: Number of incorrect answers given
 * - resets: Number of times learning progress was reset
 * - updatedAt: Last modification timestamp (ISO string)
 *
 * Cross-references:
 * - drizzle/schema.ts: Database schema definition
 * - src/services/analyticsService.ts: Business logic using these types
 * - src/controllers/analyticsController.ts: HTTP controllers using these types
 * - src/validation/analyticsValidation.ts: Validation schemas for these types
 */

import { z } from "zod";
import {
  createAnalyticsBody,
  updateAnalyticsBody,
  analyticsResponseSchema,
} from "../validation/analyticsValidation";

// Infer all types from Zod schemas - single source of truth
export type CreateAnalyticsInput = z.infer<typeof createAnalyticsBody>;
export type UpdateAnalyticsInput = z.infer<typeof updateAnalyticsBody>;
export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>;

// Legacy interface kept for database operations (matches drizzle schema)
// Note: Maintained for compatibility with Drizzle ORM operations
export interface Analytics {
  id: string;
  userId: string;
  totalLearningTime: number;
  totalCardsLearned: number;
  totalCorrect: number;
  totalWrong: number;
  resets: number;
  updatedAt: string;
}
