import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import toast from "react-hot-toast";

export default function RequestedBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      console.log("📦 Fetching bookings for user:", user.email);
      fetchBookings();
    }
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📡 Calling GET /api/bookings/vendor/me");
      const { data } = await axiosSecure.get("/api/bookings/vendor/me");

      console.log("✅ Received bookings:", data);
      setBookings(data?.data || []);

      if (data?.message) {
        toast(data.message, { icon: "⚠️", duration: 5000 });
      }
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to load bookings";
      setError(errorMsg);
      toast.error(errorMsg);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      setProcessingId(bookingId);
      console.log(`📝 Updating booking ${bookingId} to ${status}`);

      const { data } = await axiosSecure.put(`/api/bookings/${bookingId}/status`, {
        status,
      });

      if (data?.success) {
        toast.success(`Booking ${status} successfully!`);
        fetchBookings();
      }
    } catch (error) {
      console.error("❌ Status update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update booking status"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-gradient-to-r from-yellow-400 to-orange-400",
      accepted: "bg-gradient-to-r from-green-400 to-emerald-400",
      rejected: "bg-gradient-to-r from-red-400 to-pink-400",
      paid: "bg-gradient-to-r from-blue-400 to-indigo-400",
    };
    return (
      <span
        className={`inline-block rounded-full ${badges[status]} px-3 py-1 text-xs font-bold uppercase text-white shadow-md`}
      >
        {status}
      </span>
    );
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    accepted: bookings.filter((b) => b.status === "accepted").length,
    paid: bookings.filter((b) => b.status === "paid").length,
    totalRevenue: bookings
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500"></div>
          <p className="font-semibold text-stone-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500"></div>
          <p className="font-semibold text-stone-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4">
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="mb-1 text-3xl font-black text-white">
                Booking Requests
              </h2>
              <p className="text-indigo-100">Manage customer bookings</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-8 text-center">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h3 className="mb-2 text-2xl font-bold text-red-800">
            Error Loading Bookings
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="mb-1 text-3xl font-black text-white">
              Booking Requests
            </h2>
            <p className="text-indigo-100">Manage customer bookings</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 p-6 text-white shadow-xl">
          <p className="mb-2 text-sm font-medium opacity-90">Pending</p>
          <p className="text-4xl font-black">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-6 text-white shadow-xl">
          <p className="mb-2 text-sm font-medium opacity-90">Accepted</p>
          <p className="text-4xl font-black">{stats.accepted}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 p-6 text-white shadow-xl">
          <p className="mb-2 text-sm font-medium opacity-90">Completed</p>
          <p className="text-4xl font-black">{stats.paid}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white shadow-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <p className="text-sm font-medium opacity-90">Revenue</p>
          </div>
          <p className="text-3xl font-black">৳{stats.totalRevenue}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        {bookings.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="mx-auto mb-4 h-20 w-20 text-stone-300" />
            <h3 className="mb-2 text-2xl font-bold text-stone-600">
              No bookings yet
            </h3>
            <p className="text-stone-500">Booking requests will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-stone-50 to-stone-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-stone-600">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-stone-600">
                    Ticket
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-stone-600">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-stone-600">
                    Total Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-stone-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-stone-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition-colors hover:bg-stone-50"
                  >
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="font-bold text-stone-800">
                            {booking.userName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-stone-400" />
                          <span className="text-sm text-stone-600">
                            {booking.userEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Ticket */}
                    <td className="px-6 py-4">
                      <p className="max-w-xs font-semibold text-stone-800 line-clamp-2">
                        {booking.ticketTitle}
                      </p>
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-600" />
                        <span className="text-lg font-bold text-stone-800">
                          {booking.bookingQuantity}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-xl font-black text-green-600">
                          ৳{booking.totalPrice}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(booking._id, "accepted")
                              }
                              disabled={processingId === booking._id}
                              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                            >
                              {processingId === booking._id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(booking._id, "rejected")
                              }
                              disabled={processingId === booking._id}
                              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === "accepted" && (
                          <span className="text-sm font-bold text-green-600">
                            ✓ Awaiting Payment
                          </span>
                        )}
                        {booking.status === "rejected" && (
                          <span className="text-sm font-bold text-red-600">
                            ✗ Rejected
                          </span>
                        )}
                        {booking.status === "paid" && (
                          <span className="text-sm font-bold text-blue-600">
                            ✓ Paid & Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
