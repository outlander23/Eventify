import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthTestPage = () => {
  const { user, login, logout, loading } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleTestLogin = async () => {
    console.log("Testing login...");
    const result = await login(username, password);
    setResult(result);
    console.log("Login result:", result);
  };

  const handleTestLogout = () => {
    console.log("Testing logout...");
    logout();
    setResult({ action: "logout" });
  };

  const checkLocalStorage = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    console.log("LocalStorage token:", token);
    console.log("LocalStorage user:", userData);
    return { token, userData };
  };

  const storageData = checkLocalStorage();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>

      <div className="space-y-6">
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
          <div className="space-y-2">
            <p>
              <strong>Loading:</strong> {loading ? "true" : "false"}
            </p>
            <p>
              <strong>User:</strong>{" "}
              {user ? JSON.stringify(user, null, 2) : "null"}
            </p>
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">LocalStorage Data</h2>
          <div className="space-y-2">
            <p>
              <strong>Token:</strong> {storageData.token || "null"}
            </p>
            <p>
              <strong>User Data:</strong> {storageData.userData || "null"}
            </p>
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
            <button
              onClick={handleTestLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Login
            </button>
            <button
              onClick={handleTestLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
            >
              Test Logout
            </button>
          </div>
        </div>

        {result && (
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Last Action Result</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-2">
            <button
              onClick={() => navigate("/events")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Events
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
