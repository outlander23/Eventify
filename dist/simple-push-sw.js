// Simple service worker for basic notifications
console.log("Simple notification service worker loaded");

// Handle push events (if backend sends any)
self.addEventListener("push", function (event) {
  console.log("Push event received:", event);

  let notificationData = {};

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: "Eventify Notification",
        body: event.data.text() || "You have a new notification",
      };
    }
  }

  const title = notificationData.title || "Eventify";
  const options = {
    body: notificationData.body || "You have a new notification",
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    tag: "eventify-notification",
    requireInteraction: true,
    data: notificationData.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked:", event);

  event.notification.close();

  // Open the app
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
});

// Handle notification close
self.addEventListener("notificationclose", function (event) {
  console.log("Notification closed:", event.notification.tag);
});
