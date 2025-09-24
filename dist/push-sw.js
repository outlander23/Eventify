// Push notification service worker
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || data.message,
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
        eventId: data.eventId,
        type: data.type,
      },
      actions: [
        {
          action: "view",
          title: "View Event",
          icon: "/pwa-192x192.png",
        },
        {
          action: "dismiss",
          title: "Dismiss",
          icon: "/pwa-192x192.png",
        },
      ],
      requireInteraction: true,
      tag: data.tag || "eventify-notification",
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Eventify", options)
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "view") {
    // Open the event page
    const url = event.notification.data.url || "/";
    event.waitUntil(
      clients.matchAll().then(function (clients) {
        // Check if there's already a window/tab open with this URL
        for (let client of clients) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  } else if (event.action === "dismiss") {
    // Just close the notification (already handled above)
    console.log("Notification dismissed");
  } else {
    // Default click action - open the app
    event.waitUntil(
      clients.matchAll().then(function (clients) {
        if (clients.length > 0) {
          return clients[0].focus();
        }
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
    );
  }
});

self.addEventListener("notificationclose", function (event) {
  console.log("Notification closed:", event.notification.tag);
});

// Background sync for offline notification scheduling
self.addEventListener("sync", function (event) {
  if (event.tag === "eventify-reminder-sync") {
    event.waitUntil(syncEventReminders());
  }
});

async function syncEventReminders() {
  try {
    // Get pending reminders from IndexedDB or localStorage
    const pendingReminders = await getPendingReminders();

    for (const reminder of pendingReminders) {
      const now = new Date();
      const eventTime = new Date(reminder.eventDate);
      const reminderTime = new Date(eventTime.getTime() - 60 * 60 * 1000); // 1 hour before

      if (now >= reminderTime && now < eventTime) {
        // Show the reminder notification
        self.registration.showNotification(`Event Starting Soon!`, {
          body: `${reminder.eventTitle} starts in 1 hour at ${reminder.location}`,
          icon: "/pwa-192x192.png",
          badge: "/pwa-192x192.png",
          vibrate: [100, 50, 100],
          data: {
            url: `/events/${reminder.eventId}`,
            eventId: reminder.eventId,
            type: "event_reminder",
          },
          actions: [
            {
              action: "view",
              title: "View Event",
              icon: "/pwa-192x192.png",
            },
          ],
          requireInteraction: true,
          tag: `event-reminder-${reminder.eventId}`,
        });

        // Remove this reminder from pending list
        await removePendingReminder(reminder.id);
      }
    }
  } catch (error) {
    console.error("Error syncing event reminders:", error);
  }
}

// Helper functions for managing pending reminders
async function getPendingReminders() {
  // This would typically use IndexedDB for better offline storage
  // For now, using a simple approach
  return [];
}

async function removePendingReminder(reminderId) {
  // Remove from IndexedDB
  console.log("Removing reminder:", reminderId);
}

// Handle incoming messages from the main thread
self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SCHEDULE_REMINDER") {
    // Schedule a reminder for an event
    scheduleEventReminder(event.data.reminder);
  }
});

function scheduleEventReminder(reminder) {
  // Calculate when to show the reminder (1 hour before event)
  const eventTime = new Date(reminder.eventDate);
  const reminderTime = new Date(eventTime.getTime() - 60 * 60 * 1000);
  const now = new Date();

  if (reminderTime > now) {
    // Schedule the reminder
    const delay = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      self.registration.showNotification(`Event Starting Soon!`, {
        body: `${reminder.eventTitle} starts in 1 hour`,
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        vibrate: [100, 50, 100],
        data: {
          url: `/events/${reminder.eventId}`,
          eventId: reminder.eventId,
          type: "event_reminder",
        },
        actions: [
          {
            action: "view",
            title: "View Event",
          },
        ],
        requireInteraction: true,
        tag: `event-reminder-${reminder.eventId}`,
      });
    }, delay);
  }
}
