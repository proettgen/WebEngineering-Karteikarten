/**
 * Types Index
 *
 * Central export point for all type definitions.
 * Following the authTypes pattern - types are inferred from Zod schemas.
 *
 * IMPORTANT: Type Synchronization Notice
 * If you make changes to this file, please run `npm run sync-types` from the project root.
 * This will copy the updated types to the Frontend for type safety and consistency.
 */

// Re-export all types from individual modules
export * from './cardTypes';
export * from './folderTypes';
export * from './authTypes';

// Only keep types that are actually used across multiple modules
export interface BaseEntity {
  id: string;
  createdAt: string;
}
