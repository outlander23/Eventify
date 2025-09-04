// Notification system for push and email notifications

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  url?: string
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  data?: Record<string, any>
}

export interface EmailNotification {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

class NotificationService {
  private vapidPublicKey: string

  constructor() {
    this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
  }

  // Subscribe user to push notifications
  async subscribeToPush(): Promise<PushSubscription | null> {
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
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      })

      // Send subscription to server
      await this.saveSubscription(subscription)

      return subscription
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      return null
    }
  }

  // Save push subscription to server
  private async saveSubscription(subscription: PushSubscription) {
    try {
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })
    } catch (error) {
      console.error("Failed to save push subscription:", error)
    }
  }

  // Send push notification (server-side)
  async sendPushNotification(subscription: PushSubscription, payload: NotificationPayload) {
    try {
      const response = await fetch("/api/notifications/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          payload,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Failed to send push notification:", error)
      return false
    }
  }

  // Send email notification
  async sendEmail(notification: EmailNotification) {
    try {
      const response = await fetch("/api/notifications/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      })

      return response.ok
    } catch (error) {
      console.error("Failed to send email notification:", error)
      return false
    }
  }

  // Broadcast notification to multiple users
  async broadcastNotification(
    audience: "all" | "event" | "new" | "inactive",
    payload: NotificationPayload,
    eventId?: string,
  ) {
    try {
      const response = await fetch("/api/notifications/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audience,
          payload,
          eventId,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Failed to broadcast notification:", error)
      return false
    }
  }

  // Helper function to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Predefined notification templates
  getEventReminderNotification(eventTitle: string, eventDate: string): NotificationPayload {
    return {
      title: "Event Reminder",
      body: `${eventTitle} is starting soon on ${eventDate}`,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      url: "/account/registrations",
      actions: [
        {
          action: "view",
          title: "View Event",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    }
  }

  getRegistrationConfirmationNotification(eventTitle: string): NotificationPayload {
    return {
      title: "Registration Confirmed",
      body: `You're registered for ${eventTitle}`,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      url: "/account/registrations",
      actions: [
        {
          action: "view",
          title: "View Ticket",
        },
      ],
    }
  }

  getNewEventNotification(eventTitle: string, category: string): NotificationPayload {
    return {
      title: "New Event Available",
      body: `${eventTitle} in ${category} is now open for registration`,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      url: "/events",
      actions: [
        {
          action: "view",
          title: "View Event",
        },
        {
          action: "dismiss",
          title: "Not Interested",
        },
      ],
    }
  }
}

export const notificationService = new NotificationService()

// React hook for notifications
export function useNotifications() {
  return {
    subscribeToPush: notificationService.subscribeToPush.bind(notificationService),
    sendPushNotification: notificationService.sendPushNotification.bind(notificationService),
    sendEmail: notificationService.sendEmail.bind(notificationService),
    broadcastNotification: notificationService.broadcastNotification.bind(notificationService),
    getEventReminderNotification: notificationService.getEventReminderNotification.bind(notificationService),
    getRegistrationConfirmationNotification:
      notificationService.getRegistrationConfirmationNotification.bind(notificationService),
    getNewEventNotification: notificationService.getNewEventNotification.bind(notificationService),
  }
}
