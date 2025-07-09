import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthForm } from "@/hooks/useAuthForm";
import { registerUser } from "@/services/authService";
import AuthFormInput from "@/components/atoms/AuthFormInput";
import Link from "@/components/atoms/Link";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import Icon from "@/components/atoms/Icon";
import Headline from "@/components/atoms/Headline";
import * as SC from "./styles";

const SignUpTemplate: React.FC = () => {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (formData: any) => {
      try {
        await registerUser(formData);
        // Handle successful registration
        router.push("/login?registered=true");
      } catch  {
        // Error handling: Registration errors are managed by the useAuthForm hook
        // which displays appropriate error messages to the user
      }
    },
    [router],
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
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: handleSubmit,
  });

  const isButtonDisabled =
    !isValid ||
    isSubmitting ||
    Object.values(fields).some((field) => field.loading);

  return (
    <SC.PageWrapper>
      <SC.FormContainer onSubmit={onSubmit} noValidate>
        <Headline weight="bold" tag="h1" size="lg">
          Create Account
        </Headline>

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
          placeholder="E-mail Address (Optional)"
          field={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <AuthFormInput
          name="password"
          type="password"
          placeholder="Password"
          field={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <AuthFormInput
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          field={fields.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <Button type="submit" disabled={isButtonDisabled}>
          <Text size="medium" color="textPrimary">
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Text>
          <Icon size="m" color="textPrimary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
          </Icon>
        </Button>

        <Link
          href="/login"
          color="primary"
          size="small"
          underlineOnHover={true}
        >
          Already have an account? Log in
        </Link>
      </SC.FormContainer>
    </SC.PageWrapper>
  );
};

export default SignUpTemplate;
