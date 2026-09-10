import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/dashboard/Sidebar";

const PrivateRoute = () => {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#07111f] text-slate-100">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default PrivateRoute;