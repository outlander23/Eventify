import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

const CreateEvent = () => {
  const { user, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    maxAttendees: "",
    ticketPrice: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});

  const categories = [
    "Technology",
    "Business",
    "Health & Wellness",
    "Education",
    "Arts & Culture",
    "Sports",
    "Music",
    "Food & Drink",
    "Networking",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Event description is required";
    }

    if (!formData.date) {
      newErrors.date = "Event date is required";
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        newErrors.date = "Event date cannot be in the past";
      }
    }

    if (!formData.time) {
      newErrors.time = "Event time is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Event location is required";
    }

    if (!formData.category) {
      newErrors.category = "Event category is required";
    }

    if (!formData.maxAttendees || formData.maxAttendees < 1) {
      newErrors.maxAttendees = "Maximum attendees must be at least 1";
    }

    if (formData.ticketPrice && formData.ticketPrice < 0) {
      newErrors.ticketPrice = "Ticket price cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Combine date and time into a single datetime string
      const eventDateTime = `${formData.date}T${formData.time}:00`;

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: eventDateTime,
        location: formData.location,
        capacity: parseInt(formData.maxAttendees),
        category: formData.category,
        // Add other fields as needed by your backend
      };

      console.log("Creating event with data:", eventData);

      const response = await fetch("http://localhost:5000/api/admin/events", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Event created successfully:", result);
        // Navigate back to admin dashboard on success
        navigate("/admin");
      } else {
        const error = await response.json();
        console.error("Failed to create event:", error);
        setErrors({
          submit: error.message || "Failed to create event. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setErrors({
        submit: "Network error. Please check if backend is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.is_admin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Event
        </h1>
        <p className="text-gray-600">Add a new event to the platform</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Describe your event..."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                required
              />
            </div>

            <div>
              <Input
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                placeholder="Enter event location"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? "border-red-300" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <Input
                label="Maximum Attendees"
                name="maxAttendees"
                type="number"
                value={formData.maxAttendees}
                onChange={handleChange}
                error={errors.maxAttendees}
                placeholder="Enter max attendees"
                min="1"
                required
              />
            </div>

            <div>
              <Input
                label="Ticket Price ($)"
                name="ticketPrice"
                type="number"
                value={formData.ticketPrice}
                onChange={handleChange}
                error={errors.ticketPrice}
                placeholder="0.00 (leave empty for free)"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Input
                label="Event Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                error={errors.imageUrl}
                placeholder="https://example.com/image.jpg (optional)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateEvent;
