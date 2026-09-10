import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
const PublicRoute = () => {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;