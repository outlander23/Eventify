"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EventCard } from "@/components/events/event-card"
import { EventFilters } from "@/components/events/event-filters"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

// Mock data - in real app this would come from API
const mockEvents = [
  {
    id: "1",
    title: "Next.js Conference 2024",
    description:
      "Join us for the biggest Next.js conference of the year with talks from the core team and community leaders.",
    category: "Technology",
    date: "Dec 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "San Francisco, CA",
    price: 0,
    currency: "$",
    capacity: 300,
    registered: 245,
    image: "/tech-conference-stage.jpg",
    slug: "nextjs-conference-2024",
  },
  {
    id: "2",
    title: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to a panel of experienced investors and entrepreneurs.",
    category: "Business",
    date: "Dec 18, 2024",
    time: "7:00 PM - 10:00 PM",
    location: "New York, NY",
    price: 25,
    currency: "$",
    capacity: 150,
    registered: 142,
    image: "/business-presentation-pitch.jpg",
    slug: "startup-pitch-night",
  },
  {
    id: "3",
    title: "Digital Art Workshop",
    description: "Learn digital art techniques from professional artists in this hands-on workshop.",
    category: "Arts & Culture",
    date: "Dec 20, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Los Angeles, CA",
    price: 75,
    currency: "$",
    capacity: 50,
    registered: 50,
    image: "/digital-art-workshop-creative.jpg",
    slug: "digital-art-workshop",
  },
  {
    id: "4",
    title: "React Meetup",
    description: "Monthly React meetup with talks about the latest features and best practices.",
    category: "Technology",
    date: "Dec 22, 2024",
    time: "6:30 PM - 9:00 PM",
    location: "Austin, TX",
    price: 0,
    currency: "$",
    capacity: 100,
    registered: 67,
    image: "/react-meetup-developers.jpg",
    slug: "react-meetup-december",
  },
  {
    id: "5",
    title: "Food & Wine Festival",
    description: "Taste amazing food and wine from local restaurants and wineries.",
    category: "Food & Drink",
    date: "Dec 25, 2024",
    time: "12:00 PM - 8:00 PM",
    location: "Chicago, IL",
    price: 45,
    currency: "$",
    capacity: 500,
    registered: 234,
    image: "/food-wine-festival-outdoor.jpg",
    slug: "food-wine-festival",
  },
  {
    id: "6",
    title: "Yoga & Meditation Retreat",
    description: "A peaceful day of yoga, meditation, and mindfulness practices.",
    category: "Health & Wellness",
    date: "Dec 28, 2024",
    time: "8:00 AM - 4:00 PM",
    location: "Seattle, WA",
    price: 120,
    currency: "$",
    capacity: 30,
    registered: 28,
    image: "/yoga-meditation-peaceful-nature.jpg",
    slug: "yoga-meditation-retreat",
  },
]

export default function EventsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 9
  const totalPages = Math.ceil(mockEvents.length / eventsPerPage)

  const startIndex = (currentPage - 1) * eventsPerPage
  const currentEvents = mockEvents.slice(startIndex, startIndex + eventsPerPage)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-12 bg-surface border-b border-border">
          <div className="container-app">
            <div className="max-w-3xl">
              <h1 className="text-h1 text-foreground mb-4">Discover Events</h1>
              <p className="text-body text-muted-foreground">
                Find amazing events happening near you. From tech conferences to art workshops, there's something for
                everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-background">
          <div className="container-app">
            <EventFilters />
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-8">
          <div className="container-app">
            <div className="flex justify-between items-center mb-8">
              <div className="text-small text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, mockEvents.length)} of{" "}
                {mockEvents.length} events
              </div>
              <div className="flex items-center gap-2">
                <span className="text-small text-muted-foreground">Sort by:</span>
                <select className="text-small border border-border rounded px-2 py-1 bg-background">
                  <option>Date (Earliest)</option>
                  <option>Date (Latest)</option>
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                  <option>Popularity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {currentEvents.map((event, index) => (
                <EventCard key={event.id} event={event} position={startIndex + index + 1} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
