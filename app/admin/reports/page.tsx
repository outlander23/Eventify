"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, Users, Calendar, DollarSign, BarChart3, PieChart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock analytics data
const funnelData = [
  { stage: "Event Views", count: 5420, percentage: 100 },
  { stage: "Registration Started", count: 1084, percentage: 20 },
  { stage: "Registration Completed", count: 867, percentage: 16 },
  { stage: "Payment Completed", count: 743, percentage: 14 },
]

const topEvents = [
  { name: "Tech Conference 2024", views: 1250, registrations: 156, revenue: "$4,680", conversion: "12.5%" },
  { name: "Digital Art Workshop", views: 890, registrations: 89, revenue: "$2,670", conversion: "10.0%" },
  { name: "React Meetup", views: 650, registrations: 45, revenue: "$0", conversion: "6.9%" },
  { name: "Business Networking", views: 420, registrations: 0, revenue: "$0", conversion: "0%" },
]

const trafficSources = [
  { source: "Direct", visitors: 2340, percentage: 45 },
  { source: "Social Media", visitors: 1560, percentage: 30 },
  { source: "Search Engines", visitors: 780, percentage: 15 },
  { source: "Email", visitors: 520, percentage: 10 },
]

export default function AdminReports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed insights into your events and user engagement</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$24,680</div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-sm text-success font-medium">+18.2%</span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Registrations</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-sm text-success font-medium">+23.1%</span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">14.2%</div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-sm text-success font-medium">+2.1%</span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Events</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">4 upcoming</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Registration Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{stage.count}</span>
                      <Badge variant="secondary">{stage.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                  {index < funnelData.length - 1 && (
                    <div className="text-xs text-muted-foreground text-center">
                      Drop-off:{" "}
                      {(
                        ((funnelData[index].count - funnelData[index + 1].count) / funnelData[index].count) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          source.source === "Direct"
                            ? "#0066FF"
                            : source.source === "Social Media"
                              ? "#16A34A"
                              : source.source === "Search Engines"
                                ? "#F59E0B"
                                : "#EF4444",
                      }}
                    />
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{source.visitors}</span>
                    <Badge variant="outline">{source.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Events Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Events Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div key={event.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.views} views • {event.registrations} registrations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">{event.revenue}</p>
                    <p className="text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{event.conversion}</p>
                    <p className="text-muted-foreground">Conversion</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
