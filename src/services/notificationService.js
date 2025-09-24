class NotificationService {
  constructor() {
    this.isSupported = "Notification" in window;
    this.permission = Notification.permission;
  }

  // Check if notifications are supported
  isNotificationSupported() {
    return this.isSupported;
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error("Notifications are not supported");
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === "granted";
  }

  // Enable push notifications
  async enablePushNotifications(getAuthHeaders) {
    if (!this.isSupported || this.permission !== "granted") {
      throw new Error("Notifications not permitted");
    }

    try {
      // Just save that push is enabled for this user
      const response = await fetch(
        "http://localhost:5000/api/notification-preferences",
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            push_enabled: true,
            event_reminders: true,
            one_hour_before: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save notification preferences");
      }

      return true;
    } catch (error) {
      console.error("Error enabling push notifications:", error);
      throw error;
    }
  }

  // Disable push notifications
  async disablePushNotifications(getAuthHeaders) {
    try {
      await fetch("http://localhost:5000/api/notification-preferences", {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          push_enabled: false,
        }),
      });
    } catch (error) {
      console.error("Error disabling push notifications:", error);
      throw error;
    }
  }

  // Schedule event reminder (simplified)
  async scheduleEventReminder(event, getAuthHeaders) {
    if (!this.isSupported || this.permission !== "granted") {
      return;
    }

    try {
      const eventDate = new Date(event.date);
      const reminderTime = new Date(eventDate.getTime() - 60 * 60 * 1000); // 1 hour before
      const now = new Date();

      if (reminderTime > now) {
        // Just show local notification for now (simplified)
        setTimeout(() => {
          this.showLocalNotification(`Event Starting Soon!`, {
            body: `${event.title} starts in 1 hour at ${event.location}`,
            requireInteraction: true,
          });
        }, reminderTime.getTime() - now.getTime());
      }
    } catch (error) {
      console.error("Error scheduling event reminder:", error);
    }
  }

  // Schedule reminders for multiple events (user registrations)
  async scheduleUserEventReminders(events, getAuthHeaders) {
    for (const event of events) {
      await this.scheduleEventReminder(event, getAuthHeaders);
    }
  }

  // Send test notification (simplified)
  async sendTestNotification(getAuthHeaders) {
    try {
      // First try backend
      const response = await fetch(
        "http://localhost:5000/api/test-notification",
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        return await response.json();
      } else {
        // Fallback to local notification
        this.showLocalNotification("Test Notification", {
          body: "This is a test notification from Eventify!",
          icon: "/pwa-192x192.png",
        });
        return { message: "Local test notification sent" };
      }
    } catch (error) {
      // Fallback to local notification
      this.showLocalNotification("Test Notification", {
        body: "This is a test notification from Eventify!",
        icon: "/pwa-192x192.png",
      });
      return { message: "Local test notification sent" };
    }
  }

  // Show local notification
  showLocalNotification(title, options = {}) {
    if (this.permission === "granted") {
      return new Notification(title, {
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        tag: "eventify-notification",
        ...options,
      });
    }
  }

  // Get current notification preferences
  async getNotificationPreferences(getAuthHeaders) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notification-preferences",
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
    // Return defaults if backend fails
    return {
      push_enabled: false,
      event_reminders: true,
      one_hour_before: true,
    };
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
