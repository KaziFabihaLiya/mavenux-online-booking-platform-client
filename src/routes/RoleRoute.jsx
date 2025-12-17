import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { AlertTriangle } from "lucide-react";

export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            Access Denied
          </h2>
          <p className="text-stone-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
