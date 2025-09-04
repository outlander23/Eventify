import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Calendar, User, LogOut, Settings, Bell, ChevronDown, Search, Plus, Home, Info, Phone } from 'lucide-react'
import { useAuth } from '../../lib/auth'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close menus when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Phone },
  ]

  const userMenuItems = [
    { href: '/account', label: 'Dashboard', icon: User },
    { href: '/account/registrations', label: 'My Registrations', icon: Calendar },
    { href: '/account/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-medium transition-all duration-200 relative group ${
                  location.pathname === link.href
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-200 ${
                  location.pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Notifications */}
            {isAuthenticated && (
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            )}

            {isAuthenticated ? (
              <>
                {/* Create Event Button for Admin */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/events/create"
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Event</span>
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative user-menu-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsUserMenuOpen(!isUserMenuOpen)
                    }}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      
                      {user?.role === 'admin' && (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                          <div className="border-b border-gray-100 my-1"></div>
                        </>
                      )}
                      
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth?mode=login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white border-t border-gray-100 transition-all duration-300 ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <nav className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === link.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <div className="border-t border-gray-100 my-4"></div>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              {userMenuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full text-left mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-gray-100 my-4"></div>
              <Link
                to="/auth?mode=login"
                className="block px-4 py-3 text-center text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=register"
                className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium transition-all duration-200 mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
