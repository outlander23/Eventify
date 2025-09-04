"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"

export default function AdminAttendees() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAttendees, setSelectedAttendees] = useState([])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/")
    }
  }, [isAuthenticated, isLoading, user, navigate])

  // Mock attendees data
  const allAttendees = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      organization: "Tech Corp",
      eventTitle: "Next.js Conference 2024",
      eventDate: "2024-12-15",
      registrationDate: "2024-11-20",
      status: "confirmed",
      ticketType: "General Admission",
      amount: 0,
      checkedIn: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 234-5678",
      organization: "Design Studio",
      eventTitle: "Startup Pitch Night",
      eventDate: "2024-12-18",
      registrationDate: "2024-11-22",
      status: "confirmed",
      ticketType: "Premium",
      amount: 25,
      checkedIn: false,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 (555) 345-6789",
      organization: "Freelancer",
      eventTitle: "Digital Art Workshop",
      eventDate: "2024-12-20",
      registrationDate: "2024-11-25",
      status: "waitlist",
      ticketType: "Workshop Pass",
      amount: 75,
      checkedIn: false,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1 (555) 456-7890",
      organization: "StartupXYZ",
      eventTitle: "React Meetup",
      eventDate: "2024-12-22",
      registrationDate: "2024-11-28",
      status: "confirmed",
      ticketType: "General Admission",
      amount: 0,
      checkedIn: true,
    },
  ]

  const events = [...new Set(allAttendees.map((attendee) => attendee.eventTitle))]

  const getFilteredAttendees = () => {
    return allAttendees.filter((attendee) => {
      const matchesSearch =
        attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.organization.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesEvent = eventFilter === "all" || attendee.eventTitle === eventFilter
      const matchesStatus = statusFilter === "all" || attendee.status === statusFilter
      
      return matchesSearch && matchesEvent && matchesStatus
    })
  }

  const handleCheckIn = (attendeeId) => {
    // Handle check-in logic
    console.log("Check in attendee:", attendeeId)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAttendees(getFilteredAttendees().map(a => a.id))
    } else {
      setSelectedAttendees([])
    }
  }

  const handleSelectAttendee = (attendeeId, checked) => {
    if (checked) {
      setSelectedAttendees([...selectedAttendees, attendeeId])
    } else {
      setSelectedAttendees(selectedAttendees.filter(id => id !== attendeeId))
    }
  }

  const filteredAttendees = getFilteredAttendees()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Attendees</h1>
      
      {/* Filters */}
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4">
        <input
          type="text"
          placeholder="Search attendees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Events</option>
          {events.map(event => (
            <option key={event} value={event}>{event}</option>
          ))}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="waitlist">Waitlist</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Attendees Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                />
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Event</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Check-in</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendees.map((attendee) => (
              <tr key={attendee.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.includes(attendee.id)}
                    onChange={(e) => handleSelectAttendee(attendee.id, e.target.checked)}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">{attendee.name}</td>
                <td className="border border-gray-300 px-4 py-2">{attendee.email}</td>
                <td className="border border-gray-300 px-4 py-2">{attendee.eventTitle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    attendee.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    attendee.status === 'waitlist' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {attendee.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {attendee.checkedIn ? (
                    <span className="text-green-600 font-semibold">Checked In</span>
                  ) : (
                    <button
                      onClick={() => handleCheckIn(attendee.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Check In
                    </button>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-600 hover:underline mr-2">View</button>
                  <button className="text-red-600 hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAttendees.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No attendees found.</p>
        )}
      </div>
      
      {/* Bulk Actions */}
      {selectedAttendees.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="mb-2">{selectedAttendees.length} attendee(s) selected</p>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Bulk Check-in
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Send Email
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Remove Selected
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
