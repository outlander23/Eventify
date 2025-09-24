"use client";

import { useAuth } from "../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Calendar, Users, Clock, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import notificationService from "../services/notificationService";

const Dashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const [stats, setStats] = useState({
    registeredEvents: 0,
    upcomingEvents: 0,
    totalEvents: 0,
  });
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard stats
      const statsResponse = await fetch(
        "http://localhost:5000/api/dashboard/stats",
        {
          headers: getAuthHeaders(),
        }
      );

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch user's registered events for notification scheduling
      const registrationsResponse = await fetch(
        "http://localhost:5000/api/my-registrations",
        {
          headers: getAuthHeaders(),
        }
      );

      if (registrationsResponse.ok) {
        const registrationsData = await registrationsResponse.json();
        setRegisteredEvents(registrationsData);

        // Schedule reminders for registered events
        if (
          notificationService.isNotificationSupported() &&
          notificationService.permission === "granted"
        ) {
          await notificationService.scheduleUserEventReminders(
            registrationsData,
            getAuthHeaders
          );
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.username || "User"}!
            </h1>
            <p className="mt-2 text-gray-600">
              Here's what's happening with your events.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {(user.username || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.email || "Member"}
                  </p>
                  {user.is_admin && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              My Registered Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                stats.registeredEvents || 0
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Events you're registered for
            </p>
            {!isLoading && stats.registeredEvents > 0 && (
              <div className="mt-2">
                <Link
                  to="/my-registrations"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Upcoming Events
            </CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                stats.upcomingEvents || 0
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Events happening soon</p>
            {!isLoading && stats.upcomingEvents > 0 && (
              <div className="mt-2">
                <span className="text-xs text-green-600 font-medium">
                  Don't miss out!
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Available Events
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
              ) : (
                stats.totalEvents || 0
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">All events to explore</p>
            {!isLoading && stats.totalEvents > 0 && (
              <div className="mt-2">
                <Link
                  to="/events"
                  className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                >
                  Browse all →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/events"
                className="group p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-900">
                      Browse Events
                    </h3>
                    <p className="text-sm text-gray-600">
                      Discover and register for upcoming events
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/my-registrations"
                className="group p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-green-900">
                      My Registrations
                    </h3>
                    <p className="text-sm text-gray-600">
                      View and manage your event registrations
                    </p>
                  </div>
                </div>
              </Link>

              {user.is_admin && (
                <Link
                  to="/admin"
                  className="group p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Settings className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-purple-900">
                        Admin Dashboard
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage events and view analytics
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              <div
                onClick={() => setShowNotifications(!showNotifications)}
                className="group p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-orange-900">
                      Notification Settings
                    </h3>
                    <p className="text-sm text-gray-600">
                      {showNotifications
                        ? "Hide settings"
                        : "Manage event alerts and reminders"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Registered Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Bell className="h-5 w-5 text-orange-500" />
              Your Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : registeredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No registered events yet</p>
                <Link
                  to="/events"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {registeredEvents.slice(0, 5).map((event) => {
                  const eventDate = new Date(event.date);
                  const isUpcoming = eventDate > new Date();
                  const timeUntil = isUpcoming
                    ? Math.ceil(
                        (eventDate - new Date()) / (1000 * 60 * 60 * 24)
                      )
                    : null;

                  return (
                    <div
                      key={event.id}
                      className={`p-3 border rounded-lg transition-colors ${
                        isUpcoming
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            📅{" "}
                            {eventDate.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            📍 {event.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              isUpcoming
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {isUpcoming
                              ? timeUntil === 0
                                ? "Today"
                                : timeUntil === 1
                                ? "Tomorrow"
                                : `${timeUntil} days`
                              : "Past"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {registeredEvents.length > 5 && (
                  <div className="pt-3 border-t">
                    <Link
                      to="/my-registrations"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
                    >
                      View all {registeredEvents.length} registrations →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
