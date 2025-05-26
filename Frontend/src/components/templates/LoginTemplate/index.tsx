// index.tsx
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";
import AuthFormInput from "@/components/atoms/AuthFormInput";
import Link from "@/components/atoms/Link";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import Icon from "@/components/atoms/Icon";
import Headline from "@/components/atoms/Headline";
import * as SC from "./styles";

const LoginTemplate: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        const response = await loginUser({
          username: formData.username,
          password: formData.password,
        });
        // Handle successful login (store token, redirect, etc.)
        localStorage.setItem("token", response.token);
        router.push("/dashboard");
      } catch {
        //TODO: show error to user
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, formData],
  );

  const isButtonDisabled = 
    !formData.username.trim() || 
    !formData.password.trim() || 
    isSubmitting;

  // Create simple field objects for the AuthFormInput component
  const createSimpleField = (value: string) => ({
    value,
    error: undefined,
    touched: false,
    success: false,
    loading: false,
  });

  return (
    <SC.PageWrapper>
      <SC.FormContainer onSubmit={handleSubmit} noValidate>
        <Headline weight="bold" tag="h1" size="lg">
          Welcome Back
        </Headline>

        <AuthFormInput
          name="username"
          type="text"
          placeholder="Username"
          field={createSimpleField(formData.username)}
          onChange={handleChange}
          onBlur={() => {}} // No-op for login
          required
        />

        <AuthFormInput
          name="password"
          type="password"
          placeholder="Password"
          field={createSimpleField(formData.password)}
          onChange={handleChange}
          onBlur={() => {}} // No-op for login
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
