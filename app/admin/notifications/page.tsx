"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Send, Bell, Mail, Users, Eye, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock notification history
const notificationHistory = [
  {
    id: 1,
    title: "Event Reminder: Tech Conference 2024",
    type: "push",
    audience: "Tech Conference 2024 attendees",
    sent: "2024-02-20 10:30 AM",
    delivered: 156,
    opened: 89,
    status: "delivered",
  },
  {
    id: 2,
    title: "Welcome to EventHub!",
    type: "email",
    audience: "New registrations",
    sent: "2024-02-19 2:15 PM",
    delivered: 23,
    opened: 18,
    status: "delivered",
  },
  {
    id: 3,
    title: "Last chance to register!",
    type: "push",
    audience: "All users",
    sent: "Scheduled for 2024-02-25 9:00 AM",
    delivered: 0,
    opened: 0,
    status: "scheduled",
  },
]

export default function AdminNotifications() {
  const [notificationData, setNotificationData] = useState({
    type: "push",
    audience: "all",
    eventId: "",
    title: "",
    message: "",
    actionUrl: "",
    scheduleType: "now",
    scheduleDate: "",
    scheduleTime: "",
  })

  const [previewMode, setPreviewMode] = useState(false)

  const handleSend = () => {
    console.log("Sending notification:", notificationData)
    // Handle notification sending logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">Send push notifications and emails to your attendees</p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Compose Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Compose Notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notification Type */}
                  <div>
                    <Label>Notification Type</Label>
                    <Select
                      value={notificationData.type}
                      onValueChange={(value) => setNotificationData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="push">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Push Notification
                          </div>
                        </SelectItem>
                        <SelectItem value="email">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Audience Selection */}
                  <div>
                    <Label>Audience</Label>
                    <Select
                      value={notificationData.audience}
                      onValueChange={(value) => setNotificationData((prev) => ({ ...prev, audience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="event">Specific Event Attendees</SelectItem>
                        <SelectItem value="new">New Registrations (Last 7 days)</SelectItem>
                        <SelectItem value="inactive">Inactive Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Event Selection (if audience is event) */}
                  {notificationData.audience === "event" && (
                    <div>
                      <Label>Select Event</Label>
                      <Select
                        value={notificationData.eventId}
                        onValueChange={(value) => setNotificationData((prev) => ({ ...prev, eventId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Tech Conference 2024</SelectItem>
                          <SelectItem value="2">Digital Art Workshop</SelectItem>
                          <SelectItem value="3">React Meetup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Message Content */}
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder={notificationData.type === "push" ? "Push notification title" : "Email subject"}
                      value={notificationData.title}
                      onChange={(e) => setNotificationData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder={notificationData.type === "push" ? "Push notification message" : "Email content"}
                      rows={notificationData.type === "email" ? 6 : 3}
                      value={notificationData.message}
                      onChange={(e) => setNotificationData((prev) => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  {notificationData.type === "push" && (
                    <div>
                      <Label htmlFor="actionUrl">Action URL (Optional)</Label>
                      <Input
                        id="actionUrl"
                        placeholder="https://eventhub.com/events/..."
                        value={notificationData.actionUrl}
                        onChange={(e) => setNotificationData((prev) => ({ ...prev, actionUrl: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">URL to open when notification is tapped</p>
                    </div>
                  )}

                  {/* Scheduling */}
                  <div className="space-y-4">
                    <Label>Scheduling</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="now"
                          name="schedule"
                          value="now"
                          checked={notificationData.scheduleType === "now"}
                          onChange={(e) => setNotificationData((prev) => ({ ...prev, scheduleType: e.target.value }))}
                        />
                        <Label htmlFor="now">Send Now</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="schedule"
                          name="schedule"
                          value="schedule"
                          checked={notificationData.scheduleType === "schedule"}
                          onChange={(e) => setNotificationData((prev) => ({ ...prev, scheduleType: e.target.value }))}
                        />
                        <Label htmlFor="schedule">Schedule for Later</Label>
                      </div>
                    </div>

                    {notificationData.scheduleType === "schedule" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="scheduleDate">Date</Label>
                          <Input
                            id="scheduleDate"
                            type="date"
                            value={notificationData.scheduleDate}
                            onChange={(e) => setNotificationData((prev) => ({ ...prev, scheduleDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="scheduleTime">Time</Label>
                          <Input
                            id="scheduleTime"
                            type="time"
                            value={notificationData.scheduleTime}
                            onChange={(e) => setNotificationData((prev) => ({ ...prev, scheduleTime: e.target.value }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSend} className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      {notificationData.scheduleType === "now" ? "Send Now" : "Schedule"}
                    </Button>
                    <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {notificationData.type === "push" ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Bell className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{notificationData.title || "Notification Title"}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notificationData.message || "Your notification message will appear here..."}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">EventHub • now</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <p>
                          Estimated reach: <span className="font-medium">~1,200 users</span>
                        </p>
                        <p>
                          Delivery time: <span className="font-medium">~30 seconds</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-border rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-2">
                          From: EventHub &lt;noreply@eventhub.com&gt;
                        </div>
                        <div className="text-xs text-muted-foreground mb-4">
                          Subject: {notificationData.title || "Email Subject"}
                        </div>
                        <div className="text-sm">
                          {notificationData.message || "Your email content will appear here..."}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <p>
                          Estimated reach: <span className="font-medium">~1,200 users</span>
                        </p>
                        <p>
                          Delivery time: <span className="font-medium">~5 minutes</span>
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationHistory.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {notification.type === "push" ? (
                            <Bell className="w-4 h-4 text-primary" />
                          ) : (
                            <Mail className="w-4 h-4 text-primary" />
                          )}
                          <h3 className="font-medium">{notification.title}</h3>
                        </div>
                        <Badge
                          variant={
                            notification.status === "delivered"
                              ? "default"
                              : notification.status === "scheduled"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {notification.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {notification.audience}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.sent}
                        </div>
                        {notification.status === "delivered" && (
                          <>
                            <span>Delivered: {notification.delivered}</span>
                            <span>Opened: {notification.opened}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
