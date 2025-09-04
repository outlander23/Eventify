"use client"

import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"
import { Calendar, MapPin, Settings, User, CreditCard, Bell } from "lucide-react"

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth")
    }
  }, [isAuthenticated, isLoading, navigate])

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

  if (!isAuthenticated) {
    return null
  }

  // Mock user stats and recent registrations
  const userStats = {
    totalRegistrations: 12,
    upcomingEvents: 3,
    completedEvents: 9,
    totalSpent: 450,
  }

  const recentRegistrations = [
    {
      id: 1,
      eventTitle: "Next.js Conference 2024",
      date: "2024-12-15",
      time: "09:00",
      location: "San Francisco, CA",
      status: "confirmed",
      price: 0,
    },
    {
      id: 2,
      eventTitle: "Startup Pitch Night",
      date: "2024-12-18",
      time: "19:00",
      location: "New York, NY",
      status: "confirmed",
      price: 25,
    },
    {
      id: 3,
      eventTitle: "Digital Art Workshop",
      date: "2024-12-20",
      time: "14:00",
      location: "Los Angeles, CA",
      status: "waitlist",
      price: 75,
    },
  ]

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "waitlist":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-app max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-h1 text-foreground mb-2">My Account</h1>
            <p className="text-body text-muted-foreground">Manage your profile, registrations, and settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="card-elevated">
                <CardHeader className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="text-lg">{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-h3">{user?.name}</CardTitle>
                  <p className="text-small text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {user?.role === "admin" ? "Administrator" : "Member"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link to="/account/profile">
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link to="/account/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-h2 font-bold text-primary">{userStats.totalRegistrations}</div>
                    <div className="text-small text-muted-foreground">Total Events</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-h2 font-bold text-primary">{userStats.upcomingEvents}</div>
                    <div className="text-small text-muted-foreground">Upcoming</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-h2 font-bold text-primary">{userStats.completedEvents}</div>
                    <div className="text-small text-muted-foreground">Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-h2 font-bold text-primary">${userStats.totalSpent}</div>
                    <div className="text-small text-muted-foreground">Total Spent</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Registrations */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Registrations</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/account/registrations">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRegistrations.map((registration) => (
                      <div key={registration.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{registration.eventTitle}</h4>
                          <div className="flex items-center gap-4 mt-2 text-small text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(registration.date).toLocaleDateString()} at {registration.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {registration.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(registration.status)}>{registration.status}</Badge>
                          <div className="text-small font-medium">
                            {registration.price === 0 ? "Free" : `$${registration.price}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                      asChild
                    >
                      <Link to="/events">
                        <Calendar className="w-6 h-6" />
                        <span>Browse Events</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                      asChild
                    >
                      <Link to="/account/registrations">
                        <CreditCard className="w-6 h-6" />
                        <span>My Registrations</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                      asChild
                    >
                      <Link to="/account/settings">
                        <Bell className="w-6 h-6" />
                        <span>Notifications</span>
                      </Link>
                    </Button>
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
