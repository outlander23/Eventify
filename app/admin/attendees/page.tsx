"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Download, Mail, CheckCircle, XCircle, Clock, MoreHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock attendees data
const attendees = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    event: "Tech Conference 2024",
    ticketType: "General Admission",
    status: "confirmed",
    checkedIn: true,
    registrationDate: "2024-02-15",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    event: "Tech Conference 2024",
    ticketType: "VIP",
    status: "confirmed",
    checkedIn: false,
    registrationDate: "2024-02-18",
    phone: "+1 (555) 987-6543",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike@example.com",
    event: "Digital Art Workshop",
    ticketType: "General Admission",
    status: "pending",
    checkedIn: false,
    registrationDate: "2024-02-20",
    phone: "+1 (555) 456-7890",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    event: "React Meetup",
    ticketType: "Free",
    status: "confirmed",
    checkedIn: true,
    registrationDate: "2024-02-22",
    phone: "+1 (555) 321-0987",
  },
]

export default function AdminAttendees() {
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([])

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEvent = eventFilter === "all" || attendee.event === eventFilter
    const matchesStatus = statusFilter === "all" || attendee.status === statusFilter
    return matchesSearch && matchesEvent && matchesStatus
  })

  const toggleAttendeeSelection = (attendeeId: number) => {
    setSelectedAttendees((prev) =>
      prev.includes(attendeeId) ? prev.filter((id) => id !== attendeeId) : [...prev, attendeeId],
    )
  }

  const toggleAllSelection = () => {
    setSelectedAttendees(
      selectedAttendees.length === filteredAttendees.length ? [] : filteredAttendees.map((a) => a.id),
    )
  }

  const getStatusIcon = (status: string, checkedIn: boolean) => {
    if (checkedIn) return <CheckCircle className="w-4 h-4 text-success" />
    if (status === "confirmed") return <Clock className="w-4 h-4 text-warning" />
    if (status === "pending") return <Clock className="w-4 h-4 text-muted-foreground" />
    return <XCircle className="w-4 h-4 text-destructive" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendees</h1>
          <p className="text-muted-foreground mt-1">Manage event registrations and check-ins</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search attendees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="Tech Conference 2024">Tech Conference 2024</SelectItem>
                <SelectItem value="Digital Art Workshop">Digital Art Workshop</SelectItem>
                <SelectItem value="React Meetup">React Meetup</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedAttendees.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{selectedAttendees.length} attendee(s) selected</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check In
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Attendees ({filteredAttendees.length})</span>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                onCheckedChange={toggleAllSelection}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAttendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={selectedAttendees.includes(attendee.id)}
                  onCheckedChange={() => toggleAttendeeSelection(attendee.id)}
                />

                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-medium text-foreground">{attendee.name}</h3>
                    <p className="text-sm text-muted-foreground">{attendee.email}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">{attendee.event}</p>
                    <p className="text-sm text-muted-foreground">{attendee.ticketType}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(attendee.status, attendee.checkedIn)}
                      <Badge
                        variant={
                          attendee.checkedIn
                            ? "default"
                            : attendee.status === "confirmed"
                              ? "secondary"
                              : attendee.status === "pending"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {attendee.checkedIn ? "Checked In" : attendee.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Registered: {attendee.registrationDate}</p>
                  </div>

                  <div className="flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {attendee.checkedIn ? "Undo Check-in" : "Check In"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Registration</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
