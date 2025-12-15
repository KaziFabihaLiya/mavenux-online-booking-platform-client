import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Loader2,
  Edit,
  Camera,
} from "lucide-react";

// EXPLANATION:
// Displays vendor's profile information
// Profile picture, name, email, role, join date
// Editable profile (optional enhancement)

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photoURL: "",
    role: "",
    createdAt: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // FETCH FROM BACKEND or AUTH CONTEXT
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      setProfile(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name }),
      });

      if (response.ok) {
        setEditing(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-32"></div>

        {/* Profile Content */}
        <div className="relative px-6 pb-6">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-6">
            <div className="relative">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {profile.name?.charAt(0) || "V"}
                  </span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-stone-800">
                {profile.name}
              </h2>
              <p className="text-stone-600">{profile.email}</p>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <button
                  onClick={handleUpdateProfile}
                  className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Card */}
                <div className="bg-stone-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-bold text-stone-800 mb-4">
                    Personal Information
                  </h3>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-600 mb-1">Full Name</p>
                      <p className="font-semibold text-stone-800">
                        {profile.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-600 mb-1">Email</p>
                      <p className="font-semibold text-stone-800">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Information Card */}
                <div className="bg-stone-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-bold text-stone-800 mb-4">
                    Account Information
                  </h3>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-600 mb-1">Role</p>
                      <span className="inline-block px-3 py-1 bg-purple-200 text-purple-700 rounded-full text-sm font-semibold">
                        {profile.role?.toUpperCase() || "VENDOR"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-600 mb-1">
                        Member Since
                      </p>
                      <p className="font-semibold text-stone-800">
                        {profile.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <p className="text-blue-100 text-sm mb-1">Total Tickets</p>
                <p className="text-3xl font-bold">0</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <p className="text-green-100 text-sm mb-1">Total Bookings</p>
                <p className="text-3xl font-bold">0</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <p className="text-purple-100 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">৳0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Shield className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-stone-800 mb-1">
              Vendor Account
            </h4>
            <p className="text-sm text-stone-600">
              As a vendor, you can add and manage travel tickets. All tickets
              require admin approval before appearing on the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
INTEGRATION:
1. Fetch profile from backend: GET /api/user/profile
   Or use authentication context (Firebase currentUser)
2. Update profile: PUT /api/user/profile
3. Display user's statistics (optional):
   - Count of tickets added
   - Count of bookings received
   - Total revenue earned
*/
