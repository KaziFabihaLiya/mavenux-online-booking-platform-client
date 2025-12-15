//Grid with update/delete
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
  Loader2,
} from "lucide-react";

// EXPLANATION:
// Vendor can view all their added tickets
// Update/Delete buttons (disabled if rejected)
// Shows verification status: pending, approved, rejected

export default function MyAddedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vendor/my-tickets");
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
      const response = await fetch(`/api/vendor/tickets/${selectedTicket._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTicket),
      });

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
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    try {
      const response = await fetch(`/api/vendor/tickets/${ticketId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMyTickets();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
      approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">My Added Tickets</h2>
        <p className="text-stone-600">Manage your ticket listings</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stone-600 mb-2">
            No tickets added yet
          </h3>
          <p className="text-stone-500">Start by adding your first ticket</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(ticket.status)}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-lg text-stone-800 line-clamp-1">
                  {ticket.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>
                    {ticket.from} → {ticket.to}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{new Date(ticket.departureDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      ৳{ticket.price}
                    </span>
                  </div>
                  <span className="text-sm text-stone-600">
                    {ticket.ticketQuantity} seats
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleUpdate(ticket)}
                    disabled={ticket.status === "rejected"}
                    className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="w-4 h-4" />
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(ticket._id)}
                    disabled={ticket.status === "rejected"}
                    className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {ticket.status === "rejected" && (
                  <p className="text-xs text-red-600 text-center">
                    Update/Delete disabled for rejected tickets
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpdateModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200">
              <h3 className="text-xl font-bold text-stone-800">Update Ticket</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Ticket Title
                </label>
                <input
                  type="text"
                  value={selectedTicket.title}
                  onChange={(e) =>
                    setSelectedTicket({ ...selectedTicket, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={selectedTicket.price}
                    onChange={(e) =>
                      setSelectedTicket({ ...selectedTicket, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
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
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
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
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
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
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-stone-200 flex gap-3">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
INTEGRATION:
1. Backend endpoints:
   - GET /api/vendor/my-tickets (fetch vendor's tickets)
   - PUT /api/vendor/tickets/:id (update ticket)
   - DELETE /api/vendor/tickets/:id (delete ticket)
2. Update/Delete disabled if status is "rejected"
3. Status managed by admin in ManageTickets page
*/