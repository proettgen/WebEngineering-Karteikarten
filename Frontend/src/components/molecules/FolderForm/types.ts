export interface FolderFormProps {
  initialName?: string;
  onSave: (_name: string) => void;
  onDelete?: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}
