import React, { useState } from "react";
import {
  Menu,
  X,
  Bus,
  User,
  LogOut,
  LayoutDashboard,
  Ticket,
  ChevronDown,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user } = useAuth();
  const isLoggedIn = !!user; // Derive from user existence instead of hardcoding

  const handleLogout = () => {
    alert("Logout functionality - connect to Firebase signOut");
  };

  // Helper to get fallback user props
  const getUserDisplay = () => user?.displayName || "User";
  const getUserEmail = () => user?.email || "";
  const getUserPhoto = () => user?.photoURL || "/default-avatar.png"; // Provide a fallback image

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              TicketBari
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className="text-stone-700 hover:text-amber-600 font-medium transition-colors"
            >
              Home
            </a>
            {isLoggedIn && (
              <>
                <a
                  href="/all-tickets"
                  className="text-stone-700 hover:text-amber-600 font-medium transition-colors"
                >
                  All Tickets
                </a>
                <a
                  href="/dashboard"
                  className="text-stone-700 hover:text-amber-600 font-medium transition-colors"
                >
                  Dashboard
                </a>
              </>
            )}
          </div>

          {/* Desktop User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <img
                    src={getUserPhoto()}
                    alt={getUserDisplay()}
                    className="w-8 h-8 rounded-full border-2 border-amber-500"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }} // Fallback on load error
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-stone-800">
                      {getUserDisplay()}
                    </p>
                    <p className="text-xs text-stone-500">User</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-600 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-stone-200">
                      <p className="text-sm font-semibold text-stone-800">
                        {getUserDisplay()}
                      </p>
                      <p className="text-xs text-stone-500">{getUserEmail()}</p>
                    </div>

                    <a
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-stone-600" />
                      <span className="text-sm text-stone-700">My Profile</span>
                    </a>

                    <a
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-stone-600" />
                      <span className="text-sm text-stone-700">Dashboard</span>
                    </a>

                    <a
                      href="/dashboard/bookings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-stone-600" />
                      <span className="text-sm text-stone-700">
                        My Bookings
                      </span>
                    </a>

                    <div className="border-t border-stone-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600 font-medium">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-stone-700 hover:text-amber-600 font-medium transition-colors">
                    Login
                </Link>
                <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-stone-700" />
            ) : (
              <Menu className="w-6 h-6 text-stone-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200">
            <div className="flex flex-col gap-2">
              <a
                href="/"
                className="px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Home
              </a>
              {isLoggedIn ? (
                <>
                  <a
                    href="/all-tickets"
                    className="px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    All Tickets
                  </a>
                  <a
                    href="/dashboard"
                    className="px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    Dashboard
                  </a>

                  {/* User Info Mobile */}
                  <div className="px-4 py-3 mt-2 border-t border-stone-200">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={getUserPhoto()}
                        alt={getUserDisplay()}
                        className="w-10 h-10 rounded-full border-2 border-amber-500"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }} // Fallback on load error
                      />
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          {getUserDisplay()}
                        </p>
                        <p className="text-xs text-stone-500">
                          {getUserEmail()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-4 py-2 flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="w-full px-4 py-2 text-center border-2 border-amber-500 text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition-colors"
                  >
                    Login
                  </Link>
                    <Link to="/signup" className="w-full px-4 py-2 text-center bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                      Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
