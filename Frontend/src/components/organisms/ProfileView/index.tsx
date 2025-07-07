import React from "react";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import * as SC from "./styles";
import { Profile } from "@/components/templates/ProfileTemplate/types";

interface ProfileViewProps {
  profile: Profile;
  onEdit: () => void;
  onLogout: () => void;
  onDelete: () => void;
  deleteConfirm: boolean;
  setDeleteConfirm: (_confirm: boolean) => void;
  error: string | null;
  success: string | null;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onEdit,
  onLogout,
  onDelete,
  deleteConfirm,
  setDeleteConfirm,
  error,
  success,
}) => (
  <SC.Container>
    <SC.HeaderSection>
      <Headline tag="h1" size="xl" weight="bold" color="textPrimary">
        Profile
      </Headline>
    </SC.HeaderSection>

    {error && (
      <SC.MessageContainer>
        <Text color="deny" size="medium">{error}</Text>
      </SC.MessageContainer>
    )}
    
    {success && (
      <SC.MessageContainer>
        <Text color="accept" size="medium">{success}</Text>
      </SC.MessageContainer>
    )}

    <SC.InfoSection>
      <SC.InfoRow>
        <SC.LabelContainer>
          <Text size="medium" color="textSecondary" weight="bold">Username</Text>
        </SC.LabelContainer>
        <SC.Value>
          <Text size="medium" weight="bold">{profile.username}</Text>
        </SC.Value>
      </SC.InfoRow>

      <SC.InfoRow>
        <SC.LabelContainer>
          <Text size="medium" color="textSecondary" weight="bold">Email</Text>
        </SC.LabelContainer>
        <SC.Value>
          <Text size="medium">{profile.email || "Not provided"}</Text>
        </SC.Value>
      </SC.InfoRow>

      <SC.InfoRow>
        <SC.LabelContainer>
          <Text size="medium" color="textSecondary" weight="bold">User ID</Text>
        </SC.LabelContainer>
        <SC.Value>
          <Text size="small" color="textSecondary">{profile.id}</Text>
        </SC.Value>
      </SC.InfoRow>

      <SC.InfoRow>
        <SC.LabelContainer>
          <Text size="medium" color="textSecondary" weight="bold">Created</Text>
        </SC.LabelContainer>
        <SC.Value>
          <Text size="small" color="textSecondary">
            {new Date(profile.created_at).toLocaleString()}
          </Text>
        </SC.Value>
      </SC.InfoRow>

      <SC.InfoRow>
        <SC.LabelContainer>
          <Text size="medium" color="textSecondary" weight="bold">Last Updated</Text>
        </SC.LabelContainer>
        <SC.Value>
          <Text size="small" color="textSecondary">
            {new Date(profile.updated_at).toLocaleString()}
          </Text>
        </SC.Value>
      </SC.InfoRow>
    </SC.InfoSection>

    <SC.ButtonGroup>
      <Button type="button" onClick={onEdit}>
        <Text size="medium" color="textPrimary" weight="bold">
          Edit Profile
        </Text>
      </Button>

      <Button type="button" $variant="secondary" onClick={onLogout}>
        <Text size="medium" color="textPrimary" weight="bold">
          Logout
        </Text>
      </Button>
    </SC.ButtonGroup>

    <SC.Divider />

    <SC.DangerZone>
      <Headline tag="h3" size="sm" color="deny" weight="bold">
        Danger Zone
      </Headline>
      
      {!deleteConfirm ? (
        <Button $variant="deny" onClick={() => setDeleteConfirm(true)}>
          <Text size="medium" color="textPrimary" weight="bold">
            Delete Account
          </Text>
        </Button>
      ) : (
        <>
          <SC.WarningMessage>
            <Text color="deny" size="medium" weight="bold">
              Are you sure? This action cannot be undone.
            </Text>
          </SC.WarningMessage>
          <SC.ButtonRow>
            <Button $variant="deny" onClick={onDelete}>
              <Text size="medium" color="textPrimary" weight="bold">
                Yes, delete my account
              </Text>
            </Button>
            <Button $variant="secondary" onClick={() => setDeleteConfirm(false)}>
              <Text size="medium" color="textPrimary">
                Cancel
              </Text>
            </Button>
          </SC.ButtonRow>
        </>
      )}
    </SC.DangerZone>
  </SC.Container>
);

export default ProfileView;