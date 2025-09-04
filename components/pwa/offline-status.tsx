"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WifiOff, Wifi, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface QueuedItem {
  id: string
  type: "registration" | "update"
  title: string
  status: "pending" | "syncing" | "error"
  timestamp: number
}

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)
  const [queuedItems, setQueuedItems] = useState<QueuedItem[]>([])
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    // Initial online status
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      setLastSync(new Date())
      // Trigger background sync
      if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register("registration-sync")
        })
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Listen for service worker messages
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "REGISTRATION_SYNCED") {
          setQueuedItems((prev) => prev.filter((item) => item.id !== event.data.registrationId))
          setLastSync(new Date())
        }
      })
    }

    // Load queued items from localStorage (mock)
    const loadQueuedItems = () => {
      const stored = localStorage.getItem("offline-queue")
      if (stored) {
        setQueuedItems(JSON.parse(stored))
      }
    }

    loadQueuedItems()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const retrySync = async () => {
    if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register("registration-sync")
      } catch (error) {
        console.error("Failed to register sync:", error)
      }
    }
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4 text-destructive" />
    if (queuedItems.length > 0) return <Clock className="w-4 h-4 text-warning" />
    return <Wifi className="w-4 h-4 text-success" />
  }

  const getStatusText = () => {
    if (!isOnline) return "Offline"
    if (queuedItems.length > 0) return `${queuedItems.length} pending`
    return "Online"
  }

  return (
    <>
      {/* Status Indicator */}
      <Button variant="ghost" size="sm" onClick={() => setShowStatus(!showStatus)} className="gap-2">
        {getStatusIcon()}
        <span className="hidden sm:inline">{getStatusText()}</span>
      </Button>

      {/* Status Panel */}
      {showStatus && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  {getStatusIcon()}
                  Connection Status
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowStatus(false)}>
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                {/* Connection Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Network Status</span>
                  <Badge variant={isOnline ? "default" : "destructive"}>{isOnline ? "Connected" : "Offline"}</Badge>
                </div>

                {lastSync && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Sync</span>
                    <span className="text-sm text-muted-foreground">{lastSync.toLocaleTimeString()}</span>
                  </div>
                )}

                {/* Queued Items */}
                {queuedItems.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending Actions</span>
                      <Button variant="outline" size="sm" onClick={retrySync}>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {queuedItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            {item.status === "pending" && <Clock className="w-3 h-3 text-warning" />}
                            {item.status === "syncing" && <RefreshCw className="w-3 h-3 text-primary animate-spin" />}
                            {item.status === "error" && <AlertCircle className="w-3 h-3 text-destructive" />}
                            <span>{item.title}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Pending Items */}
                {queuedItems.length === 0 && isOnline && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">All synced up!</p>
                  </div>
                )}

                {/* Offline Message */}
                {!isOnline && (
                  <div className="text-center py-4">
                    <WifiOff className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      You're offline. Actions will sync when connection is restored.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
