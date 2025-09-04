"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, Settings, Edit, Download, QrCode } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Mock registration data
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
]

export default function AccountPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your account...</p>
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

  const upcomingEvents = mockRegistrations.filter(
    (reg) => reg.status === "confirmed" && new Date(reg.eventDate) > new Date(),
  )
  const pastEvents = mockRegistrations.filter(
    (reg) => reg.status === "confirmed" && new Date(reg.eventDate) <= new Date(),
  )
  const cancelledEvents = mockRegistrations.filter((reg) => reg.status === "cancelled")

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-app max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <Card className="card-elevated">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <h1 className="text-h1 text-foreground">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-body text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{user.role === "admin" ? "Administrator" : "Member"}</Badge>
                      <span className="text-small text-muted-foreground">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/account/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/account/profile">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-h2 text-primary font-bold">{upcomingEvents.length}</div>
                <div className="text-small text-muted-foreground">Upcoming Events</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-h2 text-primary font-bold">{pastEvents.length}</div>
                <div className="text-small text-muted-foreground">Past Events</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-h2 text-primary font-bold">{mockRegistrations.length}</div>
                <div className="text-small text-muted-foreground">Total Registrations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-h2 text-primary font-bold">
                  ${mockRegistrations.reduce((sum, reg) => sum + reg.totalPaid, 0)}
                </div>
                <div className="text-small text-muted-foreground">Total Spent</div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h2 text-foreground">Upcoming Events</h2>
                <Button variant="outline" asChild>
                  <Link href="/account/registrations">View All</Link>
                </Button>
              </div>

              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingEvents.map((registration) => (
                    <Card key={registration.id} className="card-elevated">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Confirmed
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <QrCode className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
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
                              {registration.quantity} ticket{registration.quantity > 1 ? "s" : ""} •{" "}
                              {registration.ticketType}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={`/events/${registration.eventId}`}>View Event</Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            Add to Calendar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-h3 text-foreground mb-2">No Upcoming Events</h3>
                    <p className="text-body text-muted-foreground mb-6">
                      You don't have any upcoming events. Discover amazing events to attend!
                    </p>
                    <Button asChild>
                      <Link href="/events">Browse Events</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-h2 text-foreground mb-6">Recent Activity</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mockRegistrations.slice(0, 3).map((registration) => (
                      <div
                        key={registration.id}
                        className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <p className="text-small text-foreground">
                            Registered for <span className="font-medium">{registration.eventTitle}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{registration.registrationDate}</p>
                        </div>
                        <Badge
                          variant={
                            registration.status === "confirmed"
                              ? "secondary"
                              : registration.status === "cancelled"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {registration.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
