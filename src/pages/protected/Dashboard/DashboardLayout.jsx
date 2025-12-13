import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  FileText,
  Package,
  PlusCircle,
  Settings,
  Ticket,
  User,
  Users,
} from "lucide-react";

 const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("profile");

  // Demo user - change to 'vendor' or 'admin' to see different sidebars
  const [userRole, setUserRole] = useState("user");

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

  // Demo content components
  const UserProfile = () => (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          RH
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-800 mb-1">
            Rakib Hassan
          </h2>
          <p className="text-stone-600">user@example.com</p>
          <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            {userRole.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-stone-200 rounded-lg p-4">
          <p className="text-stone-600 text-sm mb-1">Full Name</p>
          <p className="font-semibold text-stone-800">Rakib Hassan</p>
        </div>
        <div className="border border-stone-200 rounded-lg p-4">
          <p className="text-stone-600 text-sm mb-1">Email</p>
          <p className="font-semibold text-stone-800">user@example.com</p>
        </div>
        <div className="border border-stone-200 rounded-lg p-4">
          <p className="text-stone-600 text-sm mb-1">Role</p>
          <p className="font-semibold text-stone-800 capitalize">{userRole}</p>
        </div>
        <div className="border border-stone-200 rounded-lg p-4">
          <p className="text-stone-600 text-sm mb-1">Member Since</p>
          <p className="font-semibold text-stone-800">January 2025</p>
        </div>
      </div>
    </div>
  );

  const MyBookedTickets = () => (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          My Booked Tickets
        </h2>
        <p className="text-stone-600">View and manage your ticket bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Dhaka to Chittagong - AC Bus",
            qty: 2,
            price: 2400,
            status: "accepted",
            from: "Dhaka",
            to: "Chittagong",
            date: "2025-12-20",
            time: "22:00",
          },
          {
            title: "Dhaka to Barisal - Luxury Launch",
            qty: 3,
            price: 4500,
            status: "pending",
            from: "Dhaka",
            to: "Barisal",
            date: "2025-12-23",
            time: "20:00",
          },
          {
            title: "Dhaka to Cox's Bazar - Sleeper",
            qty: 2,
            price: 3600,
            status: "rejected",
            from: "Dhaka",
            to: "Cox's Bazar",
            date: "2025-12-22",
            time: "23:30",
          },
        ].map((booking, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-stone-200"
          >
            <div className="h-32 bg-gradient-to-br from-amber-400 to-orange-500"></div>
            <div className="p-5">
              <h3 className="font-bold text-stone-800 mb-3 line-clamp-2">
                {booking.title}
              </h3>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-stone-600">
                  <span className="font-medium">Route:</span> {booking.from} →{" "}
                  {booking.to}
                </p>
                <p className="text-sm text-stone-600">
                  <span className="font-medium">Date:</span> {booking.date} at{" "}
                  {booking.time}
                </p>
                <p className="text-sm text-stone-600">
                  <span className="font-medium">Quantity:</span> {booking.qty}{" "}
                  tickets
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <div>
                  <p className="text-xs text-stone-500">Total Price</p>
                  <p className="text-xl font-bold text-amber-600">
                    ৳{booking.price.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </div>

              {booking.status === "accepted" && (
                <button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-medium transition-colors">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TransactionHistory = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          Transaction History
        </h2>
        <p className="text-stone-600">All your payment transactions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Ticket Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Payment Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            <tr className="hover:bg-stone-50">
              <td className="px-6 py-4 text-sm font-mono text-stone-600">
                txn_1234567890
              </td>
              <td className="px-6 py-4 text-sm text-stone-800">
                Dhaka to Chittagong - Train
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-amber-600">
                ৳800
              </td>
              <td className="px-6 py-4 text-sm text-stone-600">
                Dec 11, 2025 4:30 PM
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return <UserProfile />;
      case "booked":
        return <MyBookedTickets />;
      case "transactions":
        return <TransactionHistory />;
      default:
        return (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <LayoutDashboard className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">
              {menuItems.find((item) => item.id === activeView)?.label ||
                "Dashboard"}
            </h3>
            <p className="text-stone-500">This section is under development</p>
          </div>
        );
    }
  };

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

        {/* Role Switcher (Demo Only) */}
        <div
          className={`p-4 border-b border-stone-200 ${
            !isSidebarOpen && "hidden"
          }`}
        >
          <select
            value={userRole}
            onChange={(e) => {
              setUserRole(e.target.value);
              setActiveView("profile");
            }}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
          >
            <option value="user">User Role</option>
            <option value="vendor">Vendor Role</option>
            <option value="admin">Admin Role</option>
          </select>
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

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-4 transition-all">
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
              <p className="font-semibold text-stone-800">Rakib Hassan</p>
              <p className="text-xs text-stone-500 capitalize">{userRole}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
              RH
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
