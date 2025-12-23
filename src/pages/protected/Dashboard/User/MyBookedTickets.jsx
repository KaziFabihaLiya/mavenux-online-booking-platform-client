// src/pages/protected/Dashboard/User/MyBookedTickets.jsx - FIXED
import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Ticket,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import moment from "moment";
import { useUserBookings } from "../../../../hooks/useBookings";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function MyBookedTickets() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // FIXED: Remove userId parameter
  const { data: bookings = [], isLoading, error, refetch } = useUserBookings();

  const [countdowns, setCountdowns] = useState({});
  const [processingPayment, setProcessingPayment] = useState(null);

  // Show error if booking fetch fails
  useEffect(() => {
    if (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    }
  }, [error]);

  useEffect(() => {
    // Update countdowns every second
    const interval = setInterval(() => {
      updateCountdowns();
    }, 1000);

    return () => clearInterval(interval);
  }, [bookings]);

  const updateCountdowns = () => {
    const newCountdowns = {};

    bookings.forEach((booking) => {
      const departureDateTime = moment(
        `${booking.departureDate} ${booking.departureTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const now = moment();
      const diff = departureDateTime.diff(now);

      if (diff <= 0) {
        newCountdowns[booking._id] = {
          text: "Departed",
          isPast: true,
        };
      } else {
        const duration = moment.duration(diff);
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        newCountdowns[booking._id] = {
          text: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          isPast: false,
        };
      }
    });

    setCountdowns(newCountdowns);
  };

  const handlePayNow = async (booking) => {
    // Check if departure time has passed
    const countdown = countdowns[booking._id];
    if (countdown?.isPast) {
      toast.error("Cannot pay for a booking that has already departed");
      return;
    }

    setProcessingPayment(booking._id);

    try {
      // Create Stripe checkout session
      const response = await axiosSecure.post("/api/payment/create-session", {
        bookingId: booking._id,
      });

      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: AlertCircle,
        label: "PENDING",
      },
      accepted: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
        label: "ACCEPTED",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: XCircle,
        label: "REJECTED",
      },
      paid: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: CheckCircle,
        label: "PAID",
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-stone-800 mb-2">
          Failed to Load Bookings
        </h3>
        <p className="text-stone-600 mb-6">
          {error.response?.data?.message || "Please try again later"}
        </p>
        <button
          onClick={() => refetch()}
          className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-12 h-12 text-stone-400" />
        </div>
        <h3 className="text-2xl font-bold text-stone-800 mb-2">
          No Bookings Yet
        </h3>
        <p className="text-stone-600 mb-6">
          Start your journey by booking your first ticket!
        </p>
        <a
          href="/all-tickets"
          className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Browse Tickets
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              My Booked Tickets
            </h2>
            <p className="text-stone-600">
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}{" "}
              found
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600 font-medium">Paid</p>
              <p className="text-xl font-bold text-green-700">
                {bookings.filter((b) => b.status === "paid").length}
              </p>
            </div>
            <div className="px-4 py-2 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-600 font-medium">Pending</p>
              <p className="text-xl font-bold text-yellow-700">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-stone-200 hover:shadow-xl transition-all"
          >
            {/* Ticket Image (if available) */}
            {booking.image && (
              <div className="relative h-40 overflow-hidden">
                <img
                  src={booking.image}
                  alt={booking.ticketTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            )}

            {/* If no image, show status badge at top */}
            {!booking.image && (
              <div className="p-3 bg-stone-50 border-b">
                {getStatusBadge(booking.status)}
              </div>
            )}

            {/* Booking Details */}
            <div className="p-5">
              <h3 className="font-bold text-lg text-stone-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                {booking.ticketTitle}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-stone-600">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium">
                    {booking.from || "N/A"} → {booking.to || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-stone-600">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">
                    {moment(booking.departureDate).format("MMM DD, YYYY")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-stone-600">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">{booking.departureTime}</span>
                </div>

                <div className="flex items-center gap-2 text-stone-600">
                  <Ticket className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">
                    {booking.bookingQuantity || 1}{" "}
                    {Number(booking.bookingQuantity || 1) === 1
                      ? "ticket"
                      : "tickets"}
                  </span>
                </div>
              </div>

              {/* Countdown - Only show if not rejected or paid */}
              {booking.status !== "rejected" &&
                booking.status !== "paid" &&
                countdowns[booking._id] && (
                  <div
                    className={`mb-4 p-3 rounded-lg ${
                      countdowns[booking._id].isPast
                        ? "bg-red-50 border border-red-200"
                        : "bg-amber-50 border border-amber-200"
                    }`}
                  >
                    <p className="text-xs text-stone-600 mb-1">
                      {countdowns[booking._id].isPast ? "Status" : "Departs In"}
                    </p>
                    <p
                      className={`font-bold ${
                        countdowns[booking._id].isPast
                          ? "text-red-600"
                          : "text-amber-700"
                      }`}
                    >
                      {countdowns[booking._id].text}
                    </p>
                  </div>
                )}

              {/* Price */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 mb-4">
                <div>
                  <p className="text-xs text-stone-500">Total Amount</p>
                  <p className="text-2xl font-bold text-amber-600">
                    ৳
                    {booking.totalPrice != null
                      ? Number(booking.totalPrice).toLocaleString("en-BD")
                      : booking.price != null && booking.bookingQuantity != null
                      ? (
                          Number(booking.price) *
                          Number(booking.bookingQuantity)
                        ).toLocaleString("en-BD")
                      : "0"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {booking.status === "accepted" &&
                !countdowns[booking._id]?.isPast && (
                  <button
                    onClick={() => handlePayNow(booking)}
                    disabled={processingPayment === booking._id}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingPayment === booking._id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay Now
                      </>
                    )}
                  </button>
                )}

              {booking.status === "paid" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-semibold text-blue-700">
                    Payment Confirmed
                  </p>
                  {booking.transactionId && (
                    <p className="text-xs text-blue-600 mt-1 truncate">
                      Txn: {booking.transactionId}
                    </p>
                  )}
                </div>
              )}

              {booking.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-semibold text-yellow-700">
                    Waiting for Vendor Approval
                  </p>
                </div>
              )}

              {booking.status === "rejected" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-semibold text-red-700">
                    Booking Rejected
                  </p>
                </div>
              )}

              {booking.status === "accepted" &&
                countdowns[booking._id]?.isPast && (
                  <div className="bg-stone-100 border border-stone-300 rounded-lg p-3 text-center">
                    <p className="text-sm font-semibold text-stone-600">
                      Booking Expired
                    </p>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
