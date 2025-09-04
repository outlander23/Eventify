"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { ArrowLeft, Save, Eye, Upload, Plus, X } from "lucide-react"

export default function AdminCreateEvent() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    date: "",
    time: "",
    endTime: "",
    timezone: "America/New_York",
    location: "",
    address: "",
    capacity: "",
    price: "",
    earlyBirdPrice: "",
    earlyBirdDeadline: "",
    tags: [],
    requiresApproval: false,
    allowWaitlist: true,
    isPublic: true,
    enableRefunds: true,
    refundDeadline: "",
  })
  const [tickets, setTickets] = useState([
    { id: 1, name: "General Admission", price: 0, capacity: 100, description: "" },
  ])
  const [currentTag, setCurrentTag] = useState("")

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/")
    }
  }, [isAuthenticated, isLoading, user, navigate])

  const categories = ["Technology", "Business", "Arts & Culture", "Design", "Health & Wellness", "Education"]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }))
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }))
  }

  const handleAddTicket = () => {
    const newTicket = {
      id: Date.now(),
      name: "",
      price: 0,
      capacity: 50,
      description: "",
    }
    setTickets([...tickets, newTicket])
  }

  const handleUpdateTicket = (ticketId, field, value) => {
    setTickets(tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, [field]: value } : ticket)))
  }

  const handleRemoveTicket = (ticketId) => {
    if (tickets.length > 1) {
      setTickets(tickets.filter((ticket) => ticket.id !== ticketId))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // In real app, submit to API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Event created:", { ...formData, tickets })
      navigate("/admin/events")
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSaveDraft = async () => {
    console.log("Saving draft:", { ...formData, tickets })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-app max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate("/admin/events")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-h1 text-foreground mb-2">Create New Event</h1>
                <p className="text-body text-muted-foreground">Fill in the details to create your event</p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="tickets">Tickets</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="title">Event Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="Enter event title"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Short Description *</Label>
                          <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Brief description for event cards"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="longDescription">Full Description</Label>
                          <textarea
                            id="longDescription"
                            value={formData.longDescription}
                            onChange={(e) => handleInputChange("longDescription", e.target.value)}
                            placeholder="Detailed event description..."
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            rows={6}
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange("category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Tags</Label>
                          <div className="flex gap-2 mb-2">
                            <Input
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              placeholder="Add a tag"
                              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                            />
                            <Button type="button" onClick={handleAddTag}>
                              Add
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                              <div
                                key={tag}
                                className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                              >
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="h-4 w-4 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="details" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Event Date *</Label>
                            <Input
                              id="date"
                              type="date"
                              value={formData.date}
                              onChange={(e) => handleInputChange("date", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="time">Start Time *</Label>
                            <Input
                              id="time"
                              type="time"
                              value={formData.time}
                              onChange={(e) => handleInputChange("time", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                              id="endTime"
                              type="time"
                              value={formData.endTime}
                              onChange={(e) => handleInputChange("endTime", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select
                              value={formData.timezone}
                              onValueChange={(value) => handleInputChange("timezone", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                                <SelectItem value="America/Chicago">Central Time</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="Event venue or online"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="address">Full Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Street address, city, state, zip"
                          />
                        </div>

                        <div>
                          <Label htmlFor="capacity">Total Capacity *</Label>
                          <Input
                            id="capacity"
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => handleInputChange("capacity", e.target.value)}
                            placeholder="Maximum number of attendees"
                            required
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tickets" className="mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Ticket Types</CardTitle>
                        <Button type="button" onClick={handleAddTicket}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Ticket
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {tickets.map((ticket, index) => (
                          <div key={ticket.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Ticket {index + 1}</h4>
                              {tickets.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveTicket(ticket.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Ticket Name</Label>
                                <Input
                                  value={ticket.name}
                                  onChange={(e) => handleUpdateTicket(ticket.id, "name", e.target.value)}
                                  placeholder="e.g., General Admission"
                                />
                              </div>
                              <div>
                                <Label>Price ($)</Label>
                                <Input
                                  type="number"
                                  value={ticket.price}
                                  onChange={(e) =>
                                    handleUpdateTicket(ticket.id, "price", Number.parseFloat(e.target.value) || 0)
                                  }
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Capacity</Label>
                                <Input
                                  type="number"
                                  value={ticket.capacity}
                                  onChange={(e) =>
                                    handleUpdateTicket(ticket.id, "capacity", Number.parseInt(e.target.value) || 0)
                                  }
                                  placeholder="50"
                                />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Input
                                  value={ticket.description}
                                  onChange={(e) => handleUpdateTicket(ticket.id, "description", e.target.value)}
                                  placeholder="Optional description"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Public Event</Label>
                            <div className="text-small text-muted-foreground">Make this event visible to everyone</div>
                          </div>
                          <Checkbox
                            checked={formData.isPublic}
                            onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Requires Approval</Label>
                            <div className="text-small text-muted-foreground">Manually approve registrations</div>
                          </div>
                          <Checkbox
                            checked={formData.requiresApproval}
                            onCheckedChange={(checked) => handleInputChange("requiresApproval", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Allow Waitlist</Label>
                            <div className="text-small text-muted-foreground">Enable waitlist when sold out</div>
                          </div>
                          <Checkbox
                            checked={formData.allowWaitlist}
                            onCheckedChange={(checked) => handleInputChange("allowWaitlist", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Enable Refunds</Label>
                            <div className="text-small text-muted-foreground">Allow attendees to request refunds</div>
                          </div>
                          <Checkbox
                            checked={formData.enableRefunds}
                            onCheckedChange={(checked) => handleInputChange("enableRefunds", checked)}
                          />
                        </div>

                        {formData.enableRefunds && (
                          <div>
                            <Label htmlFor="refundDeadline">Refund Deadline</Label>
                            <Input
                              id="refundDeadline"
                              type="date"
                              value={formData.refundDeadline}
                              onChange={(e) => handleInputChange("refundDeadline", e.target.value)}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Preview Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Event Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{formData.title || "Event Title"}</h3>
                        <p className="text-small text-muted-foreground mt-1">
                          {formData.description || "Event description will appear here"}
                        </p>
                      </div>
                      <div className="space-y-2 text-small">
                        <div>
                          <strong>Date:</strong> {formData.date ? new Date(formData.date).toLocaleDateString() : "TBD"}
                        </div>
                        <div>
                          <strong>Time:</strong> {formData.time || "TBD"}
                        </div>
                        <div>
                          <strong>Location:</strong> {formData.location || "TBD"}
                        </div>
                        <div>
                          <strong>Capacity:</strong> {formData.capacity || "TBD"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/events")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
