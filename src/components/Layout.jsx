"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, User, LogOut, Bell } from "lucide-react";
import PWAInstallButton from "./PWAInstallButton";
import { useState } from "react";
import SimpleNotifications from "./SimpleNotifications";

const Layout = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  console.log(user?.username);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  Eventify
                </span>
              </Link>

              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  to="/events"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/events")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Events
                </Link>

                {user?.username && (
                  <Link
                    to="/my-registrations"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/my-registrations")
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    My Registrations
                  </Link>
                )}

                {user?.is_admin && (
                  <>
                    <Link
                      to="/admin"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive("/admin")
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Admin
                    </Link>
                    {/* <Link
                      to="/admin/analytics"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive("/admin/analytics")
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Analytics
                    </Link> */}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <PWAInstallButton />
              {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Notifications
                            </h3>
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              ×
                            </button>
                          </div>

                          <SimpleNotifications />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Overlay to close notifications */}
        {showNotifications && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
