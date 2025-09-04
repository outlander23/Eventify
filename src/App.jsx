import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./lib/auth"
import { PWAProvider } from "./components/pwa/pwa-provider"
import { InstallPrompt } from "./components/pwa/install-prompt"
import { Toaster } from "./components/ui/sonner"

// Pages
import HomePage from "./pages/HomePage"
import EventsPage from "./pages/EventsPage"
import EventDetailsPage from "./pages/EventDetailsPage"
import RegisterPage from "./pages/RegisterPage"
import AuthPage from "./pages/AuthPage"
import AccountPage from "./pages/AccountPage"
import RegistrationsPage from "./pages/RegistrationsPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminEvents from "./pages/admin/AdminEvents"
import AdminCreateEvent from "./pages/admin/AdminCreateEvent"
import AdminAttendees from "./pages/admin/AdminAttendees"
import AdminNotifications from "./pages/admin/AdminNotifications"
import AdminReports from "./pages/admin/AdminReports"
import OfflinePage from "./pages/OfflinePage"

function App() {
  return (
    <PWAProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailsPage />} />
            <Route path="/events/:slug/register" element={<RegisterPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/registrations" element={<RegistrationsPage />} />
            <Route path="/account/settings" element={<SettingsPage />} />
            <Route path="/account/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/events/create" element={<AdminCreateEvent />} />
            <Route path="/admin/attendees" element={<AdminAttendees />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/offline" element={<OfflinePage />} />
          </Routes>
          <InstallPrompt />
          <Toaster />
        </div>
      </AuthProvider>
    </PWAProvider>
  )
}

export default App
