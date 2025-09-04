"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: "user" | "admin"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        // In real app, validate token with API
        const mockUser: User = {
          id: "1",
          email: "user@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "user",
          createdAt: new Date().toISOString(),
        }
        setUser(mockUser)
      }
    } catch (error) {
      console.error("Session check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Mock API call - in real app, call your auth API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === "admin@example.com") {
        const adminUser: User = {
          id: "admin",
          email: "admin@example.com",
          firstName: "Admin",
          lastName: "User",
          role: "admin",
          createdAt: new Date().toISOString(),
        }
        setUser(adminUser)
        localStorage.setItem("auth_token", "mock_admin_token")
      } else {
        const regularUser: User = {
          id: "1",
          email,
          firstName: "John",
          lastName: "Doe",
          role: "user",
          createdAt: new Date().toISOString(),
        }
        setUser(regularUser)
        localStorage.setItem("auth_token", "mock_user_token")
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Invalid credentials" }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true)

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        role: "user",
        createdAt: new Date().toISOString(),
      }

      setUser(newUser)
      localStorage.setItem("auth_token", "mock_token")

      return { success: true }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  const resetPassword = async (email: string) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { success: true }
    } catch (error) {
      return { success: false, error: "Reset failed" }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}
