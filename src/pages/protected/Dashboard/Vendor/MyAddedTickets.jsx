import { useState, useEffect } from "react";
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
  Sparkles,
} from "lucide-react";

export default function MyAddedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Replace with actual vendorId from auth
  const vendorId = "USER_ID_FROM_AUTH";

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/tickets/vendor/${vendorId}`
      );
      const data = await response.json();
      setTickets(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (ticket) => {
    setSelectedTicket({ ...ticket });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      setUpdating(true);
      const response = await fetch(
        `http://localhost:5000/api/tickets/${selectedTicket._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedTicket),
        }
      );

      if (response.ok) {
        setShowUpdateModal(false);
        fetchMyTickets();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (ticketId) => {
    if (!confirm("Delete this ticket permanently?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        fetchMyTickets();
      }
    } catch (error) {
      console.error("Error:", error);
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
          <p className="mb-2 text-sm font-medium opacity-90">Total Tickets</p>
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
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute right-3 top-3">
                  {getStatusBadge(ticket.status)}
                </div>

                {/* Transport Type */}
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-stone-700">
                    {ticket.transportType}
                  </span>
                </div>
              </div>

              {/* Content */}
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

                {/* Actions */}
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

                {ticket.status === "rejected" && (
                  <p className="text-center text-xs font-semibold text-red-600 pt-2">
                    🚫 Actions disabled for rejected tickets
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 p-6">
              <h3 className="text-2xl font-black text-stone-800">
                Update Ticket
              </h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="rounded-lg p-2 transition-colors hover:bg-stone-100"
              >
                <X className="h-6 w-6 text-stone-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-stone-700">
                  Ticket Title
                </label>
                <input
                  type="text"
                  value={selectedTicket.title}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-stone-700">
                    Price
                  </label>
                  <input
                    type="number"
                    value={selectedTicket.price}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        price: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-stone-700">
                    Ticket Quantity
                  </label>
                  <input
                    type="number"
                    value={selectedTicket.ticketQuantity}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        ticketQuantity: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-stone-700">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={selectedTicket.departureDate?.split("T")[0]}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        departureDate: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-stone-700">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={selectedTicket.departureTime}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        departureTime: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-stone-200 p-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 rounded-xl border-2 border-stone-300 px-4 py-3 font-bold text-stone-700 transition-colors hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                disabled={updating}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
BACKEND INTEGRATION:
GET http://localhost:5000/api/tickets/vendor/:vendorId
PUT http://localhost:5000/api/tickets/:id
DELETE http://localhost:5000/api/tickets/:id
*/
