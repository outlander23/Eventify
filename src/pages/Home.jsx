"use client";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import { Calendar, Users, BarChart3, Shield } from "lucide-react";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-bold text-foreground sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Manage events with</span>{" "}
                  <span className="block text-primary xl:inline">Eventify</span>
                </h1>
                <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  The complete platform for event organizers and attendees.
                  Create, manage, and discover events with powerful analytics
                  and seamless registration.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    {user ? (
                      <Link to="/events">
                        <Button size="lg" className="w-full">
                          Browse Events
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/register">
                        <Button size="lg" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    )}
                  </div>
                  {user?.username && (
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link to="/my-registrations">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full bg-transparent"
                        >
                          My events
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-primary/20 to-secondary sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <Calendar className="h-32 w-32 text-primary/40" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need for event management
            </p>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
              From creation to analytics, Eventify provides all the tools you
              need to run successful events.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <Calendar className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">
                  Event Management
                </p>
                <p className="mt-2 ml-16 text-base text-muted-foreground">
                  Create, edit, and manage events with ease. Set capacity
                  limits, dates, and locations.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">
                  User Registration
                </p>
                <p className="mt-2 ml-16 text-base text-muted-foreground">
                  Seamless registration process for attendees with automatic
                  confirmation and tracking.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">
                  Analytics Dashboard
                </p>
                <p className="mt-2 ml-16 text-base text-muted-foreground">
                  Comprehensive analytics to track registrations, attendance,
                  and event performance.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-foreground">
                  Secure & Reliable
                </p>
                <p className="mt-2 ml-16 text-base text-muted-foreground">
                  Built with security in mind, featuring secure authentication
                  and data protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Create your account today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-foreground/90">
            Join thousands of event organizers who trust Eventify for their
            event management needs.
          </p>
          <div className="mt-8">
            {!user && (
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Sign up for free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
