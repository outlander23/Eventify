"use client";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { Calendar, MapPin, Search, Download, X, ArrowLeft } from "lucide-react";

export default function RegistrationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [regsError, setRegsError] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    let mounted = true;
    const fetchRegs = async () => {
      setLoadingRegs(true);
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://localhost:5000/api/my-registrations", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to load registrations");
        const data = await res.json();
        if (mounted)
          setRegistrations(
            Array.isArray(data) ? data : data.registrations || []
          );
      } catch (err) {
        console.error(err);
        if (mounted) setRegsError(err.message || String(err));
      } finally {
        if (mounted) setLoadingRegs(false);
      }
    };

    fetchRegs();
    return () => {
      mounted = false;
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "waitlist":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "attended":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterRegistrations = (registrations, tab) => {
    const now = new Date();
    let filtered = registrations;

    // Filter by tab
    if (tab === "upcoming") {
      filtered = filtered.filter(
        (reg) => new Date(reg.date) >= now && reg.status !== "cancelled"
      );
    } else if (tab === "past") {
      filtered = filtered.filter(
        (reg) => new Date(reg.date) < now || reg.status === "attended"
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (reg) =>
          reg.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((reg) => reg.status === statusFilter);
    }

    return filtered;
  };

  const upcomingRegistrations = filterRegistrations(registrations, "upcoming");
  const pastRegistrations = filterRegistrations(registrations, "past");

  const handleCancelRegistration = (registrationId) => {
    // In real app, make API call to cancel registration
    console.log("Cancelling registration:", registrationId);
  };

  const handleDownloadTicket = (registration) => {
    // In real app, generate and download ticket PDF
    console.log("Downloading ticket for:", registration.ticketId);
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-app max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/account")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Button>
            <h1 className="text-h1 text-foreground mb-2">My Registrations</h1>
            <p className="text-body text-muted-foreground">
              Manage your event registrations and tickets
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search registrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="waitlist">Waitlist</SelectItem>
                    <SelectItem value="attended">Attended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Registrations Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingRegistrations.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastRegistrations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingRegistrations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingRegistrations.map((registration) => (
                    <Card key={registration.id} className="card-elevated">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-h3 text-foreground">
                                {registration.eventTitle}
                              </h3>
                              <Badge
                                className={getStatusColor(registration.status)}
                              >
                                {registration.status}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-small text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(
                                    registration.date
                                  ).toLocaleDateString()}{" "}
                                  at {registration.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{registration.location}</span>
                              </div>
                              <div className="text-xs">
                                Ticket ID: {registration.ticketId} • Registered:{" "}
                                {new Date(
                                  registration.registrationDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            {registration.status === "confirmed" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleDownloadTicket(registration)
                                }
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Ticket
                              </Button>
                            )}
                            {registration.status !== "cancelled" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCancelRegistration(registration.id)
                                }
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            )}
                            <div className="text-small font-medium text-right">
                              {registration.price === 0
                                ? "Free"
                                : `$${registration.price}`}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-h3 text-foreground mb-2">
                      No upcoming events
                    </h3>
                    <p className="text-body text-muted-foreground mb-6">
                      You don't have any upcoming event registrations.
                    </p>
                    <Button asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastRegistrations.length > 0 ? (
                <div className="space-y-4">
                  {pastRegistrations.map((registration) => (
                    <Card key={registration.id} className="card-elevated">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-h3 text-foreground">
                                {registration.eventTitle}
                              </h3>
                              <Badge
                                className={getStatusColor(registration.status)}
                              >
                                {registration.status}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-small text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(
                                    registration.date
                                  ).toLocaleDateString()}{" "}
                                  at {registration.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{registration.location}</span>
                              </div>
                              <div className="text-xs">
                                Ticket ID: {registration.ticketId} • Registered:{" "}
                                {new Date(
                                  registration.registrationDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 items-end">
                            {registration.status === "attended" && (
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Certificate
                              </Button>
                            )}
                            <div className="text-small font-medium">
                              {registration.price === 0
                                ? "Free"
                                : `$${registration.price}`}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-h3 text-foreground mb-2">
                      No past events
                    </h3>
                    <p className="text-body text-muted-foreground">
                      You haven't attended any events yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
