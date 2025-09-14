"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
  event: {
    id: string | number;
    title: string;
    description: string;
    category: string;
    date: string;
    time: string;
    location: string;
    price: number;
    currency: string;
    capacity: number;
    registered: number;
    image: string;
  };
}

export function EventCard({ event }: EventCardProps) {
  const spotsLeft = event.capacity - event.registered;
  const isFree = event.price === 0;
  const isAlmostFull = spotsLeft <= 10 && spotsLeft > 0;
  const isSoldOut = spotsLeft <= 0;

  return (
    <Card className="card-elevated hover:shadow-lg transition-page cursor-pointer group">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-page"
        />
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-semibold">
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="text-xs">
            {event.category}
          </Badge>
          <span
            className={`text-small font-medium ${
              isFree ? "text-success" : "text-foreground"
            }`}
          >
            {isFree ? "Free" : `${event.currency}${event.price}`}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-h3 text-foreground text-balance group-hover:text-primary transition-micro">
            {event.title}
          </h3>
          <p className="text-small text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="space-y-2 text-small text-muted-foreground">
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
                    className={isAlmostFull ? "text-warning font-medium" : ""}
                  >
                    {spotsLeft} spots left
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 bg-primary hover:bg-primary-variant"
            disabled={isSoldOut}
            onClick={() => {
              if (isSoldOut) return;
              const token =
                typeof window !== "undefined"
                  ? localStorage.getItem("auth_token")
                  : null;
              if (!token) {
                window.dispatchEvent(new Event("open-auth"));
                return;
              }
              // Navigate to register page using id
              window.location.href = `/events/${event.id}/register`;
            }}
          >
            {isSoldOut ? "Sold Out" : "Register"}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/events/${event.id}`}>Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
