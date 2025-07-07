import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { validLogin } from "@/services/authService";

type AuthContextType = {
  isLoggedIn: boolean | null;
  checkLogin: () => Promise<void>;
  setIsLoggedIn: (_val: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkLogin = async () => {
    try {
      const { validLogin: isValid } = await validLogin();
      setIsLoggedIn(isValid);
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkLogin, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};