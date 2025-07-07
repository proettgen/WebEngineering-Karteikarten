"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProfile, logoutUser, deleteUser } from "@/services/authService";
import * as SC from "./styles";
import { Profile } from "./types";
import Text from "@/components/atoms/Text";
import ProfileView from "@/components/organisms/ProfileView";
import ProfileEdit from "@/components/organisms/ProfileEditor";

const ProfileTemplate: React.FC = () => {
  const { isLoggedIn, checkLogin } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isLoggedIn === false) router.push("/login");
    if (isLoggedIn) {
      getProfile()
        .then((data) => {
          setProfile(data);
        })
        .catch(() => setError("Could not load profile"))
        .finally(() => setLoading(false));
    }
  }, [isLoggedIn, router]);

  const handleEditSuccess = (updatedProfile: { username: string; email: string }) => {
    setProfile({ ...profile!, ...updatedProfile });
    setEditMode(false);
    setSuccess("Profile updated successfully!");
    setError(null);
    checkLogin();
  };

  const handleEditError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  const handleDelete = async () => {
    setError(null);
    setSuccess(null);
    try {
      await deleteUser();
      await logoutUser();
      await checkLogin();
      router.push("/signup");
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess(null);
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
    setSuccess(null);
  };

  const handleLogout = async () => {
      try {
        await logoutUser();
        await checkLogin();
      } catch {
        //
      }
    };
  

  if (loading || isLoggedIn === null || !profile) {
    return (
      <SC.PageWrapper>
        <Text size="large">Loading...</Text>
      </SC.PageWrapper>
    );
  }

  return (
    <SC.PageWrapper>
      {editMode ? (
        <ProfileEdit
          profile={profile}
          onSuccess={handleEditSuccess}
          onError={handleEditError}
          onCancel={handleCancel}
          error={error}
        />
      ) : (
        <ProfileView
          onLogout={handleLogout}
          profile={profile}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteConfirm={deleteConfirm}
          setDeleteConfirm={setDeleteConfirm}
          error={error}
          success={success}
        />
      )}
    </SC.PageWrapper>
  );
};

export default ProfileTemplate;
