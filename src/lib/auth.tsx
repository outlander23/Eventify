"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Try to restore user from localStorage (backend should return user on signin)
        const stored = localStorage.getItem("eventhub_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as User;
            setUser(parsed);
          } catch (e) {
            console.warn("Failed to parse stored user", e);
          }
        }
      }
    } catch (error) {
      console.error("Session check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("pak");
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.message || "Login failed" };
      }

      const data = await res.json();
      // Expecting { token, user }
      const token = data.token || data.accessToken || data.authToken;
      const userData = data.user || data.userData || data;

      if (token) localStorage.setItem("auth_token", token);
      if (userData)
        localStorage.setItem("eventhub_user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("signin error", error);
      return {
        success: false,
        error: (error && error.message) || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      setLoading(true);

      const payload: Record<string, any> = { username: email, email, password };
      if (firstName) payload.firstName = firstName;
      if (lastName) payload.lastName = lastName;

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        return {
          success: false,
          error: (err && (err.message || err.error)) || "Registration failed",
        };
      }

      const data = await res.json().catch(() => ({} as any));
      const token = data.token || data.accessToken || data.authToken;
      const userData = data.user || data.userData || data;

      if (token) localStorage.setItem("auth_token", token);
      if (userData)
        localStorage.setItem("eventhub_user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (err) {
      console.error("signup error", err);
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : String(err);
      return { success: false, error: message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("eventhub_user");
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        return {
          success: false,
          error: (err && (err.message || err.error)) || "Reset failed",
        };
      }

      return { success: true };
    } catch (err) {
      console.error("resetPassword error", err);
      return {
        success: false,
        error: (err && (err as any).message) || "Reset failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Expose isLoading and logout aliases for compatibility
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
