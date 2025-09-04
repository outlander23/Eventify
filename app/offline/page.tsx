"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Home, Calendar } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">You're Offline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            It looks like you've lost your internet connection. Some features may not be available, but you can still:
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              View cached events
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Home className="w-4 h-4" />
              Browse your registrations
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/events">
                  <Calendar className="w-4 h-4 mr-2" />
                  Events
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            Your registrations will be saved and synced when you're back online.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
