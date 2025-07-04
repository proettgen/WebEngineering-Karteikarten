export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  lastOpenedAt: string | null;
}

export interface FolderData {
  folders: Folder[];
}