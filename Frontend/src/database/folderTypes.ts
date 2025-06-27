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