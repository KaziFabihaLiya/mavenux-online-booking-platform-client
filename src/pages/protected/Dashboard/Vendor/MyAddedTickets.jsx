import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import {
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  X,
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import toast from "react-hot-toast";

export default function MyAddedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updating, setUpdating] = useState(false);

  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  // Fetch tickets
  const fetchMyTickets = async () => {
    if (!user?.email) {
      console.log("⏳ Waiting for user...");
      return;
    }

    try {
      setLoading(true);
      console.log("📡 Fetching tickets for:", user.email);

      // CRITICAL: Use /api prefix
      const res = await axiosSecure.get("/api/tickets/vendor/me");

      console.log("📦 API Response:", res.data);

      if (res.data?.success) {
        const fetchedTickets = res.data.data || [];
        console.log(`✅ Received ${fetchedTickets.length} tickets`);
        setTickets(fetchedTickets);

        if (fetchedTickets.length === 0) {
          toast("No tickets found. Add your first ticket!", { icon: "ℹ️" });
        }
      } else {
        console.warn("⚠️ API returned success=false");
        setTickets([]);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });

      const errorMsg =
        error.response?.data?.message || "Failed to load tickets";
      toast.error(errorMsg);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!authLoading && user) {
      console.log("🎫 Component mounted, user:", user.email);
      fetchMyTickets();
    }
  }, [user, authLoading]);

  // Handle new ticket from navigation
  useEffect(() => {
    if (location?.state?.newTicket) {
      const newTicket = location.state.newTicket;
      console.log("🆕 New ticket from navigation:", newTicket);

      setTickets((prev) => {
        if (prev.find((t) => String(t._id) === String(newTicket._id))) {
          return prev;
        }
        return [newTicket, ...prev];
      });

      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleUpdate = (ticket) => {
    setSelectedTicket({ ...ticket });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      setUpdating(true);
      const { data } = await axiosSecure.put(
        `/api/tickets/${selectedTicket._id}`,
        selectedTicket
      );

      if (data?.success) {
        toast.success("Ticket updated successfully!");
        setShowUpdateModal(false);
        fetchMyTickets();
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (ticketId) => {
    if (!confirm("Delete this ticket?")) return;

    try {
      const { data } = await axiosSecure.delete(`/api/tickets/${ticketId}`);
      if (data?.success) {
        toast.success("Ticket deleted!");
        fetchMyTickets();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-gradient-to-r from-yellow-400 to-orange-400",
        icon: Clock,
      },
      approved: {
        bg: "bg-gradient-to-r from-green-400 to-emerald-400",
        icon: CheckCircle,
      },
      rejected: {
        bg: "bg-gradient-to-r from-red-400 to-pink-400",
        icon: XCircle,
      },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full ${badge.bg} px-3 py-1 text-white shadow-lg`}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-bold uppercase">{status}</span>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500"></div>
          <p className="text-stone-600 font-semibold">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500"></div>
          <p className="text-stone-600 font-semibold">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="mb-1 text-3xl font-black text-white">My Tickets</h2>
            <p className="text-purple-100">Manage your ticket listings</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl">
          <p className="mb-2 text-sm font-medium opacity-90">Total</p>
          <p className="text-4xl font-black">{tickets.length}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 p-6 text-white shadow-xl">
          <p className="mb-2 text-sm font-medium opacity-90">Pending</p>
          <p className="text-4xl font-black">
            {tickets.filter((t) => t.status === "pending").length}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-6 text-white shadow-xl">
          <p className="mb-2 text-sm font-medium opacity-90">Approved</p>
          <p className="text-4xl font-black">
            {tickets.filter((t) => t.status === "approved").length}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-red-500 to-pink-500 p-6 text-white shadow-xl">
          <p className="mb-2 text-sm font-medium opacity-90">Rejected</p>
          <p className="text-4xl font-black">
            {tickets.filter((t) => t.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Tickets Grid */}
      {tickets.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center shadow-xl">
          <Package className="mx-auto mb-4 h-20 w-20 text-stone-300" />
          <h3 className="mb-2 text-2xl font-bold text-stone-600">
            No tickets yet
          </h3>
          <p className="text-stone-500">Start by adding your first ticket</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02]"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute right-3 top-3">
                  {getStatusBadge(ticket.status)}
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-stone-700">
                    {ticket.transportType}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-stone-800 line-clamp-1">
                  {ticket.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">
                      {ticket.from} → {ticket.to}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>
                      {new Date(ticket.departureDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-stone-200 pt-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-black text-green-600">
                      ৳{ticket.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-stone-600">
                    <Package className="h-4 w-4" />
                    <span className="font-semibold">
                      {ticket.ticketQuantity}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleUpdate(ticket)}
                    disabled={ticket.status === "rejected"}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="h-4 w-4" />
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(ticket._id)}
                    disabled={ticket.status === "rejected"}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal - (keeping existing modal code) */}
      {showUpdateModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          {/* Your existing modal code here */}
        </div>
      )}
    </div>
  );
}
