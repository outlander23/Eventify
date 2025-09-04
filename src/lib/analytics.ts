// Analytics utility functions for event tracking

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

// Analytics event names as per specification
export const ANALYTICS_EVENTS = {
  // Event listing and discovery
  EVENTS_LIST_VIEW: "events.list_view",
  EVENT_CARD_IMPRESSION: "event.card_impression",
  EVENT_SEARCH: "event.search",

  // Event details and registration
  EVENT_VIEW: "event.view",
  EVENT_REGISTER_ATTEMPT: "event.register_attempt",
  EVENT_REGISTER_SUCCESS: "event.register_success",

  // Authentication
  AUTH_SIGNUP: "auth.signup",
  AUTH_LOGIN: "auth.login",
  AUTH_RESET_REQUESTED: "auth.reset_requested",

  // PWA
  PWA_INSTALL_PROMPT_SHOWN: "pwa.install_prompt_shown",
  PWA_INSTALLED: "pwa.installed",
  NOTIFICATION_PERMISSION_GRANTED: "notification.permission_granted",

  // Offline
  OFFLINE_QUEUE_ADDED: "offline.queue_added",
  OFFLINE_QUEUE_SYNCED: "offline.queue_synced",

  // Admin actions
  ADMIN_VIEW_DASHBOARD: "admin.view_dashboard",
  ADMIN_EVENT_CREATED: "admin.event_created",
  ADMIN_EVENT_UPDATED: "admin.event_updated",
  ADMIN_NOTIFICATION_SENT: "admin.notification_sent",
  ADMIN_REPORT_VIEWED: "admin.report_viewed",
  ADMIN_ATTENDEE_CHECKED_IN: "admin.attendee_checked_in",
  ADMIN_ATTENDEE_EXPORTED: "admin.attendee_exported",

  // User actions
  USER_LOGIN: "user.login",
  USER_REGISTRATION_CANCELLED: "user.registration_cancelled",

  // Notifications
  NOTIFICATION_SENT: "notification.sent",
  NOTIFICATION_OPENED: "notification.opened",
} as const

class Analytics {
  private sessionId: string
  private userId: string | null = null
  private queue: AnalyticsEvent[] = []
  private isOnline = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isOnline = navigator.onLine

    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true
      this.flushQueue()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
    })
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  setUserId(userId: string | null) {
    this.userId = userId
  }

  track(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        page_url: window.location.href,
        page_title: document.title,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      },
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    }

    if (this.isOnline) {
      this.sendEvent(event)
    } else {
      this.queue.push(event)
    }

    // Also send to Vercel Analytics if available
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", eventName, properties)
    }

    console.log("[Analytics]", eventName, properties)
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error("Failed to send analytics event:", error)
      // Add back to queue for retry
      this.queue.push(event)
    }
  }

  private async flushQueue() {
    if (this.queue.length === 0) return

    const events = [...this.queue]
    this.queue = []

    try {
      await fetch("/api/analytics/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      })
    } catch (error) {
      console.error("Failed to flush analytics queue:", error)
      // Add events back to queue
      this.queue.unshift(...events)
    }
  }

  // Convenience methods for common events
  trackPageView(page: string, properties?: Record<string, any>) {
    this.track("page_view", {
      page,
      ...properties,
    })
  }

  trackEventView(eventId: string, eventTitle: string, category?: string) {
    this.track(ANALYTICS_EVENTS.EVENT_VIEW, {
      event_id: eventId,
      event_title: eventTitle,
      category,
    })
  }

  trackEventRegistration(eventId: string, ticketType: string, quantity: number, amount?: number) {
    this.track(ANALYTICS_EVENTS.EVENT_REGISTER_ATTEMPT, {
      event_id: eventId,
      ticket_type: ticketType,
      quantity,
      amount,
    })
  }

  trackRegistrationSuccess(eventId: string, registrationId: string, amount: number, paymentStatus: string) {
    this.track(ANALYTICS_EVENTS.EVENT_REGISTER_SUCCESS, {
      event_id: eventId,
      registration_id: registrationId,
      amount,
      payment_status: paymentStatus,
    })
  }

  trackSearch(query: string, filters?: Record<string, any>, resultsCount?: number) {
    this.track(ANALYTICS_EVENTS.EVENT_SEARCH, {
      query,
      filters,
      results_count: resultsCount,
    })
  }

  trackAuth(action: "signup" | "login" | "reset", method?: string) {
    const eventMap = {
      signup: ANALYTICS_EVENTS.AUTH_SIGNUP,
      login: ANALYTICS_EVENTS.AUTH_LOGIN,
      reset: ANALYTICS_EVENTS.AUTH_RESET_REQUESTED,
    }

    this.track(eventMap[action], {
      method,
    })
  }

  trackPWA(action: "install_prompt_shown" | "installed" | "notification_permission_granted") {
    const eventMap = {
      install_prompt_shown: ANALYTICS_EVENTS.PWA_INSTALL_PROMPT_SHOWN,
      installed: ANALYTICS_EVENTS.PWA_INSTALLED,
      notification_permission_granted: ANALYTICS_EVENTS.NOTIFICATION_PERMISSION_GRANTED,
    }

    this.track(eventMap[action], {
      platform: navigator.platform,
    })
  }
}

// Global analytics instance
export const analytics = new Analytics()

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEventView: analytics.trackEventView.bind(analytics),
    trackEventRegistration: analytics.trackEventRegistration.bind(analytics),
    trackRegistrationSuccess: analytics.trackRegistrationSuccess.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackAuth: analytics.trackAuth.bind(analytics),
    trackPWA: analytics.trackPWA.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
  }
}
