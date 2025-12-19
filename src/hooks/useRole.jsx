// src/hooks/useRole.jsx - COMPLETELY FIXED
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role,
    isLoading: isRoleLoading,
    error,
  } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !loading && !!user?.email, // Only run when user is loaded
    queryFn: async () => {
      try {
        console.log("🔍 useRole - Fetching role for:", user?.email); // Debug

        // Fetch user role from backend
        const result = await axiosSecure.get("/api/auth/me");

        console.log("✅ useRole - Response:", result.data); // Debug

        const userRole = result.data.data.role;

        console.log("✅ useRole - Role extracted:", userRole); // Debug

        return userRole || "user"; // Default to "user" if no role
      } catch (error) {
        console.error(
          "❌ useRole - Error:",
          error.response?.data || error.message
        );
        return "user"; // Default to "user" on error
      }
    },
    retry: 1, // Retry once if it fails
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // If auth is still loading, return loading state
  if (loading) {
    return [null, true];
  }

  // If no user, return user role
  if (!user) {
    return ["user", false];
  }

  // Return role and loading state
  return [role || "user", isRoleLoading];
};

export default useRole;

// ============================================
// ALTERNATIVE: If backend call fails consistently
// ============================================
// Use this simpler version that gets role from AuthContext
//
// const useRole = () => {
//   const { user, loading } = useAuth();
//
//   // If you store role in user object from AuthContext
//   // Make sure to fetch and store it when user logs in
//
//   return [user?.role || "user", loading];
// };
//
// export default useRole;
