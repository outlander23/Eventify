import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import PWAUpdateNotification from "./components/PWAUpdateNotification";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import MyRegistrations from "./pages/MyRegistrations";
import Analytics from "./pages/Analytics";
import TestPage from "./pages/TestPage";
import AuthTestPage from "./pages/AuthTestPage";
import NotificationTest from "./pages/NotificationTest";

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/simple-push-sw.js")
        .then((registration) => {
          console.log(
            "Simple notification service worker registered:",
            registration
          );
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    }
  }, []);
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/test" element={<TestPage />} /> */}
          {/* <Route path="/notification-test" element={<NotificationTest />} /> */}
          {/* <Route path="/auth-test" element={<AuthTestPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events/create" element={<CreateEvent />} />
          <Route path="/admin/events/:id/edit" element={<EditEvent />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          {/* <Route path="/admin/analytics" element={<Analytics />} /> */}
        </Routes>
      </Layout>
      <PWAInstallPrompt />
      <PWAUpdateNotification />
    </AuthProvider>
  );
}

export default App;
