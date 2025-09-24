import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import { Bell, BellOff } from "lucide-react";
import notificationService from "../services/notificationService";

const SimpleNotifications = () => {
  const { getAuthHeaders } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      setPermission(Notification.permission);
      const preferences = await notificationService.getNotificationPreferences(
        getAuthHeaders
      );
      setNotificationsEnabled(
        preferences.push_enabled && Notification.permission === "granted"
      );
    } catch (error) {
      console.error("Error checking notification status:", error);
    }
  };

  const toggleNotifications = async () => {
    setLoading(true);
    try {
      if (!notificationsEnabled) {
        // Enable notifications
        const granted = await notificationService.requestPermission();
        if (granted) {
          await notificationService.enablePushNotifications(getAuthHeaders);
          setNotificationsEnabled(true);
          setPermission("granted");

          // Send a welcome notification
          notificationService.showLocalNotification("Notifications Enabled!", {
            body: "You'll now receive event reminders from Eventify",
            icon: "/pwa-192x192.png",
          });
        }
      } else {
        // Disable notifications
        await notificationService.disablePushNotifications(getAuthHeaders);
        setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    setLoading(true);
    try {
      await notificationService.sendTestNotification(getAuthHeaders);
    } catch (error) {
      console.error("Error sending test notification:", error);
    } finally {
      setLoading(false);
    }
  };

  if (permission === "denied") {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2 text-red-700">
          <BellOff className="h-5 w-5" />
          <span className="font-medium">Notifications Blocked</span>
        </div>
        <p className="text-sm text-red-600 mt-1">
          Please enable notifications in your browser settings to receive event
          reminders.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {notificationsEnabled ? (
            <Bell className="h-5 w-5 text-green-600" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          <span className="font-medium text-gray-900">Event Notifications</span>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={toggleNotifications}
            disabled={loading}
            className={`text-sm ${
              notificationsEnabled
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            size="sm"
          >
            {loading ? "..." : notificationsEnabled ? "Disable" : "Enable"}
          </Button>
          {notificationsEnabled && (
            <Button
              onClick={sendTestNotification}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              Test
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600">
        {notificationsEnabled
          ? "✅ You'll receive reminders 1 hour before your events"
          : "Get notified about your upcoming events"}
      </p>

      {permission === "default" && (
        <p className="text-xs text-blue-600 mt-1">
          Click "Enable" to allow notifications
        </p>
      )}
    </div>
  );
};

export default SimpleNotifications;
