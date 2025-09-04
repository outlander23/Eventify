"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, DollarSign, TrendingUp, Plus, Bell, BarChart3 } from "lucide-react"
import Link from "next/link"

// Mock data for dashboard
const kpis = [
  {
    title: "Total Events",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Calendar,
    period: "vs last month",
  },
  {
    title: "Total Registrations",
    value: "1,247",
    change: "+23%",
    trend: "up",
    icon: Users,
    period: "this month",
  },
  {
    title: "Revenue",
    value: "$12,450",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    period: "this month",
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.4%",
    trend: "up",
    icon: TrendingUp,
    period: "vs last month",
  },
]

const recentEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    date: "2024-03-15",
    status: "active",
    attendees: 156,
    revenue: "$4,680",
  },
  {
    id: 2,
    title: "Business Networking Mixer",
    date: "2024-03-20",
    status: "draft",
    attendees: 0,
    revenue: "$0",
  },
  {
    id: 3,
    title: "Digital Art Workshop",
    date: "2024-03-25",
    status: "active",
    attendees: 89,
    revenue: "$2,670",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your events.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/notifications">
              <Bell className="w-4 h-4 mr-2" />
              Send Notification
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/events/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-success font-medium">{kpi.change}</span>
                  <span className="text-xs text-muted-foreground">{kpi.period}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Events</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/events">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={event.status === "active" ? "default" : "secondary"}>{event.status}</Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.attendees} attendees</p>
                      <p className="text-xs text-muted-foreground">{event.revenue}</p>
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
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
                <Link href="/admin/events/create">
                  <Calendar className="w-6 h-6" />
                  Create Event
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
                <Link href="/admin/attendees">
                  <Users className="w-6 h-6" />
                  Manage Attendees
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
                <Link href="/admin/notifications">
                  <Bell className="w-6 h-6" />
                  Send Notification
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
                <Link href="/admin/reports">
                  <BarChart3 className="w-6 h-6" />
                  View Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
