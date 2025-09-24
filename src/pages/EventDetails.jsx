"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import notificationService from "../services/notificationService";

const EventDetails = () => {
  const { id } = useParams();
  const { user, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEventDetails();
    if (user) {
      checkRegistrationStatus();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Event details from backend:", data);
        setEvent(data);
      } else {
        console.error("Failed to fetch event details");
        const mockEvent = mockEvents.find((e) => e.id === Number.parseInt(id));
        setEvent(mockEvent);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      const mockEvent = mockEvents.find((e) => e.id === Number.parseInt(id));
      setEvent(mockEvent);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/my-registrations",
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        const registrations = await response.json();
        console.log("My registrations:", registrations);
        const isUserRegistered = registrations.some((reg) => {
          const eventId = reg.event_id || reg.eventId || reg.id;
          return eventId === Number.parseInt(id);
        });
        setIsRegistered(isUserRegistered);
      }
    } catch (error) {
      console.error("Error checking registration status:", error);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setRegistering(true);
    setMessage("");

    try {
      const headers = getAuthHeaders();
      console.log("Registration headers:", headers);

      const response = await fetch(
        `http://localhost:5000/api/eventregister/${id}`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Registration success:", data);
        setIsRegistered(true);
        setMessage(data.message || "Successfully registered for the event!");

        // Schedule notification reminder for this event
        try {
          await notificationService.scheduleEventReminder(
            event,
            getAuthHeaders
          );
        } catch (notificationError) {
          console.error(
            "Failed to schedule notification reminder:",
            notificationError
          );
          // Don't fail registration if notification scheduling fails
        }

        // Refresh event details to get updated registration count
        await fetchEventDetails();
      } else {
        const error = await response.json();
        console.log("Registration error:", error);
        setMessage(error.message || "Failed to register for event");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(
        "Network error. Please check if backend is running and try again."
      );
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
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

  const getAvailableSpots = () => {
    if (!event) return 0;
    // Handle different possible field names from backend
    const registeredCount =
      event.registrations ||
      event.registered_count ||
      event.registration_count ||
      0;
    return event.capacity - registeredCount;
  };

  const isEventFull = () => getAvailableSpots() === 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading event details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Event not found
          </h3>
          <p className="text-muted-foreground mb-4">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/events")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/events")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-balance">
                {event.title}
              </CardTitle>
              <CardDescription className="text-lg text-pretty">
                {event.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium text-foreground">Date & Time</p>
                    <p className="text-sm">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium text-foreground">Capacity</p>
                    <p className="text-sm">{event.capacity} attendees</p>
                  </div>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium text-foreground">
                      Available Spots
                    </p>
                    <p className="text-sm">{getAvailableSpots()} remaining</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                  About This Event
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Event Registration</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && (
                <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
                  <div>Event ID: {id}</div>
                  <div>User: {user ? user.username : "Not logged in"}</div>
                  <div>
                    Token:{" "}
                    {localStorage.getItem("token") ? "Present" : "Missing"}
                  </div>
                  <div>Is Registered: {isRegistered ? "Yes" : "No"}</div>
                </div>
              )}

              {message && (
                <div
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    message.includes("Successfully")
                      ? "bg-green-950 border border-green-800"
                      : "bg-red-950 border border-red-800"
                  }`}
                >
                  {message.includes("Successfully") ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span
                    className={`text-sm ${
                      message.includes("Successfully")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {message}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Available Spots:
                  </span>
                  <span className="font-medium text-foreground">
                    {getAvailableSpots()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Capacity:</span>
                  <span className="font-medium text-foreground">
                    {event.capacity}
                  </span>
                </div>
              </div>

              {isEventFull() && (
                <div className="bg-red-950 border border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-400 text-center font-medium">
                    This event is fully booked
                  </p>
                </div>
              )}

              {isRegistered && (
                <div className="bg-green-950 border border-green-800 rounded-md p-3">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <p className="text-sm text-green-400 font-medium">
                      You're registered!
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter>
              {!user ? (
                <Button onClick={handleRegister} className="w-full">
                  Sign in to Register
                </Button>
              ) : isRegistered ? (
                <Button disabled className="w-full">
                  Already Registered
                </Button>
              ) : isEventFull() ? (
                <Button disabled className="w-full">
                  Event Full
                </Button>
              ) : (
                <Button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full"
                >
                  {registering ? "Registering..." : "Register for Event"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
