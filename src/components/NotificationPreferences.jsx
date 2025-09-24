import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "./Card";
import Button from "./Button";
import notificationService from "../services/notificationService";

const NotificationPreferences = () => {
  const { getAuthHeaders } = useAuth();
  const [preferences, setPreferences] = useState({
    event_reminders: true,
    one_hour_before: true,
    one_day_before: false,
    new_events: false,
    registration_updates: true,
    admin_notifications: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [testing, setTesting] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    checkNotificationPermission();
    fetchPreferences();
  }, []);

  const checkNotificationPermission = () => {
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notification-preferences",
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/notification-preferences",
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
        }
      );
      if (response.ok) {
        alert("Notification preferences saved successfully!");
      } else {
        alert("Failed to save preferences. Please try again.");
      }
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      alert("Error saving preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const granted = await notificationService.requestPermission();
      setPushEnabled(granted);

      if (granted) {
        // Register for push notifications using the service
        await notificationService.subscribe(getAuthHeaders);
        alert("Push notifications enabled successfully!");
      } else {
        alert("Push notifications permission denied");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      alert("Error enabling push notifications: " + error.message);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const testNotification = async () => {
    setTesting(true);
    try {
      await notificationService.sendTestNotification(getAuthHeaders);
      alert("Test notification sent! Check your notifications.");
    } catch (error) {
      console.error("Error sending test notification:", error);
      alert("Error sending test notification: " + error.message);
    } finally {
      setTesting(false);
    }
  };

  const checkFirebaseStatus = async () => {
    try {
      const status = await notificationService.checkFirebaseStatus(
        getAuthHeaders
      );
      setFirebaseStatus(status);
      alert("Firebase status updated - check the debugging section below");
    } catch (error) {
      console.error("Error checking Firebase status:", error);
      alert("Error checking Firebase status: " + error.message);
    }
  };

  const debugNotificationService = async () => {
    try {
      const debug = await notificationService.debugNotificationService(
        getAuthHeaders
      );
      setDebugInfo(debug);
      alert("Debug info updated - check the debugging section below");
    } catch (error) {
      console.error("Error debugging notification service:", error);
      alert("Error getting debug info: " + error.message);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <p className="text-gray-600">Loading notification preferences...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h3>

        {/* Push Notification Setup */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Push Notifications</h4>
              <p className="text-sm text-blue-700">
                {pushEnabled
                  ? "Push notifications are enabled"
                  : "Enable push notifications to receive event reminders"}
              </p>
            </div>
            <div className="flex space-x-2">
              {!pushEnabled && (
                <Button
                  onClick={requestNotificationPermission}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  Enable Notifications
                </Button>
              )}
              <Button
                onClick={testNotification}
                variant="outline"
                size="sm"
                disabled={!pushEnabled || testing}
              >
                {testing ? "Sending..." : "Test Notification"}
              </Button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                Event Reminders
              </label>
              <p className="text-sm text-gray-600">
                Get notified about your upcoming events
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.event_reminders}
              onChange={(e) =>
                handlePreferenceChange("event_reminders", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                1 Hour Before Event
              </label>
              <p className="text-sm text-gray-600">
                Reminder 1 hour before event starts
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.one_hour_before}
              onChange={(e) =>
                handlePreferenceChange("one_hour_before", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
              disabled={!preferences.event_reminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                1 Day Before Event
              </label>
              <p className="text-sm text-gray-600">
                Reminder 1 day before event starts
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.one_day_before}
              onChange={(e) =>
                handlePreferenceChange("one_day_before", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
              disabled={!preferences.event_reminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">New Events</label>
              <p className="text-sm text-gray-600">
                Get notified when new events are created
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.new_events}
              onChange={(e) =>
                handlePreferenceChange("new_events", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                Registration Updates
              </label>
              <p className="text-sm text-gray-600">
                Updates about your event registrations
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.registration_updates}
              onChange={(e) =>
                handlePreferenceChange("registration_updates", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                Admin Notifications
              </label>
              <p className="text-sm text-gray-600">
                Notifications for event organizers
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.admin_notifications}
              onChange={(e) =>
                handlePreferenceChange("admin_notifications", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={savePreferences}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>

        {/* Debugging Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">
            🔧 Debug & Status Information
          </h4>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={checkFirebaseStatus}
              variant="outline"
              size="sm"
              className="bg-green-50 hover:bg-green-100 text-green-800"
            >
              Check Firebase Status
            </Button>
            <Button
              onClick={debugNotificationService}
              variant="outline"
              size="sm"
              className="bg-purple-50 hover:bg-purple-100 text-purple-800"
            >
              Debug Notification Service
            </Button>
          </div>

          {firebaseStatus && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">
                🔥 Firebase Status:
              </h5>
              <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
                {JSON.stringify(firebaseStatus, null, 2)}
              </pre>
            </div>
          )}

          {debugInfo && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">
                🐛 Debug Information:
              </h5>
              <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-xs text-gray-600">
            <p>
              <strong>Browser Support:</strong>{" "}
              {notificationService.isNotificationSupported()
                ? "✅ Supported"
                : "❌ Not Supported"}
            </p>
            <p>
              <strong>Permission:</strong> {Notification.permission}
            </p>
            <p>
              <strong>Push Enabled:</strong> {pushEnabled ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationPreferences;
