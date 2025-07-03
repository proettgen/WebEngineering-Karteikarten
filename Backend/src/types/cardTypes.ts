/**
 * Card Types
 * 
 * Type definitions for flashcard operations.
 * Core types are inferred from Zod validation schemas - single source of truth.
 * 
 * NOTE: Frontend types are maintained separately in Frontend/src/database/cardTypes.ts
 * and should be updated manually when backend types change.
 */

import { z } from 'zod';
import { Request } from 'express';
import { 
  cardSchema, 
  cardUpdateSchema, 
  cardFilterSchema,
  cardSortSchema 
} from '../validation/cardValidation';
import { paginationSchema } from '../validation/pagination';

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
}

// Infer core types from Zod schemas - single source of truth
export type CardInput = z.infer<typeof cardSchema>;
export type CardUpdateInput = z.infer<typeof cardUpdateSchema>;
export type CardFilter = z.infer<typeof cardFilterSchema>;
export type CardSort = z.infer<typeof cardSortSchema>;

// Combined filter type for service layer (includes all query parameters)
export type CardServiceFilter = z.infer<typeof cardFilterSchema> & 
  z.infer<typeof paginationSchema> & 
  z.infer<typeof cardSortSchema>;

// Full Card entity (extends inferred type with database fields)
export interface Card extends BaseEntity, CardInput {
  // All fields come from CardInput via Zod inference
  // Only additional database-specific fields would go here
}

// Generic typed request interface
interface TypedRequest<T> extends Request {
  body: T;
}

// Typed request interfaces using generics
export type CreateCardRequest = TypedRequest<CardInput>;
export type UpdateCardRequest = TypedRequest<CardUpdateInput>;