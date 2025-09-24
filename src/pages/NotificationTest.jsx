import { useState } from "react";
import notificationService from "../services/notificationService";
import Button from "../components/Button";
import { Bell, Check, X } from "lucide-react";

const NotificationTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, success, message) => {
    setTestResults((prev) => [
      ...prev,
      { test, success, message, timestamp: new Date() },
    ]);
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);

    // Test 1: Check browser support
    const isSupported = notificationService.isNotificationSupported();
    addResult(
      "Browser Support",
      isSupported,
      isSupported ? "Notifications supported" : "Notifications not supported"
    );

    // Test 2: Request permission
    try {
      const granted = await notificationService.requestPermission();
      addResult(
        "Permission Request",
        granted,
        granted ? "Permission granted" : "Permission denied"
      );

      if (granted) {
        // Test 3: Show local notification
        try {
          notificationService.showLocalNotification("Test Notification", {
            body: "This is a test notification from Eventify!",
            icon: "/pwa-192x192.png",
          });
          addResult("Local Notification", true, "Local notification shown");
        } catch (error) {
          addResult("Local Notification", false, `Error: ${error.message}`);
        }

        // Test 4: Test backend notification (mock auth headers)
        try {
          const mockAuthHeaders = () => ({ Authorization: "Bearer test" });
          await notificationService.sendTestNotification(mockAuthHeaders);
          addResult("Backend Test", true, "Backend test notification sent");
        } catch (error) {
          addResult(
            "Backend Test",
            false,
            `Backend error (fallback used): ${error.message}`
          );
        }
      }
    } catch (error) {
      addResult("Permission Request", false, `Error: ${error.message}`);
    }

    setTesting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Notification System Test
          </h1>
        </div>

        <div className="mb-6">
          <Button
            onClick={runTests}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {testing ? "Testing..." : "Run Notification Tests"}
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Test Results:
            </h2>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {result.success ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium text-gray-900">
                    {result.test}
                  </span>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    result.success ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {result.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            How to test notifications:
          </h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>Click "Run Notification Tests" above</li>
            <li>Allow notifications when prompted by your browser</li>
            <li>Check that you receive the test notification</li>
            <li>Go to the main app and test the notification dropdown</li>
            <li>Register for an event to test event reminders</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;
