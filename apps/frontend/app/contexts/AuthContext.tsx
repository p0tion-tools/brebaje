"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  displayName: string;
  avatarUrl?: string;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  jwt: string | null;
  isLoading: boolean;
  login: (jwt: string, user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");

    if (storedJwt && storedUser) {
      try {
        setJwt(storedJwt);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newJwt: string, newUser: User) => {
    setJwt(newJwt);
    setUser(newUser);
    localStorage.setItem("jwt", newJwt);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setJwt(null);
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    jwt,
    isLoading,
    login,
    logout,
    isLoggedIn: !!user && !!jwt,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
