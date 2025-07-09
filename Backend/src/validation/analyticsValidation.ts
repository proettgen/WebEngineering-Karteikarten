import { z } from "zod";

/**
 * Analytics Validation Schemas
 *
 * Comprehensive Zod validation schemas for analytics operations and data structures.
 * Provides type-safe request validation, data sanitization, and error handling.
 * Follows established validation patterns used throughout the application.
 *
 * Schema Categories:
 * - Field schemas: Individual validation rules for analytics data fields
 * - Request schemas: Complete validation for API request bodies
 * - Response schemas: Type definitions for API responses
 * - Export types: TypeScript types derived from validation schemas
 *
 * Validation Features:
 * - Range validation for numeric fields
 * - Required field enforcement
 * - Optional field handling for updates
 * - Comprehensive error messages for better user experience
 *
 * Cross-references:
 * - src/controllers/analyticsController.ts: Uses these schemas for request validation
 * - src/types/analyticsTypes.ts: Related type definitions
 * - src/validation/common.ts: Shared validation utilities
 * - Other validation files: authValidation.ts, cardValidation.ts, folderValidation.ts
 */

// Base analytics field schemas
export const learningTimeSchema = z
  .number()
  .int()
  .min(0, { message: "Learning time must be a non-negative integer" })
  .max(86400 * 365, { message: "Learning time cannot exceed one year in seconds" }); // Max 1 year

export const cardsLearnedSchema = z
  .number()
  .int()
  .min(0, { message: "Cards learned must be a non-negative integer" })
  .max(1000000, { message: "Cards learned count is unrealistically high" });

export const correctAnswersSchema = z
  .number()
  .int()
  .min(0, { message: "Correct answers must be a non-negative integer" })
  .max(1000000, { message: "Correct answers count is unrealistically high" });

export const wrongAnswersSchema = z
  .number()
  .int()
  .min(0, { message: "Wrong answers must be a non-negative integer" })
  .max(1000000, { message: "Wrong answers count is unrealistically high" });

export const resetsSchema = z
  .number()
  .int()
  .min(0, { message: "Resets must be a non-negative integer" })
  .max(10000, { message: "Resets count is unrealistically high" });

// Request body schemas
export const createAnalyticsBody = z.object({
  totalLearningTime: learningTimeSchema.default(0),
  totalCardsLearned: cardsLearnedSchema.default(0),
  totalCorrect: correctAnswersSchema.default(0),
  totalWrong: wrongAnswersSchema.default(0),
  resets: resetsSchema.default(0),
});

export const updateAnalyticsBody = z.object({
  totalLearningTime: learningTimeSchema.optional(),
  totalCardsLearned: cardsLearnedSchema.optional(),
  totalCorrect: correctAnswersSchema.optional(),
  totalWrong: wrongAnswersSchema.optional(),
  resets: resetsSchema.optional(),
}).refine(
  (data) => Object.values(data).some(value => value !== undefined),
  { message: "At least one field must be provided for update" }
);

// Response schemas
export const analyticsResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  totalLearningTime: learningTimeSchema,
  totalCardsLearned: cardsLearnedSchema,
  totalCorrect: correctAnswersSchema,
  totalWrong: wrongAnswersSchema,
  resets: resetsSchema,
  updatedAt: z.string().datetime(),
});

// Type exports for use in controllers
export type CreateAnalyticsBody = z.infer<typeof createAnalyticsBody>;
export type UpdateAnalyticsBody = z.infer<typeof updateAnalyticsBody>;
export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>;
