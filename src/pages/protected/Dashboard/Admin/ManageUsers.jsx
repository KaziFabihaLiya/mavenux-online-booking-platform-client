// src/pages/protected/Dashboard/Admin/ManageUsers.jsx - FIXED WITH AUTH
import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  UserCheck,
  UserCog,
  Search,
  Mail,
  Loader2,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

export default function ManageUsers() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // ✅ FIX: Fetch users with auth headers
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/admin/users");
      return data.data;
    },
  });

  // ✅ FIX: Change role mutation
  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const { data } = await axiosSecure.put(
        `/api/admin/users/${userId}/role`,
        {
          role,
        }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["admin", "users"]);
      toast.success(`User role changed to ${variables.role}`);
      setProcessingId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to change role");
      setProcessingId(null);
    },
  });

  // ✅ FIX: Mark fraud mutation
  const markFraudMutation = useMutation({
    mutationFn: async ({ userId, isFraud }) => {
      const { data } = await axiosSecure.put(
        `/api/admin/users/${userId}/fraud`,
        { isFraud }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["admin", "users"]);
      toast.success(
        variables.isFraud ? "Vendor marked as fraud" : "Fraud status removed"
      );
      setProcessingId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
      setProcessingId(null);
    },
  });

  const handleChangeRole = async (userId, newRole) => {
    setProcessingId(userId);
    changeRoleMutation.mutate({ userId, role: newRole });
  };

  const handleMarkFraud = async (userId, isFraud) => {
    const action = isFraud ? "mark as fraud" : "remove fraud status";

    if (
      !window.confirm(
        `Are you sure you want to ${action}? This will ${
          isFraud
            ? "hide all tickets and block new submissions"
            : "restore ticket visibility"
        }.`
      )
    ) {
      return;
    }

    setProcessingId(userId);
    markFraudMutation.mutate({ userId, isFraud });
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    vendors: users.filter((u) => u.role === "vendor").length,
    users: users.filter((u) => u.role === "user").length,
    frauds: users.filter((u) => u.isFraud).length,
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { bg: "bg-purple-100", text: "text-purple-700" },
      vendor: { bg: "bg-blue-100", text: "text-blue-700" },
      user: { bg: "bg-stone-100", text: "text-stone-700" },
    };
    const badge = badges[role] || badges.user;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        {role?.toUpperCase() || "USER"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
          <p className="text-stone-600 text-sm mb-1">Total Users</p>
          <p className="text-3xl font-bold text-stone-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
          <p className="text-stone-600 text-sm mb-1">Admins</p>
          <p className="text-3xl font-bold text-purple-600">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
          <p className="text-stone-600 text-sm mb-1">Vendors</p>
          <p className="text-3xl font-bold text-blue-600">{stats.vendors}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-stone-500">
          <p className="text-stone-600 text-sm mb-1">Users</p>
          <p className="text-3xl font-bold text-stone-600">{stats.users}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
          <p className="text-stone-600 text-sm mb-1">Frauds</p>
          <p className="text-3xl font-bold text-red-600">{stats.frauds}</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                Manage Users
              </h2>
              <p className="text-stone-600">
                Control user roles and permissions
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">
              No users found
            </h3>
            <p className="text-stone-500">Try adjusting your filters</p>
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
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">
                    Current Role
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
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.displayName?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-stone-800">
                            {user.displayName || "User"}
                          </p>
                          {user.isFraud && (
                            <span className="text-xs text-red-600 font-medium">
                              ⚠ Fraud
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <span className="text-sm text-stone-600">
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {user.isFraud ? (
                        <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                          <AlertTriangle className="w-4 h-4" />
                          Fraud
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {/* Make Admin */}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleChangeRole(user._id, "admin")}
                            disabled={
                              processingId === user._id ||
                              changeRoleMutation.isPending
                            }
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            {processingId === user._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Shield className="w-3 h-3" />
                            )}
                            Make Admin
                          </button>
                        )}

                        {/* Make Vendor */}
                        {user.role !== "vendor" && (
                          <button
                            onClick={() => handleChangeRole(user._id, "vendor")}
                            disabled={
                              processingId === user._id ||
                              changeRoleMutation.isPending
                            }
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <UserCog className="w-3 h-3" />
                            Make Vendor
                          </button>
                        )}

                        {/* Mark as Fraud (Only for Vendors) */}
                        {user.role === "vendor" && (
                          <button
                            onClick={() =>
                              handleMarkFraud(user._id, !user.isFraud)
                            }
                            disabled={
                              processingId === user._id ||
                              markFraudMutation.isPending
                            }
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                              user.isFraud
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            {user.isFraud ? "Remove Fraud" : "Mark Fraud"}
                          </button>
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
