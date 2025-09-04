"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { registerServiceWorker, checkPWASupport, requestNotificationPermission } from "@/lib/pwa-utils"

interface PWAContextType {
  isOnline: boolean
  isInstalled: boolean
  swRegistration: ServiceWorkerRegistration | null
  notificationPermission: NotificationPermission
  requestNotifications: () => Promise<boolean>
}

const PWAContext = createContext<PWAContextType | null>(null)

export function usePWA() {
  const context = useContext(PWAContext)
  if (!context) {
    throw new Error("usePWA must be used within PWAProvider")
  }
  return context
}

interface PWAProviderProps {
  children: ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    // Initialize PWA features
    const initPWA = async () => {
      // Check if app is installed
      const installed = window.matchMedia("(display-mode: standalone)").matches
      setIsInstalled(installed)

      // Set initial online status
      setIsOnline(navigator.onLine)

      // Set initial notification permission
      if ("Notification" in window) {
        setNotificationPermission(Notification.permission)
      }

      // Register service worker
      const registration = await registerServiceWorker()
      if (registration) {
        setSwRegistration(registration)
      }

      // Check PWA support
      const support = checkPWASupport()
      console.log("PWA Support:", support)
    }

    initPWA()

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Listen for app installed event
    const handleAppInstalled = () => setIsInstalled(true)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const requestNotifications = async () => {
    const granted = await requestNotificationPermission()
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }
    return granted
  }

  const value: PWAContextType = {
    isOnline,
    isInstalled,
    swRegistration,
    notificationPermission,
    requestNotifications,
  }

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>
}
