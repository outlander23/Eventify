"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth"
import { Search, Plus, Download, Edit, Trash2, Eye, Calendar, MapPin, Users, DollarSign, ArrowLeft } from "lucide-react"

export default function AdminEvents() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedEvents, setSelectedEvents] = useState([])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/")
    }
  }, [isAuthenticated, isLoading, user, navigate])

  // Mock events data
  const allEvents = [
    {
      id: 1,
      title: "Next.js Conference 2024",
      category: "Technology",
      date: "2024-12-15",
      time: "09:00",
      location: "San Francisco, CA",
      registrations: 245,
      capacity: 300,
      revenue: 0,
      status: "active",
      createdAt: "2024-11-01",
    },
    {
      id: 2,
      title: "Startup Pitch Night",
      category: "Business",
      date: "2024-12-18",
      time: "19:00",
      location: "New York, NY",
      registrations: 142,
      capacity: 150,
      revenue: 3550,
      status: "active",
    },
    {
      id: 3,
      title: "Digital Art Workshop",
      category: "Arts & Culture",
      date: "2024-12-20",
      time: "14:00",
      location: "Los Angeles, CA",
      registrations: 50,
      capacity: 50,
      revenue: 3750,
      status: "sold_out",
    },
    {
      id: 4,
      title: "React Meetup",
      category: "Technology",
      date: "2024-12-22",
      time: "18:30",
      location: "Austin, TX",
      registrations: 89,
      capacity: 120,
      revenue: 0,
      status: "active",
    },
    {
      id: 5,
      title: "Design Systems Workshop",
      category: "Design",
      date: "2024-09-20",
      time: "10:00",
      location: "Seattle, WA",
      registrations: 25,
      capacity: 30,
      revenue: 3750,
      status: "cancelled",
    },
  ]

  const categories = ["Technology", "Business", "Arts & Culture", "Design", "Health & Wellness"]

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "sold_out":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleSelectEvent = (eventId, checked) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, eventId])
    } else {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEvents(filteredEvents.map((event) => event.id))
    } else {
      setSelectedEvents([])
    }
  }

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for events:`, selectedEvents)
    setSelectedEvents([])
  }

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      console.log("Deleting event:", eventId)
    }
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
        <div className="container-app max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-h1 text-foreground mb-2">Manage Events</h1>
                <p className="text-body text-muted-foreground">Create, edit, and manage your events</p>
              </div>
              <Button asChild className="mt-4 md:mt-0">
                <Link to="/admin/events/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sold_out">Sold Out</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedEvents.length > 0 && (
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <span className="text-small text-muted-foreground">{selectedEvents.length} selected</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("publish")}>
                      Publish
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("unpublish")}>
                      Unpublish
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")} className="ml-2">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Events Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">
                        <Checkbox
                          checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left p-4 font-medium">Event</th>
                      <th className="text-left p-4 font-medium">Date & Time</th>
                      <th className="text-left p-4 font-medium">Location</th>
                      <th className="text-left p-4 font-medium">Registrations</th>
                      <th className="text-left p-4 font-medium">Revenue</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedEvents.includes(event.id)}
                            onCheckedChange={(checked) => handleSelectEvent(event.id, checked)}
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <h4 className="font-medium text-foreground">{event.title}</h4>
                            <p className="text-small text-muted-foreground">{event.category}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-small">
                            <Calendar className="w-4 h-4" />
                            <div>
                              <div>{new Date(event.date).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">{event.time}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-small">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-small">
                            <Users className="w-4 h-4" />
                            <div>
                              <div>
                                {event.registrations}/{event.capacity}
                              </div>
                              <div className="text-muted-foreground">
                                {Math.round((event.registrations / event.capacity) * 100)}% full
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-small">
                            <DollarSign className="w-4 h-4" />
                            {event.revenue === 0 ? "Free" : `$${event.revenue.toLocaleString()}`}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(event.status)}>{event.status.replace("_", " ")}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/events/${event.title.toLowerCase().replace(/\s+/g, "-")}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-h3 text-foreground mb-2">No events found</h3>
                  <p className="text-body text-muted-foreground mb-6">
                    {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                      ? "Try adjusting your search criteria"
                      : "Create your first event to get started"}
                  </p>
                  <Button asChild>
                    <Link to="/admin/events/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
