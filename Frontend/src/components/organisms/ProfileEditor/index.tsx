"use client";
import React, { useCallback, useState } from "react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { updateProfile } from "@/services/authService";
import AuthFormInput from "@/components/atoms/AuthFormInput";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import Notification from "@/components/molecules/Notification";
import * as SC from "./styles";
import { Profile } from "@/components/templates/ProfileTemplate/types";

interface ProfileEditProps {
  profile: Profile;
  onSuccess: (_updatedProfile: { username: string; email: string }) => void;
  onError: (_error: string) => void;
  onCancel: () => void;
  error: string | null;
}

const ProfileEditor: React.FC<ProfileEditProps> = ({
  profile,
  onSuccess,
  onCancel,
  error,
}) => {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSubmit = useCallback(
    async (formData: any) => {
      try {
        setNotification(null);
        
        // Only send fields that have changed
        const updateData: any = {
          currentPassword: formData.currentPassword,
        };
        
        if (formData.username?.trim() && formData.username !== profile.username) {
          updateData.username = formData.username;
        }
        
        if (formData.email?.trim() && formData.email !== profile.email) {
          updateData.email = formData.email;
        }
        
        if (formData.newPassword?.trim()) {
          updateData.newPassword = formData.newPassword;
        }
        
        await updateProfile(updateData);
        
        // Show success notification
        setNotification({
          message: "Profile updated successfully!",
          type: "success"
        });
        
        // Call the success callback after a brief delay to let user see the notification
        setTimeout(() => {
          onSuccess({
            username: updateData.username || profile.username,
            email: updateData.email || profile.email || "",
          });
        }, 1500);
        
      } catch  {
        // Show error notification
        setNotification({
          message: "Failed to update profile",
          type: "error"
        });
      }
    },
    [onSuccess, profile.username, profile.email]
  );

  const {
    fields,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    isSubmitting,
  } = useAuthForm({
    mode: "profile",
    initialValues: {
      username: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
    },
    onSubmit: handleSubmit,
  });

  // Check if new password field has content to show confirm password
  const showConfirmPassword = fields.newPassword.value.trim() !== "";

  // Check if at least one field to update is filled and current password is provided
  const hasChangesToSave = 
    fields.username.value.trim() !== "" ||
    fields.email.value.trim() !== "" ||
    fields.newPassword.value.trim() !== "";
    
  const isButtonDisabled =
    !hasChangesToSave ||
    !fields.currentPassword.value.trim() ||
    isSubmitting ||
    Object.values(fields).some((field) => field.loading) ||
    (fields.username.value.trim() && !!fields.username.error) ||
    (fields.email.value.trim() && !!fields.email.error) ||
    (fields.newPassword.value.trim() && !!fields.newPassword.error) ||
    (showConfirmPassword && !!fields.confirmPassword.error) ||
    (showConfirmPassword && !fields.confirmPassword.value.trim()) ||
    !!fields.currentPassword.error;

  const handleNotificationDismiss = () => {
    setNotification(null);
  };

  return (
    <SC.FormContainer onSubmit={onSubmit} noValidate>
      <Headline tag="h1" size="lg" weight="bold">
        Edit Profile
      </Headline>

      {/* Display notifications for errors and success */}
      {(notification || error) && (
        <Notification
          message={notification?.message || error || ""}
          type={notification?.type || "error"}
          duration={4000}
          onDismiss={handleNotificationDismiss}
        />
      )}

      <SC.HelperText>
        Fill out only the fields you want to change. Current password is required to save any changes.
      </SC.HelperText>

      <AuthFormInput
        name="username"
        type="text"
        placeholder={`Username (current: ${profile.username})`}
        field={fields.username}
        onChange={handleChange}
        onBlur={handleBlur}
        skipValidation={!fields.username.value.trim()}
      />

      <AuthFormInput
        name="email"
        type="email"
        placeholder={`Email (current: ${profile.email || 'none'})`}
        field={fields.email}
        onChange={handleChange}
        onBlur={handleBlur}
        skipValidation={!fields.email.value.trim()}
      />

      <AuthFormInput
        name="newPassword"
        type="password"
        placeholder="New Password (leave blank to keep current)"
        field={fields.newPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        skipValidation={!fields.newPassword.value.trim()}
      />

      {/* Conditionally show confirm password field */}
      {showConfirmPassword && (
        <AuthFormInput
          name="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          field={fields.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      )}

      <AuthFormInput
        name="currentPassword"
        type="password"
        placeholder="Current Password (required to save changes)"
        field={fields.currentPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />

      <SC.ButtonRow>
        <Button type="submit" disabled={isButtonDisabled} $variant="accept">
          <Text size="medium" color="textPrimary">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Text>
        </Button>
        <Button type="button" $variant="deny" onClick={onCancel}>
          <Text size="medium" color="textPrimary">
            Cancel
          </Text>
        </Button>
      </SC.ButtonRow>
    </SC.FormContainer>
  );
};

export default ProfileEditor;