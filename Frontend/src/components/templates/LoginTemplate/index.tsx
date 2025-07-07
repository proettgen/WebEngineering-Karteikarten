// index.tsx
import React, { useState, useCallback } from "react";
import { loginUser, logoutUser } from "@/services/authService";
import AuthFormInput from "@/components/atoms/AuthFormInput";
import Link from "@/components/atoms/Link";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import Icon from "@/components/atoms/Icon";
import Headline from "@/components/atoms/Headline";
import * as SC from "./styles";
import { useAuth } from "@/context/AuthContext";

const LoginTemplate: React.FC = () => {
  const { isLoggedIn, checkLogin } = useAuth();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});
  const [fieldsTouched, setFieldsTouched] = useState<{ usernameOrEmail: boolean; password: boolean }>({
    usernameOrEmail: false,
    password: false,
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      await checkLogin();
    } catch {
      ""
    }
  };

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setFieldErrors({}); // Clear errors on change
    },
    [],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const { name } = event.target;
      setFieldsTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setFieldErrors({});
      setFieldsTouched({ usernameOrEmail: true, password: true }); // Mark as touched on submit

      try {
        await loginUser({
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
        });
        await checkLogin();
      } catch (error: any) {
        if (
          typeof error?.message === "string" &&
          (error.message.includes("401") || error.message.includes("400"))
        ) {
          setFieldErrors({
            usernameOrEmail: "‎ ",
            password: "Invalid identifier or password",
          });
          setFieldsTouched({
            usernameOrEmail: true,
            password: true,
          });
        } else {
          setFieldErrors({
            usernameOrEmail: undefined,
            password: "An unexpected error occurred.",
          });
          setFieldsTouched({
            usernameOrEmail: true,
            password: true,
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, checkLogin],
  );

  const isButtonDisabled =
    !formData.usernameOrEmail.trim() ||
    !formData.password.trim() ||
    isSubmitting;

  // Helper to create the field object for AuthFormInput
  const createField = (name: "usernameOrEmail" | "password") => ({
    value: formData[name],
    error: fieldErrors[name],
    touched: fieldsTouched[name],
    success: false,
    loading: false,
  });

  if (isLoggedIn === null) {
    return (
      <SC.PageWrapper>
        <SC.FormContainer>
          <Headline weight="bold" tag="h1" size="lg">
            Checking login status...
          </Headline>
          <Text size="medium" color="textSecondary">
            Please wait while we verify your session.
          </Text>
        </SC.FormContainer>
      </SC.PageWrapper>
    );
  }

  if (isLoggedIn) {
    return (
      <SC.PageWrapper>
        <SC.FormContainer>
          <Headline weight="bold" tag="h1" size="lg">
            You are logged in!
          </Headline>
          <Button onClick={handleLogout}>
            <Text size="medium" color="textPrimary">
              Logout
            </Text>
          </Button>
        </SC.FormContainer>
      </SC.PageWrapper>
    );
  }

  return (
    <SC.PageWrapper>
      <SC.FormContainer onSubmit={handleSubmit} noValidate>
        <Headline weight="bold" tag="h1" size="lg">
          Welcome Back
        </Headline>

        <AuthFormInput
          name="usernameOrEmail"
          type="text"
          placeholder="Username or Email"
          field={createField("usernameOrEmail")}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <AuthFormInput
          name="password"
          type="password"
          placeholder="Password"
          field={createField("password")}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <Button type="submit" disabled={isButtonDisabled}>
          <Text size="medium" color="textPrimary">
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Text>
          <Icon size="m" color="textPrimary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
            </svg>
          </Icon>
        </Button>

        <Link
          href="/signup"
          color="primary"
          size="small"
          underlineOnHover={true}
        >
          Don&apos;t have an account? Sign up
        </Link>
      </SC.FormContainer>
    </SC.PageWrapper>
  );
};

export default LoginTemplate;
