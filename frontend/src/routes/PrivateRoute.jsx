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
    <div className="flex min-h-screen w-full flex-col bg-[#07111f] text-slate-100 lg:flex-row">
      {showSidebar && <Sidebar />}

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateRoute;