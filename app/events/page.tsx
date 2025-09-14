"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function EventsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const eventsPerPage = 9;

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/events");
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        if (mounted) setEvents(Array.isArray(data) ? data : data.events || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      mounted = false;
    };
  }, []);

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + eventsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-12 bg-surface border-b border-border">
          <div className="container-app">
            <div className="max-w-3xl">
              <h1 className="text-h1 text-foreground mb-4">Discover Events</h1>
              <p className="text-body text-muted-foreground">
                Find amazing events happening near you. From tech conferences to
                art workshops, there's something for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-background">
          <div className="container-app">
            <EventFilters />
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-8">
          <div className="container-app">
            <div className="flex justify-between items-center mb-8">
              <div className="text-small text-muted-foreground">
                Showing {startIndex + 1}-
                {Math.min(startIndex + eventsPerPage, events.length)} of{" "}
                {events.length} events
              </div>
              <div className="flex items-center gap-2">
                <span className="text-small text-muted-foreground">
                  Sort by:
                </span>
                <select className="text-small border border-border rounded px-2 py-1 bg-background">
                  <option>Date (Earliest)</option>
                  <option>Date (Latest)</option>
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                  <option>Popularity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {loading ? (
                <div className="text-center col-span-3 py-12">
                  Loading events...
                </div>
              ) : error ? (
                <div className="text-center col-span-3 py-12 text-red-500">
                  {error}
                </div>
              ) : (
                currentEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    position={startIndex + index + 1}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
