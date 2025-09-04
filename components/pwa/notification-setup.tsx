"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, CheckCircle, AlertCircle } from "lucide-react"
import { usePWA } from "./pwa-provider"

export function NotificationSetup() {
  const { notificationPermission, requestNotifications } = usePWA()
  const [isRequesting, setIsRequesting] = useState(false)
  const [preferences, setPreferences] = useState({
    eventReminders: true,
    newEvents: false,
    registrationUpdates: true,
    adminNotifications: false,
  })

  const handleRequestPermission = async () => {
    setIsRequesting(true)
    try {
      await requestNotifications()
    } finally {
      setIsRequesting(false)
    }
  }

  const getPermissionStatus = () => {
    switch (notificationPermission) {
      case "granted":
        return { icon: CheckCircle, text: "Notifications Enabled", color: "text-success" }
      case "denied":
        return { icon: BellOff, text: "Notifications Blocked", color: "text-destructive" }
      default:
        return { icon: Bell, text: "Enable Notifications", color: "text-muted-foreground" }
    }
  }

  const status = getPermissionStatus()
  const StatusIcon = status.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
            <span className="text-sm font-medium">{status.text}</span>
          </div>

          {notificationPermission === "default" && (
            <Button size="sm" onClick={handleRequestPermission} disabled={isRequesting}>
              {isRequesting ? "Requesting..." : "Enable"}
            </Button>
          )}
        </div>

        {/* Notification Preferences */}
        {notificationPermission === "granted" && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Notification Preferences</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="eventReminders" className="text-sm">
                  Event Reminders
                </Label>
                <Switch
                  id="eventReminders"
                  checked={preferences.eventReminders}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, eventReminders: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="newEvents" className="text-sm">
                  New Events
                </Label>
                <Switch
                  id="newEvents"
                  checked={preferences.newEvents}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, newEvents: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="registrationUpdates" className="text-sm">
                  Registration Updates
                </Label>
                <Switch
                  id="registrationUpdates"
                  checked={preferences.registrationUpdates}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, registrationUpdates: checked }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Blocked State Help */}
        {notificationPermission === "denied" && (
          <div className="p-3 bg-destructive/10 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Notifications Blocked</p>
                <p className="text-muted-foreground mt-1">
                  To enable notifications, please allow them in your browser settings.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
