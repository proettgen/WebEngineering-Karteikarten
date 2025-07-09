/**
 * FolderSelection Component Types
 * 
 * Type definitions for the FolderSelection molecule component.
 */

import type { FolderWithCardCount as BaseFolderWithCardCount } from '../../../hooks/types';

export type FolderWithCardCount = BaseFolderWithCardCount;

export interface FolderSelectionProps {
  folders: FolderWithCardCount[];
  selectedFolderId: string | null;
  onSelect: (_folder: FolderWithCardCount) => void;
  loading?: boolean;
  testId?: string;
}
