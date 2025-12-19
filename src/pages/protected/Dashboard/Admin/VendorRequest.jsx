// src/pages/protected/Dashboard/Admin/VendorRequests.jsx
import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  User,
  Calendar,
  Loader2,
  Store,
  Shield,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import moment from "moment";

const VendorRequest= ()=> {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [processingId, setProcessingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch role requests
  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "role-requests", filterStatus],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/api/admin/role-requests?status=${filterStatus}`
      );
      return data.data;
    },
  });

  // Process request mutation
  const processRequestMutation = useMutation({
    mutationFn: async ({ requestId, action, rejectionReason }) => {
      const { data } = await axiosSecure.put(
        `/api/admin/role-requests/${requestId}`,
        { action, rejectionReason }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["admin", "role-requests"]);
      queryClient.invalidateQueries(["admin", "users"]);
      toast.success(
        `Request ${
          variables.action === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      setProcessingId(null);
      setShowRejectModal(false);
      setRejectingRequest(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Action failed");
      setProcessingId(null);
    },
  });

  const handleApprove = (requestId) => {
    if (window.confirm("Approve this role request?")) {
      setProcessingId(requestId);
      processRequestMutation.mutate({ requestId, action: "approve" });
    }
  };

  const handleReject = (request) => {
    setRejectingRequest(request);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setProcessingId(rejectingRequest._id);
    processRequestMutation.mutate({
      requestId: rejectingRequest._id,
      action: "reject",
      rejectionReason,
    });
  };

  // Filter requests by search
  const filteredRequests = requests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.userName.toLowerCase().includes(searchLower) ||
      request.userEmail.toLowerCase().includes(searchLower) ||
      request.requestedRole.toLowerCase().includes(searchLower)
    );
  });

  // Statistics
  const stats = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setFilterStatus("pending")}
          className={`bg-white rounded-lg shadow-md p-5 border-l-4 cursor-pointer transition-all hover:shadow-lg ${
            filterStatus === "pending"
              ? "border-yellow-500 ring-2 ring-yellow-200"
              : "border-yellow-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-600 text-sm mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("approved")}
          className={`bg-white rounded-lg shadow-md p-5 border-l-4 cursor-pointer transition-all hover:shadow-lg ${
            filterStatus === "approved"
              ? "border-green-500 ring-2 ring-green-200"
              : "border-green-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-600 text-sm mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div
          onClick={() => setFilterStatus("rejected")}
          className={`bg-white rounded-lg shadow-md p-5 border-l-4 cursor-pointer transition-all hover:shadow-lg ${
            filterStatus === "rejected"
              ? "border-red-500 ring-2 ring-red-200"
              : "border-red-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-600 text-sm mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                Role Requests -{" "}
                {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </h2>
              <p className="text-stone-600">
                Review and manage user role upgrade requests
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {filterStatus === "pending" ? (
                <Clock className="w-12 h-12 text-stone-400" />
              ) : filterStatus === "approved" ? (
                <CheckCircle className="w-12 h-12 text-stone-400" />
              ) : (
                <XCircle className="w-12 h-12 text-stone-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-2">
              No {filterStatus} requests
            </h3>
            <p className="text-stone-600">
              {searchTerm
                ? "Try adjusting your search"
                : `All requests have been processed`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Current Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Requested Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Request Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Status
                  </th>
                  {filterStatus === "pending" && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {request.userPhoto ? (
                          <img
                            src={request.userPhoto}
                            alt={request.userName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                            {request.userName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-stone-800">
                            {request.userName}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-stone-500">
                            <Mail className="w-3 h-3" />
                            {request.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Current Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                        <User className="w-3 h-3" />
                        {request.currentRole}
                      </span>
                    </td>

                    {/* Requested Role */}
                    <td className="px-6 py-4">
                      {request.requestedRole === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          <Store className="w-3 h-3" />
                          Vendor
                        </span>
                      )}
                    </td>

                    {/* Request Date */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-stone-800 font-medium">
                          {moment(request.requestDate).format("MMM DD, YYYY")}
                        </p>
                        <p className="text-stone-500 text-xs">
                          {moment(request.requestDate).fromNow()}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {request.status === "pending" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          <Clock className="w-3 h-3 animate-pulse" />
                          Pending
                        </span>
                      )}
                      {request.status === "approved" && (
                        <div>
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                          {request.processedBy && (
                            <p className="text-xs text-stone-500 mt-1">
                              by {request.processedBy}
                            </p>
                          )}
                        </div>
                      )}
                      {request.status === "rejected" && (
                        <div>
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                          {request.rejectionReason && (
                            <p className="text-xs text-red-600 mt-1 max-w-xs">
                              {request.rejectionReason}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    {filterStatus === "pending" && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request._id)}
                            disabled={processingId === request._id}
                            className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === request._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approve
                          </button>

                          <button
                            onClick={() => handleReject(request)}
                            disabled={processingId === request._id}
                            className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && rejectingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-800">
                  Reject Request
                </h3>
                <p className="text-sm text-stone-600">
                  {rejectingRequest.userName}
                </p>
              </div>
            </div>

            <p className="text-stone-600 mb-4">
              Please provide a reason for rejecting this request. This will be
              visible to the user.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={confirmReject}
                disabled={
                  processingId === rejectingRequest._id ||
                  !rejectionReason.trim()
                }
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === rejectingRequest._id
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingRequest(null);
                  setRejectionReason("");
                }}
                disabled={processingId === rejectingRequest._id}
                className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default VendorRequest;