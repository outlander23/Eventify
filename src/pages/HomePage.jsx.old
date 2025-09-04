import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 md:py-24">
          <div className="container-app">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-h1 text-balance text-foreground">Discover Amazing Events Near You</h1>
              <p className="text-body text-muted-foreground text-pretty max-w-2xl mx-auto">
                Join thousands of people discovering and attending incredible events. From conferences to concerts, find
                your next unforgettable experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link to="/events">
                    Browse Events
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-16">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="text-h2 text-foreground mb-4">Featured Events</h2>
              <p className="text-body text-muted-foreground">Don't miss these popular upcoming events</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Event Cards */}
              {[
                {
                  title: "Next.js Conference 2024",
                  category: "Technology",
                  date: "Dec 15, 2024",
                  time: "9:00 AM",
                  location: "San Francisco, CA",
                  registered: 245,
                  capacity: 300,
                  price: "Free",
                  slug: "nextjs-conference-2024",
                },
                {
                  title: "Startup Pitch Night",
                  category: "Business",
                  date: "Dec 18, 2024",
                  time: "7:00 PM",
                  location: "New York, NY",
                  registered: 142,
                  capacity: 150,
                  price: "$25",
                  slug: "startup-pitch-night",
                },
                {
                  title: "Digital Art Workshop",
                  category: "Arts & Culture",
                  date: "Dec 20, 2024",
                  time: "2:00 PM",
                  location: "Los Angeles, CA",
                  registered: 50,
                  capacity: 50,
                  price: "$75",
                  slug: "digital-art-workshop",
                },
              ].map((event, i) => (
                <Card key={i} className="card-elevated hover:shadow-lg transition-page cursor-pointer group">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg"></div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                      <span className="text-small text-green-600 font-medium">{event.price}</span>
                    </div>

                    <h3 className="text-h3 text-foreground text-balance group-hover:text-primary transition-micro">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-small text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {event.date} • {event.time}
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

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link to="/events">
                  View All Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-surface">
          <div className="container-app">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-h2 text-primary font-bold">10K+</div>
                <div className="text-small text-muted-foreground">Events Created</div>
              </div>
              <div className="space-y-2">
                <div className="text-h2 text-primary font-bold">50K+</div>
                <div className="text-small text-muted-foreground">Registrations</div>
              </div>
              <div className="space-y-2">
                <div className="text-h2 text-primary font-bold">25K+</div>
                <div className="text-small text-muted-foreground">Happy Attendees</div>
              </div>
              <div className="space-y-2">
                <div className="text-h2 text-primary font-bold">500+</div>
                <div className="text-small text-muted-foreground">Event Organizers</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
