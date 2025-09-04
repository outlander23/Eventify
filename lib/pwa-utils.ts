// PWA utility functions for offline support and background sync

export interface QueuedRegistration {
  id: string
  eventId: string
  clientUuid: string
  attendeeInfo: {
    name: string
    email: string
    phone?: string
    organization?: string
  }
  ticketType: string
  quantity: number
  timestamp: number
}

// Queue registration for offline sync
export async function queueRegistration(registrationData: Omit<QueuedRegistration, "id" | "timestamp">) {
  const queuedItem: QueuedRegistration = {
    ...registrationData,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  }

  try {
    // Store in IndexedDB via service worker
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready

      // Send to service worker for IndexedDB storage
      registration.active?.postMessage({
        type: "QUEUE_REGISTRATION",
        data: queuedItem,
      })

      // Also store in localStorage as backup
      const existing = JSON.parse(localStorage.getItem("offline-queue") || "[]")
      existing.push({
        id: queuedItem.id,
        type: "registration",
        title: `Registration for event`,
        status: "pending",
        timestamp: queuedItem.timestamp,
      })
      localStorage.setItem("offline-queue", JSON.stringify(existing))

      // Register background sync
      if ("sync" in window.ServiceWorkerRegistration.prototype) {
        await registration.sync.register("registration-sync")
      }

      return queuedItem.id
    }
  } catch (error) {
    console.error("Failed to queue registration:", error)
    throw error
  }
}

// Check if device supports PWA features
export function checkPWASupport() {
  return {
    serviceWorker: "serviceWorker" in navigator,
    backgroundSync: "serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype,
    pushNotifications: "serviceWorker" in navigator && "PushManager" in window,
    installPrompt: "BeforeInstallPromptEvent" in window || window.matchMedia("(display-mode: standalone)").matches,
  }
}

// Register service worker
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service workers not supported")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    })

    console.log("Service worker registered:", registration)

    // Listen for updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New version available
            console.log("New version available")
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error("Service worker registration failed:", error)
    return null
  }
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Notifications not supported")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission === "denied") {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === "granted"
}

// Subscribe to push notifications
export async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push notifications not supported")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready

    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription()
    if (existingSubscription) {
      return existingSubscription
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
    })

    console.log("Push subscription created:", subscription)
    return subscription
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error)
    return null
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Check if app is installed
export function isAppInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
}

// Get network status
export function getNetworkStatus() {
  return {
    online: navigator.onLine,
    connection:
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection,
  }
}
