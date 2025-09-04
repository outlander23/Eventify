"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Calendar, MapPin, DollarSign } from "lucide-react"
import { useState } from "react"

interface EventFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export function EventFilters({ onFiltersChange }: EventFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [priceFilter, setPriceFilter] = useState("")
  const [dateRange, setDateRange] = useState("")

  const categories = [
    "Technology",
    "Business",
    "Arts & Culture",
    "Sports",
    "Music",
    "Education",
    "Food & Drink",
    "Health & Wellness",
    "Networking",
  ]

  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Austin, TX",
    "Seattle, WA",
    "Online",
  ]

  const activeFiltersCount = [selectedCategory, selectedLocation, priceFilter, dateRange].filter(Boolean).length

  const clearAllFilters = () => {
    setSelectedCategory("")
    setSelectedLocation("")
    setPriceFilter("")
    setDateRange("")
    setSearchQuery("")
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search events by title, description, or organizer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-body"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-small font-medium text-foreground">Filters:</span>
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-48">
            <MapPin className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Filter */}
        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-32">
            <DollarSign className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="under-50">Under $50</SelectItem>
            <SelectItem value="50-100">$50 - $100</SelectItem>
            <SelectItem value="over-100">Over $100</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="When" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="next-month">Next Month</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
            </Badge>
          )}
          {selectedLocation && (
            <Badge variant="secondary" className="gap-1">
              {selectedLocation}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLocation("")} />
            </Badge>
          )}
          {priceFilter && (
            <Badge variant="secondary" className="gap-1">
              {priceFilter === "free" ? "Free" : priceFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceFilter("")} />
            </Badge>
          )}
          {dateRange && (
            <Badge variant="secondary" className="gap-1">
              {dateRange}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setDateRange("")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
