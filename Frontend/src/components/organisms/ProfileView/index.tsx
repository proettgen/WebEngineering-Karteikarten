"use client";
import React from "react";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import Notification from "@/components/molecules/Notification";
import * as SC from "./styles";
import { ProfileViewProps } from "./types";


const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onEdit,
  onLogout,
  onDelete,
  deleteConfirm,
  setDeleteConfirm,
  error,
  success,
}) => {
  // Add local state for error/success if you want to dismiss them locally,
  // or handle via parent by passing setError/setSuccess as props.
  const [localError, setLocalError] = React.useState<string | null>(error);
  const [localSuccess, setLocalSuccess] = React.useState<string | null>(success);

  // Sync with props if they change
  React.useEffect(() => {
    setLocalError(error);
  }, [error]);
  React.useEffect(() => {
    setLocalSuccess(success);
  }, [success]);

  return (
    <SC.Container>
      <SC.HeaderSection>
        <Headline tag="h1" size="xl" color="textPrimary">
          Profile
        </Headline>
      </SC.HeaderSection>

      {localError && (
        <Notification
          message={localError}
          type="error"
          onDismiss={() => setLocalError(null)}
        />
      )}

      {localSuccess && (
        <Notification
          message={localSuccess}
          type="success"
          onDismiss={() => setLocalSuccess(null)}
        />
      )}

      <SC.InfoSection>
        <SC.InfoRow>
          <SC.LabelContainer>
            <Text size="medium" color="textSecondary">Username</Text>
          </SC.LabelContainer>
          <SC.Value>
            <Text size="medium">{profile.username}</Text>
          </SC.Value>
        </SC.InfoRow>

        <SC.InfoRow>
          <SC.LabelContainer>
            <Text size="medium" color="textSecondary">Email</Text>
          </SC.LabelContainer>
          <SC.Value>
            <Text size="medium">{profile.email || "Not provided"}</Text>
          </SC.Value>
        </SC.InfoRow>

        <SC.InfoRow>
          <SC.LabelContainer>
            <Text size="medium" color="textSecondary">User ID</Text>
          </SC.LabelContainer>
          <SC.Value>
            <Text size="small" color="textSecondary">{profile.id}</Text>
          </SC.Value>
        </SC.InfoRow>

        <SC.InfoRow>
          <SC.LabelContainer>
            <Text size="medium" color="textSecondary">Created</Text>
          </SC.LabelContainer>
          <SC.Value>
            <Text size="small" color="textSecondary">
              {new Date(profile.created_at).toLocaleString()}
            </Text>
          </SC.Value>
        </SC.InfoRow>

        <SC.InfoRow>
          <SC.LabelContainer>
            <Text size="medium" color="textSecondary">Last Updated</Text>
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
          <Text size="medium" color="textPrimary">
            Edit Profile
          </Text>
        </Button>

        <Button type="button" $variant="primary" onClick={onLogout}>
          <Text size="medium" color="textPrimary">
            Logout
          </Text>
        </Button>
      </SC.ButtonGroup>

      <SC.Divider />

      <SC.DangerZone>
        <Headline tag="h3" size="sm" color="deny">
          Danger Zone
        </Headline>
        
        {!deleteConfirm ? (
          <Button $variant="deny" onClick={() => setDeleteConfirm(true)}>
            <Text size="medium" color="textPrimary">
              Delete Account
            </Text>
          </Button>
        ) : (
          <>
            <SC.WarningMessage>
              <Text color="deny" size="medium">
                Are you sure? This action cannot be undone.
              </Text>
            </SC.WarningMessage>
            <SC.ButtonRow>
              <Button $variant="deny" onClick={onDelete}>
                <Text size="medium" color="textPrimary">
                  Yes, delete my account
                </Text>
              </Button>
              <Button $variant="accept" onClick={() => setDeleteConfirm(false)}>
                <Text size="medium" color="textPrimary">
                  No, keep my account
                </Text>
              </Button>
            </SC.ButtonRow>
          </>
        )}
      </SC.DangerZone>
    </SC.Container>
  );
};

export default ProfileView;