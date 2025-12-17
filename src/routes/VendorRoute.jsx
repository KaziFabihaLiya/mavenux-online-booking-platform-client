import { Navigate } from "react-router";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useRole from "../hooks/useRole";

const VendorRoute = ({ children }) => {
  const [role, isRoleLoading] = useRole();

  if (isRoleLoading) return <LoadingSpinner />;
  if (role === "vendor") return children;
  return <Navigate to="/" replace="true" />;
};

export default VendorRoute;
