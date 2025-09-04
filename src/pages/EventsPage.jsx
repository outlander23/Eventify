"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react"
import { Link } from "react-router-dom"

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Next.js Conference 2024",
      category: "Technology",
      date: "2024-12-15",
      time: "09:00",
      location: "San Francisco, CA",
      registered: 245,
      capacity: 300,
      price: 0,
      slug: "nextjs-conference-2024",
      image: "/tech-conference-stage.jpg",
      description:
        "Join us for the biggest Next.js conference of the year with industry leaders and cutting-edge talks.",
    },
    {
      id: 2,
      title: "Startup Pitch Night",
      category: "Business",
      date: "2024-12-18",
      time: "19:00",
      location: "New York, NY",
      registered: 142,
      capacity: 150,
      price: 25,
      slug: "startup-pitch-night",
      image: "/business-presentation-pitch.jpg",
      description: "Watch innovative startups pitch their ideas to top investors and network with entrepreneurs.",
    },
    {
      id: 3,
      title: "Digital Art Workshop",
      category: "Arts & Culture",
      date: "2024-12-20",
      time: "14:00",
      location: "Los Angeles, CA",
      registered: 50,
      capacity: 50,
      price: 75,
      slug: "digital-art-workshop",
      image: "/digital-art-workshop-creative.jpg",
      description: "Learn advanced digital art techniques from professional artists in this hands-on workshop.",
    },
    {
      id: 4,
      title: "React Meetup",
      category: "Technology",
      date: "2024-12-22",
      time: "18:30",
      location: "Austin, TX",
      registered: 89,
      capacity: 120,
      price: 0,
      slug: "react-meetup",
      image: "/react-meetup-developers.jpg",
      description: "Monthly React meetup featuring talks on hooks, performance optimization, and new features.",
    },
  ]

  const categories = ["Technology", "Business", "Arts & Culture", "Health & Wellness", "Education"]
  const locations = ["San Francisco, CA", "New York, NY", "Los Angeles, CA", "Austin, TX", "Seattle, WA"]

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesLocation = selectedLocation === "all" || event.location === selectedLocation
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "free" && event.price === 0) ||
      (priceFilter === "paid" && event.price > 0)

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-12">
          <div className="container-app">
            <div className="max-w-2xl">
              <h1 className="text-h1 text-foreground mb-4">Discover Events</h1>
              <p className="text-body text-muted-foreground">
                Find amazing events happening near you. From tech conferences to art workshops, there's something for
                everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 border-b">
          <div className="container-app">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
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

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4">
              <p className="text-small text-muted-foreground">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-12">
          <div className="container-app">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="card-elevated hover:shadow-lg transition-page cursor-pointer group">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-page"
                      />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {event.category}
                        </Badge>
                        <span className="text-small text-green-600 font-medium">
                          {event.price === 0 ? "Free" : `$${event.price}`}
                        </span>
                      </div>

                      <h3 className="text-h3 text-foreground text-balance group-hover:text-primary transition-micro">
                        {event.title}
                      </h3>

                      <p className="text-small text-muted-foreground line-clamp-2">{event.description}</p>

                      <div className="space-y-2 text-small text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(event.date).toLocaleDateString()} • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {event.registered} registered • {event.capacity - event.registered} spots left
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-primary hover:bg-primary/90" asChild>
                          <Link to={`/events/${event.slug}`}>Register</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/events/${event.slug}`}>Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-h3 text-foreground mb-2">No events found</h3>
                  <p className="text-body text-muted-foreground mb-6">
                    Try adjusting your search criteria or browse all events.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      setSelectedLocation("all")
                      setPriceFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
