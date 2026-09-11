import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/dashboard/Sidebar";

const PrivateRoute = () => {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const showSidebar = location.pathname !== "/landing";

  return (
    <div className="flex min-h-screen bg-[#07111f] text-slate-100">
      {showSidebar && <Sidebar />}
      <Outlet />
    </div>
  );
};

export default PrivateRoute;