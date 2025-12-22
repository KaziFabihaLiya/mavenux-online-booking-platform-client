import LoadingSpinner from "../components/common/LoadingSpinner";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log(user);

  if (loading) return <LoadingSpinner />;
  if (user) return children;
  // send current location so user can be redirected back after login
  return <Navigate to="/login" state={{ from: location }} replace={true} />;
};

export default PrivateRoutes;
