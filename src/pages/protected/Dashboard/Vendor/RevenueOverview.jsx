// Charts(Recharts);
import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RevenueOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ticketsSold: 0,
    ticketsAdded: 0,
  });

  const vendorId = "USER_ID_FROM_AUTH";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch vendor's tickets
      const ticketsRes = await fetch(
        `http://localhost:5000/api/tickets/vendor/${vendorId}`
      );
      const ticketsData = await ticketsRes.json();

      // Fetch vendor's bookings
      const bookingsRes = await fetch(
        `http://localhost:5000/api/bookings/vendor/${vendorId}`
      );
      const bookingsData = await bookingsRes.json();

      const paidBookings = bookingsData.data.filter((b) => b.status === "paid");

      setStats({
        totalRevenue: paidBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        ticketsSold: paidBookings.reduce(
          (sum, b) => sum + b.bookingQuantity,
          0
        ),
        ticketsAdded: ticketsData.data.length,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sample chart data (replace with real data from backend)
  const monthlyData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 19000 },
    { month: "Mar", revenue: 15000 },
    { month: "Apr", revenue: 25000 },
    { month: "May", revenue: 22000 },
    { month: "Jun", revenue: 30000 },
  ];

  const ticketTypeData = [
    { name: "Bus", value: 45, color: "#3b82f6" },
    { name: "Train", value: 30, color: "#10b981" },
    { name: "Launch", value: 15, color: "#06b6d4" },
    { name: "Plane", value: 10, color: "#8b5cf6" },
  ];

  const salesTrend = [
    { week: "W1", sales: 12 },
    { week: "W2", sales: 19 },
    { week: "W3", sales: 15 },
    { week: "W4", sales: 25 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500"></div>
          <p className="font-semibold text-stone-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="mb-1 text-3xl font-black text-white">
              Revenue Overview
            </h2>
            <p className="text-emerald-100">Track your performance & earnings</p>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="group overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 shadow-xl transition-transform hover:scale-105">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white bg-opacity-20">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
            <TrendingUp className="h-6 w-6 text-white opacity-75" />
          </div>
          <p className="mb-2 text-sm font-medium text-green-100">Total Revenue</p>
          <p className="text-4xl font-black text-white">৳{stats.totalRevenue}</p>
          <p className="mt-2 text-xs text-green-100">From completed bookings</p>
        </div>

        <div className="group overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 shadow-xl transition-transform hover:scale-105">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white bg-opacity-20">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <TrendingUp className="h-6 w-6 text-white opacity-75" />
          </div>
          <p className="mb-2 text-sm font-medium text-blue-100">Tickets Sold</p>
          <p className="text-4xl font-black text-white">{stats.ticketsSold}</p>
          <p className="mt-2 text-xs text-blue-100">Total seats booked</p>
        </div>

        <div className="group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-8 shadow-xl transition-transform hover:scale-105">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white bg-opacity-20">
              <Package className="h-7 w-7 text-white" />
            </div>
            <TrendingUp className="h-6 w-6 text-white opacity-75" />
          </div>
          <p className="mb-2 text-sm font-medium text-purple-100">Tickets Added</p>
          <p className="text-4xl font-black text-white">{stats.ticketsAdded}</p>
          <p className="mt-2 text-xs text-purple-100">Active listings</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue */}
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h3 className="mb-6 text-xl font-black text-stone-800">
            Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: "#f59e0b", r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Types */}
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h3 className="mb-6 text-xl font-black text-stone-800">
            Tickets by Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ticketTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {ticketTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-6 text-xl font-black text-stone-800">
          Weekly Sales Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border-l-4 border-amber-500 bg-white p-6 shadow-lg">
          <p className="mb-2 text-sm font-semibold text-stone-600">
            Avg. Ticket Price
          </p>
          <p className="text-3xl font-black text-stone-800">
            ৳
            {stats.ticketsSold
              ? Math.round(stats.totalRevenue / stats.ticketsSold)
              : 0}
          </p>
        </div>

        <div className="rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-lg">
          <p className="mb-2 text-sm font-semibold text-stone-600">
            Conversion Rate
          </p>
          <p className="text-3xl font-black text-stone-800">
            {stats.ticketsAdded
              ? Math.round((stats.ticketsSold / stats.ticketsAdded) * 100)
              : 0}
            %
          </p>
        </div>

        <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-lg">
          <p className="mb-2 text-sm font-semibold text-stone-600">This Month</p>
          <p className="text-3xl font-black text-stone-800">
            ৳{monthlyData[monthlyData.length - 1]?.revenue || 0}
          </p>
        </div>

        <div className="rounded-xl border-l-4 border-purple-500 bg-white p-6 shadow-lg">
          <p className="mb-2 text-sm font-semibold text-stone-600">
            Avg. Monthly
          </p>
          <p className="text-3xl font-black text-stone-800">
            ৳
            {monthlyData.length
              ? Math.round(
                  monthlyData.reduce((sum, m) => sum + m.revenue, 0) /
                    monthlyData.length
                )
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
}

/*
BACKEND INTEGRATION:
GET http://localhost:5000/api/tickets/vendor/:vendorId
GET http://localhost:5000/api/bookings/vendor/:vendorId

Calculate:
- totalRevenue: sum of totalPrice where status = "paid"
- ticketsSold: sum of bookingQuantity where status = "paid"
- ticketsAdded: count of vendor's tickets
*/