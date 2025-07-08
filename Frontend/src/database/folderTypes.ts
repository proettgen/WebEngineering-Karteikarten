/**
 * Folder Types - Frontend
 * 
 * Type definitions for folder operations.
 * These types are synchronized with Backend/src/types/folderTypes.ts
 * 
 * NOTE: Keep these types synchronized with backend types manually when backend changes.
 */

// =============================================================================
// CORE FOLDER TYPES
// =============================================================================

/**
 * Full Folder entity as returned by the API
 */
export interface Folder {
  id: string;
  name: string;
  parentId: string | null; // null for root folders
  userId: string; // Owner of the folder
  createdAt: string; // ISO datetime string
  lastOpenedAt: string | null; // Last time folder was accessed
}

/**
 * Folder input data for creation (without server-generated fields)
 */
export interface FolderInput {
  name: string;
  parentId?: string | null; // Optional parent folder
}

/**
 * Folder update data (fields that can be updated)
 */
export interface FolderUpdateInput {
  name?: string;
  parentId?: string | null;
}

// =============================================================================
// QUERY & FILTER TYPES
// =============================================================================

/**
 * Folder filtering options for API queries
 */
export interface FolderFilter {
  search?: string; // Search in folder names
  parentId?: string | null; // Filter by parent folder
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'createdAt' | 'lastOpenedAt';
  order?: 'asc' | 'desc';
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Paginated response for folder queries
 */
export interface FolderListResponse {
  status: 'success';
  results: number;
  limit: number;
  offset: number;
  total: number;
  data: {
    folders: Folder[];
  };
}

/**
 * Single folder response
 */
export interface FolderResponse {
  status: 'success';
  data: {
    folder: Folder;
  };
}

/**
 * Folder creation response
 */
export interface FolderCreateResponse {
  status: 'success';
  data: {
    folder: Folder;
  };
}

/**
 * Legacy interface for backward compatibility (will be removed)
 * @deprecated Use FolderListResponse instead
 */
export interface FolderData {
  folders: Folder[];
}