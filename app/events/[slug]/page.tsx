import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Heart,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface EventPageProps {
  params: {
    slug: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/events/${params.slug}`
        );
        if (res.status === 404) {
          if (mounted) notFound();
          return;
        }
        if (!res.ok) throw new Error("Failed to load event");
        const data = await res.json();
        if (mounted) setEvent(data);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEvent();
    return () => {
      mounted = false;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12">
          <div className="container-app text-center">Loading event...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12">
          <div className="container-app text-center text-destructive">
            {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const spotsLeft = (event.capacity || 0) - (event.registered || 0);
  const isFree = (event.price || 0) === 0;
  const isAlmostFull = spotsLeft <= 10 && spotsLeft > 0;
  const isSoldOut = spotsLeft <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Back Navigation */}
        <div className="container-app py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative">
          <div className="aspect-[2.5/1] relative overflow-hidden">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="container-app">
            <div className="relative -mt-32 z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Info */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="card-elevated bg-surface/95 backdrop-blur">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="secondary">{event.category}</Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <h1 className="text-h1 text-foreground mb-4 text-balance">
                        {event.title}
                      </h1>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-small text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {event.registered} registered
                            {!isSoldOut && (
                              <>
                                {" • "}
                                <span
                                  className={
                                    isAlmostFull
                                      ? "text-warning font-medium"
                                      : ""
                                  }
                                >
                                  {spotsLeft} spots left
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="text-body text-muted-foreground">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Registration Card */}
                <div className="lg:col-span-1">
                  <Card className="card-elevated sticky top-8">
                    <CardContent className="p-6 space-y-6">
                      <div className="text-center">
                        <div className="text-h2 text-foreground font-bold">
                          {isFree ? "Free" : `${event.currency}${event.price}`}
                        </div>
                        {!isFree && (
                          <div className="text-small text-muted-foreground">
                            per person
                          </div>
                        )}
                      </div>

                      {isSoldOut ? (
                        <div className="space-y-4">
                          <Button disabled className="w-full h-12">
                            Sold Out
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                          >
                            Join Waitlist
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Button
                            asChild
                            className="w-full h-12 bg-primary hover:bg-primary-variant"
                          >
                            <Link href={`/events/${event.slug}/register`}>
                              Register Now
                            </Link>
                          </Button>
                          {isAlmostFull && (
                            <div className="text-center text-small text-warning font-medium">
                              Only {spotsLeft} spots left!
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-t border-border pt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={event.organizer?.avatar || "/placeholder.svg"}
                            alt={event.organizer?.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div>
                            <div className="text-small font-medium text-foreground">
                              {event.organizer?.name}
                              {event.organizer?.verified && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Event Organizer
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Details Tabs */}
        <section className="py-12">
          <div className="container-app">
            <div className="max-w-4xl">
              <Tabs defaultValue="schedule" className="space-y-8">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="speakers">Speakers</TabsTrigger>
                  <TabsTrigger value="venue">Venue</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="space-y-4">
                  <h2 className="text-h2 text-foreground">Event Schedule</h2>
                  <div className="space-y-4">
                    {(event.schedule || []).map((item: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="text-small font-medium text-primary min-w-20">
                              {item.time}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">
                                {item.title}
                              </div>
                              {item.speaker && (
                                <div className="text-small text-muted-foreground">
                                  {item.speaker}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="speakers" className="space-y-4">
                  <h2 className="text-h2 text-foreground">Featured Speakers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(event.speakers || []).map(
                      (speaker: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="space-y-3">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-bold text-xl">
                                  {speaker.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {speaker.name}
                                </h3>
                                <div className="text-small text-primary">
                                  {speaker.title}
                                </div>
                                <p className="text-small text-muted-foreground mt-2">
                                  {speaker.bio}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="venue" className="space-y-4">
                  <h2 className="text-h2 text-foreground">Venue Information</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {event.venue?.name || "Venue"}
                          </h3>
                          <p className="text-muted-foreground">
                            {event.venue?.address || ""}
                          </p>
                        </div>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground">
                            Interactive Map
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-small">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Getting There
                            </h4>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>
                                • BART: Montgomery St Station (5 min walk)
                              </li>
                              <li>• Parking: Available on-site ($25/day)</li>
                              <li>
                                • Rideshare: Drop-off at Howard St entrance
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Amenities
                            </h4>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>• Free WiFi throughout venue</li>
                              <li>• Accessible entrances and restrooms</li>
                              <li>• Food court and coffee shops</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="faq" className="space-y-4">
                  <h2 className="text-h2 text-foreground">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {(event.faq || []).map((item: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-foreground mb-2">
                            {item.question}
                          </h3>
                          <p className="text-muted-foreground">{item.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
