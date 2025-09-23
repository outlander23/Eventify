"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/Card"
import Button from "../components/Button"
import Input from "../components/Input"
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react"

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEvents, setFilteredEvents] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    // Filter events based on search term
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredEvents(filtered)
  }, [events, searchTerm])

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        console.error("Failed to fetch events")
        // Mock data for development
        setEvents(mockEvents)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      // Mock data for development
      setEvents(mockEvents)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAvailableSpots = (capacity, registrations) => {
    return capacity - (registrations || 0)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Discover Events</h1>
        <p className="text-muted-foreground mb-6">Find and register for exciting events happening near you.</p>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? "No events found" : "No events available"}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms or clear the search to see all events."
              : "Check back later for new events or contact an administrator."}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-balance">{event.title}</CardTitle>
                <CardDescription className="text-pretty">{event.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(event.date)}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {getAvailableSpots(event.capacity, event.registrations)} spots left
                  </div>
                  <div className="text-sm font-medium text-foreground">{event.capacity} total capacity</div>
                </div>

                {getAvailableSpots(event.capacity, event.registrations) === 0 && (
                  <div className="bg-red-950 border border-red-800 rounded-md p-2">
                    <p className="text-sm text-red-400 text-center">Event Full</p>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Link to={`/events/${event.id}`} className="w-full">
                  <Button className="w-full" disabled={getAvailableSpots(event.capacity, event.registrations) === 0}>
                    {getAvailableSpots(event.capacity, event.registrations) === 0 ? "Event Full" : "View Details"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Mock data for development
const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2025",
    description:
      "Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.",
    date: "2025-03-15T09:00:00",
    location: "San Francisco Convention Center",
    capacity: 500,
    registrations: 342,
  },
  {
    id: 2,
    title: "Web Development Workshop",
    description: "Learn modern web development techniques with React, Node.js, and cloud deployment strategies.",
    date: "2025-02-20T14:00:00",
    location: "Tech Hub Downtown",
    capacity: 50,
    registrations: 35,
  },
  {
    id: 3,
    title: "Startup Networking Event",
    description:
      "Connect with fellow entrepreneurs, investors, and startup enthusiasts in a casual networking environment.",
    date: "2025-02-28T18:00:00",
    location: "Innovation Center",
    capacity: 100,
    registrations: 67,
  },
  {
    id: 4,
    title: "AI & Machine Learning Summit",
    description:
      "Explore the latest developments in artificial intelligence and machine learning with expert speakers.",
    date: "2025-04-10T10:00:00",
    location: "University Auditorium",
    capacity: 200,
    registrations: 200,
  },
  {
    id: 5,
    title: "Design Thinking Workshop",
    description: "Master the principles of design thinking and user experience design in this hands-on workshop.",
    date: "2025-03-05T13:00:00",
    location: "Creative Studio",
    capacity: 30,
    registrations: 18,
  },
  {
    id: 6,
    title: "Digital Marketing Masterclass",
    description: "Learn advanced digital marketing strategies including SEO, social media, and content marketing.",
    date: "2025-03-22T11:00:00",
    location: "Business Center",
    capacity: 75,
    registrations: 42,
  },
]

export default Events
