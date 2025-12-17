// src/hooks/useRole.jsx - UPDATED VERSION
import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading: isRoleLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["role", user?.email],
    queryFn: async () => {
      // Fetch user role from backend
      const result = await axiosSecure.get("/api/auth/me");
      return result.data.data.role;
    },
  });

  return [role, isRoleLoading];
};

export default useRole;

// ============================================
// ALTERNATIVE: Simpler version if role is in user object
// ============================================
// Since we store role in AuthContext when user logs in,
// you can also just use:
//
// const useRole = () => {
//   const { user, loading } = useAuth();
//   return [user?.role || "user", loading];
// };
