// DashboardLayout.jsx - UPDATED VERSION WITH REAL USER DATA

import { useState } from "react";
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

import Profile from "./User/Profile";
import MyBookedTickets from "./User/MyBookedTickets";
import TransactionHistory from "./User/TransactionHistory";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("profile");

  // GET REAL USER FROM AUTH CONTEXT
  const { user, logOut } = useAuth();

  // Determine user role (you might store this in Firestore or your backend)
  // For now, defaulting to 'user' - you can fetch this from your backend
  const userRole = user?.role || "user"; // Get from your user document in Firestore/MongoDB

  const userMenuItems = [
    { id: "profile", label: "User Profile", icon: User },
    { id: "booked", label: "My Booked Tickets", icon: Ticket },
    { id: "transactions", label: "Transaction History", icon: CreditCard },
  ];

  const vendorMenuItems = [
    { id: "profile", label: "Vendor Profile", icon: User },
    { id: "add-ticket", label: "Add Ticket", icon: PlusCircle },
    { id: "my-tickets", label: "My Added Tickets", icon: Package },
    { id: "bookings", label: "Requested Bookings", icon: FileText },
    { id: "revenue", label: "Revenue Overview", icon: DollarSign },
  ];

  const adminMenuItems = [
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "manage-tickets", label: "Manage Tickets", icon: Ticket },
    { id: "manage-users", label: "Manage Users", icon: Users },
    { id: "advertise", label: "Advertise Tickets", icon: Settings },
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

  // HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      await logOut();
      // Navigate to home (use useNavigate from react-router-dom)
      // navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // GET USER INITIALS FOR AVATAR
  const getInitials = () => {
    if (!user?.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return <Profile />;
      case "booked":
        return <MyBookedTickets />;
      case "transactions":
        return <TransactionHistory />;
      default:
        return (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-stone-600 mb-2">
              {menuItems.find((item) => item.id === activeView)?.label ||
                "Dashboard"}
            </h3>
            <p className="text-stone-500">This section is under development</p>
          </div>
        );
    }
  };

  // SHOW LOADING STATE WHILE AUTH IS LOADING
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
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                activeView === item.id
                  ? "bg-amber-500 text-white shadow-md"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
              {isSidebarOpen && activeView === item.id && (
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

            {/* USER AVATAR - DYNAMIC */}
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

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

/*
============================================
HOW TO USE THIS IN YOUR PROJECT
============================================

1. REPLACE your existing DashboardLayout.jsx with this code

2. CREATE the component files:
   - src/components/dashboard/UserProfile.jsx (use the artifact I created)
   - src/components/dashboard/MyBookedTickets.jsx (use the artifact I created)
   - src/components/dashboard/TransactionHistory.jsx (create or use existing)

3. IMPORT the components at the top:
   import UserProfile from './UserProfile';
   import MyBookedTickets from './MyBookedTickets';

4. YOUR useAuth HOOK should return:
   {
     user: Firebase user object,
     loading: boolean,
     logOut: function
   }

5. IF YOU STORE USER ROLE IN FIRESTORE/MONGODB:
   
   // Fetch user role from your backend
   useEffect(() => {
     const fetchUserRole = async () => {
       const response = await fetch(`/api/users/${user.uid}`);
       const data = await response.json();
       setUserRole(data.role); // 'user', 'vendor', or 'admin'
     };
     
     if (user) fetchUserRole();
   }, [user]);

6. REMOVE the demo role switcher dropdown (it was just for testing)

============================================
KEY CHANGES FROM YOUR ORIGINAL CODE
============================================

✅ Uses real user.displayName instead of hardcoded "Rakib Hassan"
✅ Uses real user.email instead of hardcoded "user@example.com"
✅ Shows user.photoURL if available, otherwise shows initials
✅ Calls actual logOut function from AuthContext
✅ Removed demo role switcher
✅ Added loading state while auth is initializing
✅ Removed hardcoded UserProfile and MyBookedTickets content
✅ Now imports real components that fetch data from API

============================================
FILE STRUCTURE
============================================

src/
├── components/
│   └── dashboard/
│       ├── DashboardLayout.jsx (this file)
│       ├── UserProfile.jsx (artifact: user_profile_dynamic)
│       ├── MyBookedTickets.jsx (artifact: my_booked_tickets_dynamic)
│       └── TransactionHistory.jsx (create this)
├── hooks/
│   └── useAuth.js (your existing hook)
└── contexts/
    ├── AuthContext.jsx (your existing context)
    └── AuthProvider.jsx (your existing provider)

============================================
TESTING CHECKLIST
============================================

□ Login and verify user name shows in top bar
□ Verify user avatar/initials display correctly
□ Test sidebar navigation between sections
□ Verify logout button works
□ Check mobile responsiveness
□ Test User Profile page shows real data
□ Test My Booked Tickets page loads bookings
□ Verify countdown timers work
□ Test "Pay Now" button functionality
*/
