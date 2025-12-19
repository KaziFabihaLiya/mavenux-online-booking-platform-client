// src/pages/protected/Dashboard/User/BecomeVendor.jsx
import { useState, useEffect } from "react";
import {
  Store,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  Package,
  DollarSign,
  Users,
  Trash2,
  ChevronDown,
} from "lucide-react";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import moment from "moment";

const BecomeVendor = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState("vendor");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch current user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/auth/me");
      return data.data;
    },
  });

  // Fetch user's requests
  const { data: myRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["role-requests", "my-requests"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/role-requests/my-requests");
      return data.data;
    },
  });

  // Submit role request mutation
  const submitRequestMutation = useMutation({
    mutationFn: async (requestedRole) => {
      const { data } = await axiosSecure.post("/api/role-requests", {
        requestedRole,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["role-requests"]);
      queryClient.invalidateQueries(["auth", "me"]);
      toast.success("Request submitted successfully!");
      setShowConfirmModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Request failed");
      setShowConfirmModal(false);
    },
  });

  // Cancel request mutation
  const cancelRequestMutation = useMutation({
    mutationFn: async (requestId) => {
      const { data } = await axiosSecure.delete(
        `/api/role-requests/${requestId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["role-requests"]);
      toast.success("Request cancelled");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel");
    },
  });

  const handleSubmitRequest = () => {
    submitRequestMutation.mutate(selectedRole);
  };

  const handleCancelRequest = (requestId) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      cancelRequestMutation.mutate(requestId);
    }
  };

  if (userLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  const currentRole = userData?.role || "user";
  const pendingRequests = myRequests.filter((r) => r.status === "pending");
  const hasPendingRequest = pendingRequests.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Current Status Card */}
      <div
        className={`rounded-xl shadow-lg p-8 text-white ${
          currentRole === "admin"
            ? "bg-gradient-to-br from-purple-600 to-purple-700"
            : currentRole === "vendor"
            ? "bg-gradient-to-br from-blue-600 to-blue-700"
            : "bg-gradient-to-br from-amber-500 to-orange-600"
        }`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            {currentRole === "admin" ? (
              <Shield className="w-10 h-10" />
            ) : currentRole === "vendor" ? (
              <Store className="w-10 h-10" />
            ) : (
              <Users className="w-10 h-10" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {currentRole} Account
            </h1>
            <p className="text-white/80">
              {currentRole === "admin"
                ? "Full administrative access"
                : currentRole === "vendor"
                ? "Sell tickets and manage bookings"
                : "Upgrade to unlock more features"}
            </p>
          </div>
        </div>

        {currentRole === "user" && !hasPendingRequest && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-white/90">
              💡 Want to become a vendor or admin? Submit a request below!
            </p>
          </div>
        )}
      </div>

      {/* My Requests Table */}
      {myRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-2xl font-bold text-stone-800">
              My Role Requests
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Track the status of your role upgrade requests
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Requested Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Request Date
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
                {myRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {request.requestedRole === "admin" ? (
                          <Shield className="w-5 h-5 text-purple-600" />
                        ) : (
                          <Store className="w-5 h-5 text-blue-600" />
                        )}
                        <span className="font-semibold text-stone-800 capitalize">
                          {request.requestedRole}
                        </span>
                      </div>
                    </td>

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

                    <td className="px-6 py-4">
                      {request.status === "pending" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          <Clock className="w-3 h-3 animate-pulse" />
                          Pending
                        </span>
                      )}
                      {request.status === "approved" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {request.status === "rejected" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {request.status === "pending" && (
                        <button
                          onClick={() => handleCancelRequest(request._id)}
                          disabled={cancelRequestMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                      {request.status === "rejected" &&
                        request.rejectionReason && (
                          <button className="text-sm text-stone-600 hover:text-stone-800">
                            View Reason
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Form Card */}
      {currentRole === "user" && !hasPendingRequest && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-2xl font-bold text-stone-800">
              Request Role Upgrade
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Choose the role you'd like to request
            </p>
          </div>

          <div className="p-6">
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Select Role *
              </label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none bg-white pr-10 font-medium"
                >
                  <option value="vendor">Vendor - Sell Tickets</option>
                  <option value="admin">Admin - Full Access</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
              </div>
            </div>

            {/* Role Benefits */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {selectedRole === "vendor" ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          List Tickets
                        </h4>
                        <p className="text-sm text-blue-700">
                          Add bus, train, and launch tickets
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Earn Revenue
                        </h4>
                        <p className="text-sm text-blue-700">
                          Get paid for every booking
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-1">
                          Full Control
                        </h4>
                        <p className="text-sm text-purple-700">
                          Manage all tickets and users
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-1">
                          User Management
                        </h4>
                        <p className="text-sm text-purple-700">
                          Approve requests and roles
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Info Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Review Process</p>
                <ul className="space-y-1 ml-4">
                  <li>• Your request will be reviewed by an admin</li>
                  <li>• You'll be notified when it's processed</li>
                  <li>• Approval usually takes 1-2 business days</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={submitRequestMutation.isPending}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitRequestMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Request for{" "}
                  {selectedRole === "vendor" ? "Vendor" : "Admin"}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-stone-800 mb-4">
              Confirm Request
            </h3>
            <p className="text-stone-600 mb-6">
              Are you sure you want to request{" "}
              <span className="font-semibold capitalize">{selectedRole}</span>{" "}
              access? An admin will review your request.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSubmitRequest}
                disabled={submitRequestMutation.isPending}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {submitRequestMutation.isPending ? "Submitting..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={submitRequestMutation.isPending}
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
export default BecomeVendor;