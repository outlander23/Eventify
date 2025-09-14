"use client";

import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Bell,
  BarChart3,
  UserCheck,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, user, navigate]);

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
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [adminError, setAdminError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://localhost:5000/api/stats", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        if (mounted) {
          setDashboardStats(data.stats || data);
          setRecentEvents(data.recentEvents || data.events || []);
          setRecentRegistrations(
            data.recentRegistrations || data.registrations || []
          );
        }
      } catch (err) {
        console.error(err);
        if (mounted) setAdminError(err.message || String(err));
      }
    };
    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  // fallback mock data if API not available
  const stats = dashboardStats || {
    totalEvents: 45,
    totalRegistrations: 1250,
    totalRevenue: 18750,
    conversionRate: 68.5,
    eventsThisMonth: 8,
    registrationsThisMonth: 320,
    revenueThisMonth: 4200,
    conversionRateChange: 5.2,
  };

  const eventsList = recentEvents.length
    ? recentEvents
    : [
        {
          id: 1,
          title: "Next.js Conference 2024",
          date: "2024-12-15",
          registrations: 245,
          capacity: 300,
          revenue: 0,
          status: "active",
        },
        {
          id: 2,
          title: "Startup Pitch Night",
          date: "2024-12-18",
          registrations: 142,
          capacity: 150,
          revenue: 3550,
          status: "active",
        },
        {
          id: 3,
          title: "Digital Art Workshop",
          date: "2024-12-20",
          registrations: 50,
          capacity: 50,
          revenue: 3750,
          status: "sold_out",
        },
      ];

  const recentRegsList = recentRegistrations.length
    ? recentRegistrations
    : [
        {
          id: 1,
          userName: "John Doe",
          eventTitle: "Next.js Conference 2024",
          amount: 0,
          time: "2 hours ago",
        },
        {
          id: 2,
          userName: "Jane Smith",
          eventTitle: "Startup Pitch Night",
          amount: 25,
          time: "4 hours ago",
        },
        {
          id: 3,
          userName: "Mike Johnson",
          eventTitle: "Digital Art Workshop",
          amount: 75,
          time: "6 hours ago",
        },
        {
          id: 4,
          userName: "Sarah Wilson",
          eventTitle: "React Meetup",
          amount: 0,
          time: "8 hours ago",
        },
      ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "sold_out":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-app max-w-7xl">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-h1 text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-body text-muted-foreground">
                Overview of your event platform performance
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" asChild>
                <Link to="/admin/notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Notification
                </Link>
              </Button>
              <Button asChild>
                <Link to="/admin/events/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.totalEvents}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardStats.eventsThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Registrations
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.totalRegistrations.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardStats.registrationsThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${dashboardStats.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +${dashboardStats.revenueThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.conversionRate}%
                </div>
                <p className="text-xs text-green-600">
                  +{dashboardStats.conversionRateChange}% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Events */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Events</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/events">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-small text-muted-foreground">
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span>
                            {event.registrations}/{event.capacity} registered
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.replace("_", " ")}
                        </Badge>
                        <div className="text-small font-medium">
                          {event.revenue === 0 ? "Free" : `$${event.revenue}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Registrations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Registrations</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/attendees">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRegistrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {registration.userName}
                        </h4>
                        <div className="text-small text-muted-foreground">
                          {registration.eventTitle}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {registration.amount === 0
                            ? "Free"
                            : `$${registration.amount}`}
                        </div>
                        <div className="text-small text-muted-foreground">
                          {registration.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 bg-transparent"
                  asChild
                >
                  <Link to="/admin/events">
                    <Calendar className="w-8 h-8" />
                    <span>Manage Events</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 bg-transparent"
                  asChild
                >
                  <Link to="/admin/attendees">
                    <UserCheck className="w-8 h-8" />
                    <span>View Attendees</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 bg-transparent"
                  asChild
                >
                  <Link to="/admin/reports">
                    <BarChart3 className="w-8 h-8" />
                    <span>Analytics</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 bg-transparent"
                  asChild
                >
                  <Link to="/admin/notifications">
                    <Bell className="w-8 h-8" />
                    <span>Notifications</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
