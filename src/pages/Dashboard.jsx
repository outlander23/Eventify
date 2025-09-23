"use client"

import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card"
import { Calendar, Users, Clock } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.username}!</h1>
        <p className="mt-2 text-muted-foreground">Here's what's happening with your events.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground">Events you're registered for</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground">Events happening soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground">All available events</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">Browse Events</h3>
              <p className="text-sm text-muted-foreground">Discover and register for upcoming events in your area.</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">My Registrations</h3>
              <p className="text-sm text-muted-foreground">View and manage your event registrations.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
