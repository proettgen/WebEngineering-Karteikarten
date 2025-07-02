/**
 * Folder Types
 *
 * TypeScript type definitions for folder-related data structures.
 * These types support hierarchical folder organization and ensure
 * type safety across the application.
 *
 * IMPORTANT: Type Synchronization Notice
 * If you make changes to this file, please run `npm run sync-types` from the project root.
 * This will copy the updated types to the Frontend for type safety and consistency.
 */

/**
 * Core Folder Interface
 *
 * Represents a folder in the hierarchical folder structure.
 * Supports both root folders (parentId = null) and nested folders.
 */
export interface Folder {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Display name of the folder */
  name: string;
  
  /** Reference to parent folder (null for root folders) */
  parentId: string | null;
  
  /** ISO timestamp when the folder was created */
  createdAt: string; // Note: Using string for API consistency, consider Date type for future versions
  
  /** ISO timestamp when the folder was last accessed */
  lastOpenedAt: string; // Note: Using string for API consistency, consider Date type for future versions
}

/**
 * Folder Collection Interface
 *
 * Used for API responses that return multiple folders.
 * Provides a consistent structure for folder listing endpoints.
 */
export interface FolderData {
  /** Array of folder objects */
  folders: Folder[];
}

/**
 * Folder Tree Node Interface
 *
 * Extended folder interface for hierarchical tree representations.
 * Used in navigation components that show folder relationships.
 */
export interface FolderTreeNode extends Folder {
  /** Child folders (for tree structure building) */
  children?: FolderTreeNode[];
  
  /** Indicates if folder has children (for lazy loading) */
  hasChildren?: boolean;
  
  /** Expansion state in UI components */
  isExpanded?: boolean;
}