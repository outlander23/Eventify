const CACHE_NAME = "eventhub-v1"
const STATIC_CACHE = "eventhub-static-v1"
const DYNAMIC_CACHE = "eventhub-dynamic-v1"

// Static assets to precache
const STATIC_ASSETS = [
  "/",
  "/events",
  "/account",
  "/auth",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.jpg",
  "/icons/icon-512x512.jpg",
]

// API endpoints that should use network-first strategy
const API_ENDPOINTS = ["/api/events", "/api/auth", "/api/registrations"]

// Install event - precache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Precaching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("[SW] Static assets cached")
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("[SW] Service worker activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return
  }

  // Handle API requests with network-first strategy
  if (API_ENDPOINTS.some((endpoint) => url.pathname.startsWith(endpoint))) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Handle static assets with cache-first strategy
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith("/icons/")) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Handle images with cache-first strategy
  if (request.destination === "image") {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Handle navigation requests with network-first, fallback to offline page
  if (request.mode === "navigate") {
    event.respondWith(navigationStrategy(request))
    return
  }

  // Default: network-first for everything else
  event.respondWith(networkFirstStrategy(request))
})

// Network-first strategy with cache fallback
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Network failed, trying cache:", request.url)
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline fallback for failed requests
    return new Response(JSON.stringify({ error: "Offline", message: "This content is not available offline" }), {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "application/json" },
    })
  }
}

// Cache-first strategy with network fallback
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Both cache and network failed for:", request.url)
    return new Response("Resource not available offline", { status: 503 })
  }
}

// Navigation strategy with offline fallback
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    console.log("[SW] Navigation failed, serving offline page")
    const offlinePage = await caches.match("/offline")
    return offlinePage || new Response("Offline", { status: 503 })
  }
}

// Background sync for registration queue
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag)

  if (event.tag === "registration-sync") {
    event.waitUntil(syncRegistrations())
  }
})

// Sync queued registrations
async function syncRegistrations() {
  try {
    const db = await openDB()
    const tx = db.transaction(["registrations"], "readonly")
    const store = tx.objectStore("registrations")
    const queuedRegistrations = await store.getAll()

    for (const registration of queuedRegistrations) {
      try {
        const response = await fetch("/api/registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registration.data),
        })

        if (response.ok) {
          // Remove from queue after successful sync
          const deleteTx = db.transaction(["registrations"], "readwrite")
          const deleteStore = deleteTx.objectStore("registrations")
          await deleteStore.delete(registration.id)

          // Notify client of successful sync
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "REGISTRATION_SYNCED",
                registrationId: registration.id,
              })
            })
          })
        }
      } catch (error) {
        console.log("[SW] Failed to sync registration:", error)
      }
    }
  } catch (error) {
    console.log("[SW] Background sync failed:", error)
  }
}

// Push notification handler
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received")

  const options = {
    body: "You have a new notification from EventHub",
    icon: "/icons/icon-192x192.jpg",
    badge: "/icons/icon-96x96.jpg",
    vibrate: [200, 100, 200],
    data: {
      url: "/",
    },
    actions: [
      {
        action: "open",
        title: "Open EventHub",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  }

  if (event.data) {
    const payload = event.data.json()
    options.body = payload.body || options.body
    options.data.url = payload.url || options.data.url
  }

  event.waitUntil(self.registration.showNotification("EventHub", options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked")

  event.notification.close()

  if (event.action === "close") {
    return
  }

  const url = event.notification.data?.url || "/"

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      // Check if there's already a window open
      for (const client of clients) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }

      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    }),
  )
})

// IndexedDB helper for offline queue
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("EventHubDB", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      if (!db.objectStoreNames.contains("registrations")) {
        const store = db.createObjectStore("registrations", { keyPath: "id", autoIncrement: true })
        store.createIndex("timestamp", "timestamp", { unique: false })
      }
    }
  })
}
