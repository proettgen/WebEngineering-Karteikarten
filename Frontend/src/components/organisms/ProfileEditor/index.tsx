import React, { useCallback } from "react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { updateProfile } from "@/services/authService";
import AuthFormInput from "@/components/atoms/AuthFormInput";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
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
  onError,
  onCancel,
  error,
}) => {
  const handleSubmit = useCallback(
    async (formData: any) => {
      try {
        await updateProfile({
          username: formData.username,
          email: formData.email,
          newPassword: formData.password || undefined,
          currentPassword: formData.confirmPassword,
        });
        onSuccess({
          username: formData.username,
          email: formData.email,
        });
      } catch (err: any) {
        onError(err?.message || "Update failed");
      }
    },
    [onSuccess, onError]
  );

  const {
    fields,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    isSubmitting,
    isValid,
  } = useAuthForm({
    mode: "register",
    initialValues: {
      username: profile.username,
      email: profile.email || "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: handleSubmit,
  });

  const isButtonDisabled =
    !isValid ||
    isSubmitting ||
    Object.values(fields).some((field) => field.loading) ||
    !fields.confirmPassword.value;

  return (
    <SC.FormContainer onSubmit={onSubmit} noValidate>
      <Headline tag="h1" size="lg" weight="bold">
        Edit Profile
      </Headline>

      {error && (
        <SC.ErrorMessage>
          {error}
        </SC.ErrorMessage>
      )}

      <AuthFormInput
        name="username"
        type="text"
        placeholder="Username"
        field={fields.username}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />

      <AuthFormInput
        name="email"
        type="email"
        placeholder="Email Address (Optional)"
        field={fields.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <AuthFormInput
        name="password"
        type="password"
        placeholder="New Password (leave blank to keep current)"
        field={fields.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SC.HelperText>
        Leave password field empty to keep your current password
      </SC.HelperText>

      <AuthFormInput
        name="confirmPassword"
        type="password"
        placeholder="Current Password (required to save changes)"
        field={fields.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />

      <SC.ButtonRow>
        <Button type="submit" disabled={isButtonDisabled}>
          <Text size="medium" color="textPrimary">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Text>
        </Button>
        <Button type="button" $variant="secondary" onClick={onCancel}>
          <Text size="medium" color="textPrimary">
            Cancel
          </Text>
        </Button>
      </SC.ButtonRow>
    </SC.FormContainer>
  );
};

export default ProfileEditor;