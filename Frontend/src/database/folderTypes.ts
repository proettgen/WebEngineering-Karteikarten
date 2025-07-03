export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  lastOpenedAt: string;
}

export interface FolderData {
  folders: Folder[];
}