import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
const PublicRoute = () => {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );
  const workspace = useSelector((state) => state.auth.workspace);

  return isAuthenticated ? (
    <Navigate to={workspace ? "/dashboard" : "/landing"} replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;