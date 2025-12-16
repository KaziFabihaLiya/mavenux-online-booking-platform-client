// src/pages/protected/Dashboard/User/Profile.jsx
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
import moment from "moment";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(formData.name, formData.photoURL);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
    setIsEditing(false);
  };

  const getRoleBadge = () => {
    const badges = {
      admin: { bg: "bg-purple-100", text: "text-purple-700", label: "Admin" },
      vendor: { bg: "bg-blue-100", text: "text-blue-700", label: "Vendor" },
      user: { bg: "bg-stone-100", text: "text-stone-700", label: "User" },
    };
    const badge = badges[user?.role] || badges.user;
    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-white">
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
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  <span className="text-5xl font-bold text-amber-600">
                    {user.displayName?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                {user.displayName || "User"}
              </h1>
              <p className="text-amber-100 mb-3 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              {getRoleBadge()}
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors shadow-md"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
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
                name="name"
                value={formData.name}
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
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
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
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-semibold transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
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
                  {user.role || "User"}
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
