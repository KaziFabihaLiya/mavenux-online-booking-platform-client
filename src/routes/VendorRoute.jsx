import { AlertCircle } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useRole from "../hooks/useRole";
import { Navigate } from "react-router";

 const VendorRoute = ({ children }) => {
  const [role, isRoleLoading] = useRole();

  console.log("🔐 VendorRoute - Role:", role); // Debug
  console.log("🔐 VendorRoute - Loading:", isRoleLoading); // Debug

  // Show loading while fetching role
  if (isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if user is vendor OR admin (admin should access vendor pages too)
  if (role === "vendor" || role === "admin") {
    return children;
  }

  // Not vendor - show error and redirect
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          Vendor Access Required
        </h2>
        <p className="text-stone-600 mb-6">
          You need vendor privileges to access this page.
        </p>
        <p className="text-sm text-stone-500 mb-6">
          Current role: <span className="font-semibold">{role || "user"}</span>
        </p>
        <Navigate to="/" replace={true} />
      </div>
    </div>
  );
};

export default VendorRoute;
