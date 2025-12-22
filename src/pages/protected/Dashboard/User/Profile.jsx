// src/pages/protected/Dashboard/User/Profile.jsx - FULLY FUNCTIONAL
import { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  Loader2,
  Camera,
} from "lucide-react";
import useAuth from "../../../../hooks/useAuth";
import useRole from "../../../../hooks/useRole";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import moment from "moment";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [role, isRoleLoading] = useRole();
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  // ✅ Fetch user stats from database
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        // Fetch user's bookings
        const bookingsRes = await axiosSecure.get("/api/bookings/user/");
        const bookings = bookingsRes.data.data || [];

        // Fetch user's transactions
        const userData = await axiosSecure.get("/api/auth/me");
        const userId = userData.data.data._id;

        const transactionsRes = await axiosSecure.get(
          `/api/transactions/user/${userId}`
        );
        const transactions = transactionsRes.data.data || [];

        // Calculate stats
        const totalBookings = bookings.length;
        const totalSpent = transactions.reduce(
          (sum, txn) => sum + (txn.amount || 0),
          0
        );
        const pendingTrips = bookings.filter(
          (b) => b.status === "accepted" || b.status === "pending"
        ).length;

        return {
          totalBookings,
          totalSpent,
          pendingTrips,
        };
      } catch (error) {
        console.error("Error fetching stats:", error);
        return {
          totalBookings: 0,
          totalSpent: 0,
          pendingTrips: 0,
        };
      }
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ FIX: Update profile with Firebase updateProfile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Import updateProfile from Firebase
      const { updateProfile } = await import("firebase/auth");
      const { auth } = await import("../../../../utils/firebase.config");

      // Update Firebase profile
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      // Also update in MongoDB
      await axiosSecure.post("/api/user", {
        email: user.email,
        displayName: formData.displayName,
        photoURL: formData.photoURL,
        uid: user.uid,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);

      // Force page reload to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
    setIsEditing(false);
  };

  // ✅ Get role badge styling
  const getRoleDisplay = () => {
    switch (role) {
      case "admin":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          label: "Admin",
          gradient: "from-purple-500 to-purple-600",
        };
      case "vendor":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "Vendor",
          gradient: "from-blue-500 to-blue-600",
        };
      default:
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          label: "User",
          gradient: "from-amber-500 to-orange-600",
        };
    }
  };

  const roleDisplay = getRoleDisplay();

  if (authLoading || isRoleLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div
        className={`bg-gradient-to-br ${roleDisplay.gradient} rounded-2xl shadow-xl p-8 text-white`}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold">
                {getInitials(user.displayName)}
              </div>
            )}
            {isEditing && (
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">
              {user.displayName || "User"}
            </h1>
            <p className="text-white/90 mb-4 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
            <span
              className={`px-4 py-1.5 ${roleDisplay.bg} ${roleDisplay.text} rounded-full text-sm font-semibold inline-block`}
            >
              {roleDisplay.label}
            </span>
          </div>

          {/* Edit/Cancel Button */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors shadow-md"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-stone-200">
          <h2 className="text-2xl font-bold text-stone-800">
            Profile Information
          </h2>
        </div>

        {isEditing ? (
          // EDIT MODE
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* Photo URL Input */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                <Camera className="w-4 h-4 inline mr-2" />
                Photo URL
              </label>
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="https://example.com/photo.jpg"
              />
              {formData.photoURL && (
                <div className="mt-3">
                  <p className="text-sm text-stone-600 mb-2">Preview:</p>
                  <img
                    src={formData.photoURL}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-stone-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          // VIEW MODE
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-stone-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-stone-600 mb-2">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium">Email Address</span>
                </div>
                <p className="text-stone-800 font-semibold">{user.email}</p>
              </div>

              {/* Role */}
              <div className="bg-stone-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-stone-600 mb-2">
                  <Shield className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium">Account Role</span>
                </div>
                <p className="text-stone-800 font-semibold capitalize">
                  {role || "User"}
                </p>
              </div>

              {/* Account Created */}
              <div className="bg-stone-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-stone-600 mb-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium">Member Since</span>
                </div>
                <p className="text-stone-800 font-semibold">
                  {user.metadata?.creationTime
                    ? moment(user.metadata.creationTime).format("MMM DD, YYYY")
                    : "N/A"}
                </p>
              </div>

              {/* Last Sign In */}
              <div className="bg-stone-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-stone-600 mb-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium">Last Sign In</span>
                </div>
                <p className="text-stone-800 font-semibold">
                  {user.metadata?.lastSignInTime
                    ? moment(user.metadata.lastSignInTime).format(
                        "MMM DD, YYYY [at] h:mm A"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">
                    Account Status: Active
                  </p>
                  <p className="text-sm text-green-600">
                    Your account is in good standing
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Dynamic Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-blue-100 text-sm mb-2">Total Bookings</p>
          {statsLoading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <p className="text-4xl font-bold mb-1">
                {userStats?.totalBookings || 0}
              </p>
              <p className="text-blue-100 text-xs">All time</p>
            </>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-green-100 text-sm mb-2">Total Spent</p>
          {statsLoading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <p className="text-4xl font-bold mb-1">
                ৳{userStats?.totalSpent?.toLocaleString() || 0}
              </p>
              <p className="text-green-100 text-xs">All time</p>
            </>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-purple-100 text-sm mb-2">Pending Trips</p>
          {statsLoading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <p className="text-4xl font-bold mb-1">
                {userStats?.pendingTrips || 0}
              </p>
              <p className="text-purple-100 text-xs">Upcoming</p>
            </>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Your email address cannot be changed. If you
          need to update your email, please contact support.
        </p>
      </div>
    </div>
  );
}
