// src/pages/protected/Dashboard/DashboardLayout.jsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  Settings,
  Ticket,
  User,
  Users,
  X,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = user?.role || "user";

  const userMenuItems = [
    {
      id: "profile",
      label: "User Profile",
      icon: User,
      path: "/dashboard/user/profile",
    },
    {
      id: "booked",
      label: "My Booked Tickets",
      icon: Ticket,
      path: "/dashboard/user/bookings",
    },
    {
      id: "transactions",
      label: "Transaction History",
      icon: CreditCard,
      path: "/dashboard/user/transactions",
    },
  ];

  const vendorMenuItems = [
    {
      id: "profile",
      label: "Vendor Profile",
      icon: User,
      path: "/dashboard/vendor/profile",
    },
    {
      id: "add-ticket",
      label: "Add Ticket",
      icon: PlusCircle,
      path: "/dashboard/vendor/add-ticket",
    },
    {
      id: "my-tickets",
      label: "My Added Tickets",
      icon: Package,
      path: "/dashboard/vendor/my-tickets",
    },
    {
      id: "bookings",
      label: "Requested Bookings",
      icon: FileText,
      path: "/dashboard/vendor/bookings",
    },
    {
      id: "revenue",
      label: "Revenue Overview",
      icon: DollarSign,
      path: "/dashboard/vendor/revenue",
    },
  ];

  const adminMenuItems = [
    {
      id: "profile",
      label: "Admin Profile",
      icon: User,
      path: "/dashboard/admin/profile",
    },
    {
      id: "manage-tickets",
      label: "Manage Tickets",
      icon: Ticket,
      path: "/dashboard/admin/manage-tickets",
    },
    {
      id: "manage-users",
      label: "Manage Users",
      icon: Users,
      path: "/dashboard/admin/manage-users",
    },
    {
      id: "advertise",
      label: "Advertise Tickets",
      icon: Settings,
      path: "/dashboard/admin/advertise",
    },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case "vendor":
        return vendorMenuItems;
      case "admin":
        return adminMenuItems;
      default:
        return userMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = () => {
    if (!user?.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-stone-200 transition-all duration-300 ${
          isSidebarOpen ? "w-72" : "w-0 md:w-20"
        } overflow-hidden`}
      >
        <div className="p-6 border-b border-stone-200">
          <h1
            className={`font-bold text-xl text-stone-800 ${
              !isSidebarOpen && "hidden md:block md:text-center"
            }`}
          >
            {isSidebarOpen ? "Dashboard" : "TB"}
          </h1>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive(item.path)
                  ? "bg-amber-500 text-white shadow-md"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
              {isSidebarOpen && isActive(item.path) && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-4 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="font-semibold text-stone-800">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-stone-500 capitalize">{userRole}</p>
            </div>

            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials()}
              </div>
            )}
          </div>
        </header>

        {/* Content Area - Render Nested Routes */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
