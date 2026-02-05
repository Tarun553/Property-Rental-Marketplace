"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  role: "landlord" | "tenant";
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await api.get("/auth/me");
          setUser(data);
        } catch (error) {
          console.log(error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    router.push(
      userData.role === "landlord"
        ? "/dashboard/landlord"
        : "/dashboard/tenant",
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
