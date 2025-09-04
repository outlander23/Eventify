"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, Share2, Heart, ArrowLeft } from "lucide-react"

export default function EventDetailsPage() {
  const { slug } = useParams()
  const [isLiked, setIsLiked] = useState(false)

  // Mock event data - in real app, fetch based on slug
  const event = {
    id: 1,
    title: "Next.js Conference 2024",
    category: "Technology",
    date: "2024-12-15",
    time: "09:00",
    endTime: "17:00",
    location: "Moscone Center, San Francisco, CA",
    registered: 245,
    capacity: 300,
    price: 0,
    slug: "nextjs-conference-2024",
    image: "/tech-conference-stage.jpg",
    description:
      "Join us for the biggest Next.js conference of the year with industry leaders and cutting-edge talks about the future of web development.",
    longDescription: `
      The Next.js Conference 2024 brings together developers, designers, and industry leaders to explore the latest innovations in React and Next.js development. 
      
      This full-day event features keynote presentations, technical deep-dives, and hands-on workshops covering everything from performance optimization to the latest features in Next.js 14.
      
      Whether you're a seasoned developer or just getting started with Next.js, this conference offers valuable insights and networking opportunities with the community.
    `,
    organizer: {
      name: "Vercel",
      avatar: "/vercel-logo.png",
      description: "The platform for frontend developers",
    },
    schedule: [
      { time: "09:00", title: "Registration & Coffee", speaker: "" },
      { time: "09:30", title: "Opening Keynote", speaker: "Guillermo Rauch" },
      { time: "10:30", title: "Next.js 14: What's New", speaker: "Sebastian Markbåge" },
      { time: "11:30", title: "Coffee Break", speaker: "" },
      { time: "12:00", title: "Performance Optimization", speaker: "Lydia Hallie" },
      { time: "13:00", title: "Lunch", speaker: "" },
      { time: "14:00", title: "Server Components Deep Dive", speaker: "Dan Abramov" },
      { time: "15:00", title: "Building for Scale", speaker: "Kent C. Dodds" },
      { time: "16:00", title: "Panel Discussion", speaker: "All Speakers" },
      { time: "17:00", title: "Networking Reception", speaker: "" },
    ],
    speakers: [
      { name: "Guillermo Rauch", role: "CEO, Vercel", avatar: "/speaker1.jpg" },
      { name: "Sebastian Markbåge", role: "React Team Lead", avatar: "/speaker2.jpg" },
      { name: "Lydia Hallie", role: "Developer Advocate", avatar: "/speaker3.jpg" },
      { name: "Dan Abramov", role: "React Core Team", avatar: "/speaker4.jpg" },
    ],
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Back Navigation */}
        <div className="container-app py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative">
          <div className="aspect-[21/9] bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="container-app">
            <div className="relative -mt-32 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <Card className="card-elevated">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <Badge variant="secondary" className="mb-4">
                            {event.category}
                          </Badge>
                          <h1 className="text-h1 text-foreground mb-4">{event.title}</h1>
                          <p className="text-body text-muted-foreground">{event.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="icon" onClick={() => setIsLiked(!isLiked)}>
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          </Button>
                          <Button variant="outline" size="icon" onClick={handleShare}>
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">
                              {new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-small text-muted-foreground">
                              {event.time} - {event.endTime}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">{event.location}</div>
                            <div className="text-small text-muted-foreground">View on map</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">{event.registered} registered</div>
                            <div className="text-small text-muted-foreground">
                              {event.capacity - event.registered} spots remaining
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-medium">8 hours</div>
                            <div className="text-small text-muted-foreground">Full day event</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Registration Card */}
                <div className="lg:col-span-1">
                  <Card className="card-elevated sticky top-8">
                    <CardHeader>
                      <CardTitle className="text-center">
                        {event.price === 0 ? "Free Event" : `$${event.price}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-h2 font-bold text-primary">{event.capacity - event.registered}</div>
                        <div className="text-small text-muted-foreground">spots remaining</div>
                      </div>

                      <Button size="lg" className="w-full" asChild>
                        <Link to={`/events/${event.slug}/register`}>Register Now</Link>
                      </Button>

                      <div className="text-center">
                        <div className="text-small text-muted-foreground">Organized by {event.organizer.name}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Information */}
        <section className="py-12">
          <div className="container-app">
            <div className="max-w-4xl">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="speakers">Speakers</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-8">
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-h3 text-foreground mb-4">About This Event</h3>
                      <div className="prose prose-gray max-w-none">
                        {event.longDescription.split("\n").map(
                          (paragraph, index) =>
                            paragraph.trim() && (
                              <p key={index} className="text-body text-muted-foreground mb-4">
                                {paragraph.trim()}
                              </p>
                            ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule" className="mt-8">
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-h3 text-foreground mb-6">Event Schedule</h3>
                      <div className="space-y-4">
                        {event.schedule.map((item, index) => (
                          <div key={index} className="flex gap-4 p-4 rounded-lg border">
                            <div className="text-small font-medium text-primary min-w-16">{item.time}</div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{item.title}</div>
                              {item.speaker && <div className="text-small text-muted-foreground">{item.speaker}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="speakers" className="mt-8">
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-h3 text-foreground mb-6">Featured Speakers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {event.speakers.map((speaker, index) => (
                          <div key={index} className="flex gap-4 p-4 rounded-lg border">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <span className="text-primary font-bold">
                                {speaker.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{speaker.name}</div>
                              <div className="text-small text-muted-foreground">{speaker.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="location" className="mt-8">
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-h3 text-foreground mb-6">Event Location</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="font-medium text-foreground">{event.location}</div>
                          <div className="text-small text-muted-foreground">747 Howard St, San Francisco, CA 94103</div>
                        </div>
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="text-small text-muted-foreground">Interactive map would be here</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
