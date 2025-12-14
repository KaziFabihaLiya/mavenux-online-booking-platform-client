
import { User, Mail, Calendar, Shield, Edit2, Camera } from "lucide-react";
import moment from "moment";
import useAuth from "../../../../hooks/useAuth";

// EXPLANATION:
// This component fetches and displays real user data from Firebase Auth
// It shows user avatar, name, email, role, and account creation date
// Includes edit profile functionality (optional to implement)

export default function Profile() {
  // Get user from your AuthContext
  // const { user } = useContext(AuthContext);

  // Mock user data - Replace with actual Firebase user
  const {user, loading} = useAuth();

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-stone-600">Failed to load profile data</p>
      </div>
    );
  }

  // Get initials for avatar fallback
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
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar with Edit Button */}
          <div className="relative">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-amber-700 flex items-center justify-center text-4xl font-bold">
                {getInitials(user.displayName)}
              </div>
            )}

            <button className="absolute bottom-0 right-0 bg-white text-amber-600 p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">
              {user.displayName || "User"}
            </h1>
            <p className="text-amber-100 mb-4 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                User Account
              </span>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                ✓ Verified
              </span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-amber-600" />
          Account Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-stone-500" />
              <p className="text-sm text-stone-500 font-medium">Full Name</p>
            </div>
            <p className="text-lg font-semibold text-stone-800">
              {user.displayName || "Not provided"}
            </p>
          </div>

          {/* Email */}
          <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-stone-500" />
              <p className="text-sm text-stone-500 font-medium">
                Email Address
              </p>
            </div>
            <p className="text-lg font-semibold text-stone-800">
              {user.email}
            </p>
          </div>

          {/* User ID */}
          <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-stone-500" />
              <p className="text-sm text-stone-500 font-medium">User ID</p>
            </div>
            <p className="text-sm font-mono text-stone-600 break-all">
              {user.uid}
            </p>
          </div>

          {/* Account Type */}
          <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-stone-500" />
              <p className="text-sm text-stone-500 font-medium">Account Type</p>
            </div>
            <p className="text-lg font-semibold text-stone-800 capitalize">
              User
            </p>
          </div>

          {/* Member Since */}
          <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-stone-500" />
              <p className="text-sm text-stone-500 font-medium">Member Since</p>
            </div>
            <p className="text-lg font-semibold text-stone-800">
              {moment(user.metadata.creationTime).format("MMMM DD, YYYY")}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {moment(user.metadata.creationTime).fromNow()}
            </p>
          </div>

          {/* Last Sign In */}
          <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-stone-500" />
              <p className="text-sm text-stone-500 font-medium">Last Sign In</p>
            </div>
            <p className="text-lg font-semibold text-stone-800">
              {moment(user.metadata.lastSignInTime).format("MMM DD, YYYY")}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {moment(user.metadata.lastSignInTime).fromNow()}
            </p>
          </div>
        </div>
      </div>

      {/* Account Statistics (Optional - fetch from backend) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-blue-100 text-sm mb-2">Total Bookings</p>
          <p className="text-4xl font-bold mb-1">12</p>
          <p className="text-blue-100 text-xs">All time</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-green-100 text-sm mb-2">Total Spent</p>
          <p className="text-4xl font-bold mb-1">৳15,400</p>
          <p className="text-green-100 text-xs">All time</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-purple-100 text-sm mb-2">Pending Trips</p>
          <p className="text-4xl font-bold mb-1">3</p>
          <p className="text-purple-100 text-xs">Upcoming</p>
        </div>
      </div>
    </div>
  );
}

/*
===========================================
INTEGRATION WITH YOUR EXISTING CODE
===========================================

1. Import AuthContext:
   import { useContext } from 'react';
   import { AuthContext } from '../contexts/AuthContext';

2. Get user from context:
   const { user } = useContext(AuthContext);

3. Use Firebase user data:
   const fetchUserProfile = async () => {
     try {
       setuser({
         uid: user.uid,
         displayName: user.displayName,
         email: user.email,
         photoURL: user.photoURL,
         metadata: user.metadata
       });

       // Optionally fetch additional data from your backend
       const response = await axios.get(`/api/users/${user.uid}`);
       // This might include: role, total bookings, total spent, etc.
       
     } catch (error) {
       console.error('Error:', error);
     }
   };

4. In your DashboardLayout, replace hardcoded values:
   
   // Instead of:
   <p className="font-semibold text-stone-800">Rakib Hassan</p>
   
   // Use:
   <p className="font-semibold text-stone-800">{user?.displayName}</p>

5. For avatar:
   {user?.photoURL ? (
     <img src={user.photoURL} alt={user.displayName} />
   ) : (
     <div>{getInitials(user?.displayName)}</div>
   )}
*/
