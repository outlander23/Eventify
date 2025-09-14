import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Award,
  Sparkles,
  Search,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    events: 0,
    attendees: 0,
    organizers: 0,
    cities: 0,
  });

  // Featured events (from backend)
  const [featuredEvents, setFeaturedEvents] = useState([]);

  // ✅ Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        console.log(data);
        // Transform API response to match UI card structure
        const formatted = data.slice(0, 3).map((event, index) => ({
          id: event.id,
          title: event.title,
          category: "General", // backend has no category
          date: new Date(event.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: new Date(event.date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          location: event.location,
          image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", // fallback image
          price: event.capacity > 100 ? "$99" : "Free", // example logic
          attendees: Math.floor(event.capacity / 2), // fake attendees count
          rating: 4.5 + index * 0.1, // demo ratings
          featured: true,
        }));

        console.log(formatted);

        setFeaturedEvents(formatted);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  // Features data
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Create and publish events in minutes with our intuitive interface",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Process payments securely with industry-leading encryption",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with attendees from around the world seamlessly",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track your event performance with detailed insights",
    },
    {
      icon: Award,
      title: "Premium Support",
      description: "Get 24/7 support from our dedicated team of experts",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Event Organizer",
      company: "TechConf",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      content:
        "EventHub has transformed how we organize our annual tech conference.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Marketing Director",
      company: "StartupHub",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      content: "The best event management platform we've used.",
      rating: 5,
    },
  ];

  // Animate numbers on mount
  useEffect(() => {
    const targets = {
      events: 5000,
      attendees: 250000,
      organizers: 10000,
      cities: 150,
    };
    const duration = 2000;
    const steps = 60;
    const increment = {
      events: targets.events / steps,
      attendees: targets.attendees / steps,
      organizers: targets.organizers / steps,
      cities: targets.cities / steps,
    };

    let current = { events: 0, attendees: 0, organizers: 0, cities: 0 };
    const timer = setInterval(() => {
      current = {
        events: Math.min(current.events + increment.events, targets.events),
        attendees: Math.min(
          current.attendees + increment.attendees,
          targets.attendees
        ),
        organizers: Math.min(
          current.organizers + increment.organizers,
          targets.organizers
        ),
        cities: Math.min(current.cities + increment.cities, targets.cities),
      };
      setAnimatedNumbers({
        events: Math.floor(current.events),
        attendees: Math.floor(current.attendees),
        organizers: Math.floor(current.organizers),
        cities: Math.floor(current.cities),
      });

      if (current.events >= targets.events) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      {/* ... keep your hero code unchanged ... */}

      {/* Featured Events Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Events
              </h2>
              <p className="text-lg text-gray-600">
                Don't miss out on these amazing upcoming events
              </p>
            </div>
            <Link
              to="/events"
              className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {event.featured && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg font-semibold">
                    {event.price}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {event.category}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {event.attendees} going
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {event.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden mt-8 text-center">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View All Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
