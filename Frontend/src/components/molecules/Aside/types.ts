// components/organisms/FolderNavigationAside/types.ts

/**
 * Defines the structure of a single folder.
 */
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  lastOpenedAt: string;
}
