"use client";

import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/Card";
import Button from "../components/Button";
import { Calendar, MapPin, Users, Clock, CheckCircle } from "lucide-react";

const MyRegistrations = () => {
  const { user, getAuthHeaders } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyRegistrations();
    }
  }, [user]);

  const fetchMyRegistrations = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/my-registrations",
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Normalize backend response → wrap each event in { event: {...} }
        const normalized = data.map((event, idx) => ({
          id: idx + 1, // fallback id
          event,
        }));

        setRegistrations(normalized);
      } else {
        console.error("Failed to fetch registrations");
        setRegistrations(mockRegistrations);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setRegistrations(mockRegistrations);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventStatus = (eventDate) => {
    if (!eventDate)
      return {
        status: "unknown",
        label: "Unknown",
        color: "text-muted-foreground",
      };

    const now = new Date();
    const event = new Date(eventDate);
    const timeDiff = event.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return {
        status: "past",
        label: "Completed",
        color: "text-muted-foreground",
      };
    } else if (daysDiff === 0) {
      return { status: "today", label: "Today", color: "text-primary" };
    } else if (daysDiff <= 7) {
      return {
        status: "upcoming",
        label: `In ${daysDiff} day${daysDiff > 1 ? "s" : ""}`,
        color: "text-primary",
      };
    } else {
      return {
        status: "future",
        label: `In ${daysDiff} days`,
        color: "text-muted-foreground",
      };
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading your registrations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const upcomingEvents = registrations.filter(
    (reg) => reg.event?.date && getEventStatus(reg.event.date).status !== "past"
  );

  const pastEvents = registrations.filter(
    (reg) => reg.event?.date && getEventStatus(reg.event.date).status === "past"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          My Event Registrations
        </h1>
        <p className="text-muted-foreground">
          Manage your registered events and view your attendance history.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {registrations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              All time registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {upcomingEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Events you're registered for
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {pastEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Events you've attended
            </p>
          </CardContent>
        </Card>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No registrations yet
          </h3>
          <p className="text-muted-foreground mb-6">
            You haven't registered for any events yet. Discover exciting events
            happening near you.
          </p>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((registration) => {
                  const event = registration.event;
                  const eventStatus = getEventStatus(event?.date);
                  return (
                    <Card
                      key={registration.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-balance">
                            {event?.title}
                          </CardTitle>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full bg-secondary ${eventStatus.color}`}
                          >
                            {eventStatus.label}
                          </span>
                        </div>
                        <CardDescription className="text-pretty">
                          {event?.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(event?.date)}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event?.location}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          {event?.capacity} total capacity
                        </div>

                        <div className="bg-green-950 border border-green-800 rounded-md p-2">
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <p className="text-sm text-green-400 font-medium">
                              Registered
                            </p>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Link to={`/events/${event?.id}`} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                          >
                            View Event Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Past Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((registration) => {
                  const event = registration.event;
                  return (
                    <Card
                      key={registration.id}
                      className="opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-balance">
                            {event?.title}
                          </CardTitle>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <CardDescription className="text-pretty">
                          {event?.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(event?.date)}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event?.location}
                        </div>

                        <div className="bg-secondary border border-border rounded-md p-2">
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground font-medium">
                              Attended
                            </p>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Link to={`/events/${event?.id}`} className="w-full">
                          <Button variant="ghost" className="w-full">
                            View Event Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Mock data for development (same normalized structure)
const mockRegistrations = [
  {
    id: 1,
    event: {
      id: 2,
      title: "Web Development Workshop",
      description: "Learn React, Node.js, and cloud deployment strategies.",
      date: "2025-02-20T14:00:00",
      location: "Tech Hub Downtown",
      capacity: 50,
    },
  },
  {
    id: 2,
    event: {
      id: 3,
      title: "Startup Networking Event",
      description: "Meet entrepreneurs and investors in a casual setting.",
      date: "2025-02-28T18:00:00",
      location: "Innovation Center",
      capacity: 100,
    },
  },
];

export default MyRegistrations;
