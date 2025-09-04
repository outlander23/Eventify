"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, Upload, Plus, X, Calendar, MapPin, DollarSign } from "lucide-react"

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    timezone: "UTC",
    location: "",
    isOnline: false,
    onlineLink: "",
    capacity: "",
    visibility: "public",
    registrationDeadline: "",
    tags: [] as string[],
    tickets: [{ name: "General Admission", price: "0", capacity: "", description: "" }],
  })

  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !eventData.tags.includes(newTag.trim())) {
      setEventData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEventData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addTicketType = () => {
    setEventData((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { name: "", price: "0", capacity: "", description: "" }],
    }))
  }

  const removeTicketType = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index),
    }))
  }

  const updateTicket = (index: number, field: string, value: string) => {
    setEventData((prev) => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) => (i === index ? { ...ticket, [field]: value } : ticket)),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Event</h1>
          <p className="text-muted-foreground mt-1">Set up a new event with all the details</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      value={eventData.title}
                      onChange={(e) => setEventData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event..."
                      rows={4}
                      value={eventData.description}
                      onChange={(e) => setEventData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={eventData.category}
                      onValueChange={(value) => setEventData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="arts">Arts & Culture</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="sports">Sports & Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {eventData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button onClick={() => removeTag(tag)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Cover Image</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x600px, JPG or PNG</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={eventData.startDate}
                        onChange={(e) => setEventData((prev) => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={eventData.startTime}
                        onChange={(e) => setEventData((prev) => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={eventData.endDate}
                        onChange={(e) => setEventData((prev) => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={eventData.endTime}
                        onChange={(e) => setEventData((prev) => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={eventData.timezone}
                      onValueChange={(value) => setEventData((prev) => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isOnline"
                      checked={eventData.isOnline}
                      onCheckedChange={(checked) => setEventData((prev) => ({ ...prev, isOnline: checked }))}
                    />
                    <Label htmlFor="isOnline">This is an online event</Label>
                  </div>

                  {eventData.isOnline ? (
                    <div>
                      <Label htmlFor="onlineLink">Online Event Link</Label>
                      <Input
                        id="onlineLink"
                        placeholder="https://zoom.us/j/..."
                        value={eventData.onlineLink}
                        onChange={(e) => setEventData((prev) => ({ ...prev, onlineLink: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="location">Venue Address *</Label>
                      <Textarea
                        id="location"
                        placeholder="Enter venue address"
                        value={eventData.location}
                        onChange={(e) => setEventData((prev) => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Ticket Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {eventData.tickets.map((ticket, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Ticket Type {index + 1}</h4>
                        {eventData.tickets.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removeTicketType(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Ticket Name *</Label>
                          <Input
                            placeholder="e.g., General Admission"
                            value={ticket.name}
                            onChange={(e) => updateTicket(index, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Price ($) *</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={ticket.price}
                            onChange={(e) => updateTicket(index, "price", e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Capacity</Label>
                        <Input
                          type="number"
                          placeholder="Unlimited"
                          value={ticket.capacity}
                          onChange={(e) => updateTicket(index, "capacity", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe what's included..."
                          value={ticket.description}
                          onChange={(e) => updateTicket(index, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addTicketType} className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="capacity">Total Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Unlimited"
                      value={eventData.capacity}
                      onChange={(e) => setEventData((prev) => ({ ...prev, capacity: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={eventData.visibility}
                      onValueChange={(value) => setEventData((prev) => ({ ...prev, visibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can find and register</SelectItem>
                        <SelectItem value="unlisted">Unlisted - Only people with link can register</SelectItem>
                        <SelectItem value="private">Private - Invitation only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                    <Input
                      id="registrationDeadline"
                      type="datetime-local"
                      value={eventData.registrationDeadline}
                      onChange={(e) => setEventData((prev) => ({ ...prev, registrationDeadline: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Cover Image</span>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{eventData.title || "Event Title"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {eventData.description || "Event description will appear here..."}
                  </p>
                </div>

                {eventData.startDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    {eventData.startDate} {eventData.startTime}
                  </div>
                )}

                {(eventData.location || eventData.onlineLink) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    {eventData.isOnline ? "Online Event" : eventData.location || "Location TBD"}
                  </div>
                )}

                {eventData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {eventData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
