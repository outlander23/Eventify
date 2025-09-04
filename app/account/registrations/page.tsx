"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Search, Download, QrCode, X, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

// Mock registration data (same as account page)
const mockRegistrations = [
  {
    id: "reg-1",
    eventId: "1",
    eventTitle: "Next.js Conference 2024",
    eventDate: "Dec 15, 2024",
    eventTime: "9:00 AM - 6:00 PM",
    eventLocation: "Moscone Center, San Francisco, CA",
    status: "confirmed",
    ticketType: "General Admission",
    quantity: 1,
    totalPaid: 0,
    registrationDate: "Nov 20, 2024",
    qrCode: "QR123456789",
  },
  {
    id: "reg-2",
    eventId: "2",
    eventTitle: "Startup Pitch Night",
    eventDate: "Dec 18, 2024",
    eventTime: "7:00 PM - 10:00 PM",
    eventLocation: "New York, NY",
    status: "confirmed",
    ticketType: "Standard",
    quantity: 2,
    totalPaid: 50,
    registrationDate: "Nov 22, 2024",
    qrCode: "QR987654321",
  },
  {
    id: "reg-3",
    eventId: "3",
    eventTitle: "Digital Art Workshop",
    eventDate: "Dec 20, 2024",
    eventTime: "2:00 PM - 5:00 PM",
    eventLocation: "Los Angeles, CA",
    status: "cancelled",
    ticketType: "Workshop Pass",
    quantity: 1,
    totalPaid: 75,
    registrationDate: "Nov 18, 2024",
    qrCode: "QR456789123",
  },
  {
    id: "reg-4",
    eventId: "4",
    eventTitle: "React Meetup",
    eventDate: "Nov 22, 2024",
    eventTime: "6:30 PM - 9:00 PM",
    eventLocation: "Austin, TX",
    status: "attended",
    ticketType: "Free",
    quantity: 1,
    totalPaid: 0,
    registrationDate: "Nov 15, 2024",
    qrCode: "QR789123456",
  },
]

export default function RegistrationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your registrations...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  const filteredRegistrations = mockRegistrations.filter((reg) =>
    reg.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const upcomingEvents = filteredRegistrations.filter(
    (reg) => reg.status === "confirmed" && new Date(reg.eventDate) > new Date(),
  )
  const pastEvents = filteredRegistrations.filter(
    (reg) => (reg.status === "confirmed" || reg.status === "attended") && new Date(reg.eventDate) <= new Date(),
  )
  const cancelledEvents = filteredRegistrations.filter((reg) => reg.status === "cancelled")

  const RegistrationCard = ({ registration }: { registration: any }) => (
    <Card className="card-elevated">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge
            variant={
              registration.status === "confirmed"
                ? "secondary"
                : registration.status === "attended"
                  ? "default"
                  : registration.status === "cancelled"
                    ? "destructive"
                    : "outline"
            }
            className={
              registration.status === "confirmed"
                ? "bg-success/10 text-success"
                : registration.status === "attended"
                  ? "bg-primary/10 text-primary"
                  : ""
            }
          >
            {registration.status === "confirmed"
              ? "Confirmed"
              : registration.status === "attended"
                ? "Attended"
                : "Cancelled"}
          </Badge>
          <div className="flex gap-2">
            {registration.status === "confirmed" && (
              <>
                <Button variant="ghost" size="sm" title="Show QR Code">
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Download Ticket">
                  <Download className="w-4 h-4" />
                </Button>
              </>
            )}
            {registration.status === "confirmed" && (
              <Button variant="ghost" size="sm" title="Cancel Registration">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <h3 className="text-h3 text-foreground mb-3 text-balance">{registration.eventTitle}</h3>

        <div className="space-y-2 text-small text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {registration.eventDate} • {registration.eventTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{registration.eventLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {registration.quantity} ticket{registration.quantity > 1 ? "s" : ""} • {registration.ticketType}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-small">
            <span className="text-muted-foreground">Registered: </span>
            <span className="text-foreground">{registration.registrationDate}</span>
          </div>
          <div className="text-small">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-medium text-foreground">
              {registration.totalPaid === 0 ? "Free" : `$${registration.totalPaid}`}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href={`/events/${registration.eventId}`}>View Event</Link>
          </Button>
          {registration.status === "confirmed" && (
            <Button size="sm" variant="outline">
              Add to Calendar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-app max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Account
                </Link>
              </Button>
            </div>
            <h1 className="text-h1 text-foreground mb-2">My Event Registrations</h1>
            <p className="text-body text-muted-foreground">
              Manage your event registrations, download tickets, and view event details.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search your registrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Registrations Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({cancelledEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingEvents.map((registration) => (
                    <RegistrationCard key={registration.id} registration={registration} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-h3 text-foreground mb-2">No Upcoming Events</h3>
                    <p className="text-body text-muted-foreground mb-6">
                      {searchQuery
                        ? "No upcoming events match your search."
                        : "You don't have any upcoming events. Discover amazing events to attend!"}
                    </p>
                    {!searchQuery && (
                      <Button asChild>
                        <Link href="/events">Browse Events</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pastEvents.map((registration) => (
                    <RegistrationCard key={registration.id} registration={registration} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-h3 text-foreground mb-2">No Past Events</h3>
                    <p className="text-body text-muted-foreground">
                      {searchQuery ? "No past events match your search." : "You haven't attended any events yet."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-6">
              {cancelledEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {cancelledEvents.map((registration) => (
                    <RegistrationCard key={registration.id} registration={registration} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-h3 text-foreground mb-2">No Cancelled Events</h3>
                    <p className="text-body text-muted-foreground">
                      {searchQuery ? "No cancelled events match your search." : "You haven't cancelled any events."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
