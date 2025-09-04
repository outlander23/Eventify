import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Calendar, Users, MapPin, Clock, ArrowRight, Star, CheckCircle,
  TrendingUp, Shield, Zap, Globe, Award, Heart, Play,
  ChevronLeft, ChevronRight, Sparkles, Ticket, Search
} from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function HomePage() {
  const navigate = useNavigate()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [animatedNumbers, setAnimatedNumbers] = useState({ events: 0, attendees: 0, organizers: 0, cities: 0 })

  // Featured events data
  const featuredEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      category: "Technology",
      date: "Dec 15, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "San Francisco, CA",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      price: "Free",
      attendees: 500,
      rating: 4.8,
      featured: true
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      category: "Business",
      date: "Dec 18, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
      price: "$99",
      attendees: 200,
      rating: 4.9
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      category: "Startup",
      date: "Dec 20, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Austin, TX",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
      price: "$25",
      attendees: 150,
      rating: 4.7
    },
    {
      id: 4,
      title: "AI & Machine Learning Workshop",
      category: "Technology",
      date: "Dec 22, 2024",
      time: "1:00 PM - 5:00 PM",
      location: "Seattle, WA",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      price: "$149",
      attendees: 100,
      rating: 5.0
    }
  ]

  // Features data
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Create and publish events in minutes with our intuitive interface"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Process payments securely with industry-leading encryption"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with attendees from around the world seamlessly"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track your event performance with detailed insights"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Foster connections and build lasting relationships"
    },
    {
      icon: Award,
      title: "Premium Support",
      description: "Get 24/7 support from our dedicated team of experts"
    }
  ]

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Event Organizer",
      company: "TechConf",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      content: "EventHub has transformed how we organize our annual tech conference. The platform is intuitive, and the analytics help us make data-driven decisions.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Marketing Director",
      company: "StartupHub",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      content: "The best event management platform we've used. It's helped us grow our community events from 50 to 500+ attendees in just 6 months.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Community Manager",
      company: "Creative Collective",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
      content: "EventHub makes it easy to manage multiple events simultaneously. The attendee engagement features are outstanding!",
      rating: 5
    }
  ]

  // Categories
  const categories = [
    { name: "Technology", icon: "💻", count: 234 },
    { name: "Business", icon: "💼", count: 189 },
    { name: "Design", icon: "🎨", count: 156 },
    { name: "Marketing", icon: "📱", count: 123 },
    { name: "Music", icon: "🎵", count: 98 },
    { name: "Food", icon: "🍔", count: 87 },
    { name: "Sports", icon: "⚽", count: 76 },
    { name: "Education", icon: "📚", count: 145 }
  ]

  // Animate numbers on mount
  useEffect(() => {
    const targets = { events: 5000, attendees: 250000, organizers: 10000, cities: 150 }
    const duration = 2000
    const steps = 60
    const increment = {
      events: targets.events / steps,
      attendees: targets.attendees / steps,
      organizers: targets.organizers / steps,
      cities: targets.cities / steps
    }

    let current = { events: 0, attendees: 0, organizers: 0, cities: 0 }
    const timer = setInterval(() => {
      current = {
        events: Math.min(current.events + increment.events, targets.events),
        attendees: Math.min(current.attendees + increment.attendees, targets.attendees),
        organizers: Math.min(current.organizers + increment.organizers, targets.organizers),
        cities: Math.min(current.cities + increment.cities, targets.cities)
      }
      setAnimatedNumbers({
        events: Math.floor(current.events),
        attendees: Math.floor(current.attendees),
        organizers: Math.floor(current.organizers),
        cities: Math.floor(current.cities)
      })

      if (current.events >= targets.events) {
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">New: AI-Powered Event Recommendations</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover & Create
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Unforgettable Events
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Join millions of people discovering and attending incredible events, or create your own and reach a global audience with EventHub.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/events"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/auth?mode=register"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
              >
                Create Your Event
              </Link>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for events..."
                    className="w-full pl-12 pr-4 py-3 focus:outline-none"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-12 pr-4 py-3 focus:outline-none"
                  />
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-500 rounded-full opacity-10 blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {animatedNumbers.events.toLocaleString()}+
              </div>
              <div className="text-blue-100">Active Events</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {animatedNumbers.attendees.toLocaleString()}+
              </div>
              <div className="text-blue-100">Happy Attendees</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {animatedNumbers.organizers.toLocaleString()}+
              </div>
              <div className="text-blue-100">Event Organizers</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {animatedNumbers.cities.toLocaleString()}+
              </div>
              <div className="text-blue-100">Cities Worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find events that match your interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(`/events?category=${category.name.toLowerCase()}`)}
                className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-200 group hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} events</p>
              </button>
            ))}
          </div>
        </div>
      </section>

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
                  <div className="text-sm text-blue-600 font-medium mb-2">{event.category}</div>
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
                      <span className="text-sm text-gray-600">{event.attendees} going</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{event.rating}</span>
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

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EventHub?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and attend amazing events, all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-blue-100">
              Join thousands of satisfied event organizers and attendees
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
              <div className="flex flex-col items-center text-center">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full mb-6"
                />
                <div className="flex mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                  </p>
                </div>
              </div>

              {/* Testimonial Navigation */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentTestimonial
                        ? 'w-8 bg-blue-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 lg:p-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join EventHub today and start creating unforgettable experiences for your audience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth?mode=register"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Start Free Trial
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-all duration-200"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
