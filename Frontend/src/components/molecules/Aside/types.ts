export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface FolderData {
  folders: Folder[];
}

export interface FolderAsideProps {
  onFolderSelect?: (_folderId: string | null) => void;
  initialSelectedFolderId?: string | null;
}
