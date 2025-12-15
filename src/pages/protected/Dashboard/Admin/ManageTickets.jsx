import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";

// EXPLANATION:
// Admin can view all vendor-submitted tickets
// Approve button: Makes ticket visible on "All Tickets" page
// Reject button: Ticket stays hidden, vendor can see rejection status
// Shows ticket details, vendor info, and status

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      setLoading(true);

      // FETCH FROM BACKEND
      const response = await fetch("/api/admin/tickets");
      const data = await response.json();
      setTickets(data.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ticketId) => {
    try {
      setProcessingId(ticketId);

      const response = await fetch(`/api/admin/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (response.ok) {
        toast.success("Ticket approved successfully!");
        fetchAllTickets();
      }
    } catch (error) {
      toast.error("Failed to approve ticket");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (ticketId) => {
    try {
      setProcessingId(ticketId);

      const response = await fetch(`/api/admin/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (response.ok) {
        toast.success("Ticket rejected");
        fetchAllTickets();
      }
    } catch (error) {
      toast.error("Failed to reject ticket");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.to.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
      approved: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
      },
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

  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    approved: tickets.filter((t) => t.status === "approved").length,
    rejected: tickets.filter((t) => t.status === "rejected").length,
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
          <p className="text-stone-600 text-sm mb-1">Total Tickets</p>
          <p className="text-3xl font-bold text-stone-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-500">
          <p className="text-stone-600 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
          <p className="text-stone-600 text-sm mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
          <p className="text-stone-600 text-sm mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                Manage Tickets
              </h2>
              <p className="text-stone-600">
                Review and approve vendor tickets
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">
              {searchTerm ? "No results found" : "No tickets to review"}
            </h3>
            <p className="text-stone-500">
              {searchTerm
                ? "Try adjusting your search"
                : "Vendor tickets will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Ticket Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Route & Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Price & Qty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    {/* Ticket Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ticket.image}
                          alt={ticket.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-stone-800 line-clamp-1">
                            {ticket.title}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-stone-500">
                            <Calendar className="w-3 h-3" />
                            {moment(ticket.departureDate).format(
                              "MMM DD, YYYY"
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Route & Type */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm mb-1">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">
                          {ticket.from} → {ticket.to}
                        </span>
                      </div>
                      <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                        {ticket.transportType}
                      </span>
                    </td>

                    {/* Price & Qty */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-lg font-bold text-green-600 mb-1">
                        <DollarSign className="w-4 h-4" />৳{ticket.price}
                      </div>
                      <p className="text-xs text-stone-500">
                        {ticket.ticketQuantity} seats
                      </p>
                    </td>

                    {/* Vendor */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-stone-800">
                        {ticket.vendorName}
                      </p>
                      <p className="text-xs text-stone-500">
                        {ticket.vendorEmail}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(ticket.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {ticket.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(ticket._id)}
                              disabled={processingId === ticket._id}
                              className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {processingId === ticket._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(ticket._id)}
                              disabled={processingId === ticket._id}
                              className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {ticket.status === "approved" && (
                          <span className="text-sm text-green-600 font-medium">
                            ✓ Approved
                          </span>
                        )}
                        {ticket.status === "rejected" && (
                          <span className="text-sm text-red-600 font-medium">
                            ✗ Rejected
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

/*
INTEGRATION:
1. Add to Admin sidebar in DashboardLayout
2. Backend endpoint: PUT /api/admin/tickets/:id/status
3. When approved: ticket shows in "All Tickets" page
4. When rejected: vendor sees rejection in "My Added Tickets"
*/
