import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/Card";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalUsers: 0,
    upcomingEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch admin statistics
    fetchAdminStats();
    fetchRecentEvents();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error("Failed to fetch admin stats");
        // Fallback to mock data
        setStats({
          totalEvents: 25,
          totalRegistrations: 150,
          totalUsers: 89,
          upcomingEvents: 8,
        });
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      // Fallback to mock data
      setStats({
        totalEvents: 25,
        totalRegistrations: 150,
        totalUsers: 89,
        upcomingEvents: 8,
      });
    }
  };

  const fetchRecentEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/events?limit=5",
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecentEvents(data);
      } else {
        console.error("Failed to fetch recent events");
        // Fallback to mock data
        setRecentEvents([
          {
            id: 1,
            title: "Tech Conference 2025",
            date: "2025-10-15",
            registrations: 45,
          },
          {
            id: 2,
            title: "Music Festival",
            date: "2025-11-20",
            registrations: 32,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching recent events:", error);
      // Fallback to mock data
      setRecentEvents([
        {
          id: 1,
          title: "Tech Conference 2025",
          date: "2025-10-15",
          registrations: 45,
        },
        {
          id: 2,
          title: "Music Festival",
          date: "2025-11-20",
          registrations: 32,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.is_admin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage events and monitor platform activity
          </p>
        </div>
        <div className="space-x-4">
          <Link to="/admin/events/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Event
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button variant="outline">View Analytics</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEvents}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Registrations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRegistrations}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.upcomingEvents}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                href="/admin/events/create"
                className="w-full justify-center"
              >
                Create New Event
              </Button>
              <Button
                href="/admin/analytics"
                variant="outline"
                className="w-full justify-center"
              >
                View Analytics
              </Button>
              <Button
                href="/events"
                variant="outline"
                className="w-full justify-center"
              >
                Manage All Events
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Events
            </h3>
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {event.registrations} registered
                    </p>
                    <Button
                      href={`/admin/events/${event.id}/edit`}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
