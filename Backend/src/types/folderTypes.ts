/**
 * Folder Types
 * 
 * Type definitions for folder operations.
 * Core types are inferred from Zod validation schemas - single source of truth.
 * 
 * NOTE: Frontend types are maintained separately in Frontend/src/database/folderTypes.ts
 * and should be updated manually when backend types change.
 */

import { z } from 'zod';
import { Request } from 'express';
import { 
  folderInputSchema,
  folderSchema, 
  folderUpdateSchema 
} from '../validation/folderValidation';

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
}

// Infer core types from Zod schemas - single source of truth
export type FolderInput = z.infer<typeof folderInputSchema>; // For user input (no userId)
export type FolderUpdateInput = z.infer<typeof folderUpdateSchema>;
export type FolderComplete = z.infer<typeof folderSchema>; // Complete folder with all fields

// Full Folder entity (extends inferred type with database fields)
export interface Folder extends BaseEntity {
  name: string;
  parentId?: string | null;
  userId: string; // User ownership
  lastOpenedAt: string | null;
}

// Generic typed request interface
interface TypedRequest<T> extends Request {
  body: T;
}

// Typed request interfaces using generics
export type CreateFolderRequest = TypedRequest<FolderInput>;
export type UpdateFolderRequest = TypedRequest<FolderUpdateInput>;