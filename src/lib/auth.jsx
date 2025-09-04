"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Mock authentication - in real app, integrate with your auth service
  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("eventhub_user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing saved user data:", error)
        localStorage.removeItem("eventhub_user")
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email, password) => {
    setIsLoading(true)
    try {
      // Mock API call - replace with real authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData = {
        id: "1",
        email,
        name: email.split("@")[0],
        avatar: null,
        role: email.includes("admin") ? "admin" : "user",
        createdAt: new Date().toISOString(),
      }

      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("eventhub_user", JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email, password, name) => {
    setIsLoading(true)
    try {
      // Mock API call - replace with real authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData = {
        id: Date.now().toString(),
        email,
        name,
        avatar: null,
        role: "user",
        createdAt: new Date().toISOString(),
      }

      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("eventhub_user", JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("eventhub_user")
  }

  const resetPassword = async (email) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("eventhub_user", JSON.stringify(updatedUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
