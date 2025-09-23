"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    // Check for stored auth token on app load
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && userData !== "undefined" && userData !== "null") {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        clearAuthData();
      }
    } else {
      clearAuthData();
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Network error - please check if backend is running",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: data.message || "Account created successfully!",
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "Network error - please check if backend is running",
      };
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    login,
    register,
    logout,
    getAuthHeaders,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
