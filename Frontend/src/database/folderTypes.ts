/**
 * IMPORTANT: Type Synchronization Notice
 *
 * If you make changes to this file, please run `npm run sync-types` from the project root. (npm run sync-types) [Root]
 * This will copy the updated types to the Frontend for type safety and consistency.
 */

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // TODO: Change to Date type
  lastOpenedAt: string; // see above
}

export interface FolderData {
  folders: Folder[];
}