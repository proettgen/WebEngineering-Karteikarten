import { Profile } from "@/components/templates/ProfileTemplate/types";

export interface ProfileViewProps {
  profile: Profile;
  onEdit: () => void;
  onLogout: () => void;
  onDelete: () => void;
  deleteConfirm: boolean;
  setDeleteConfirm: (_confirm: boolean) => void;
  error: string | null;
  success: string | null;
}
