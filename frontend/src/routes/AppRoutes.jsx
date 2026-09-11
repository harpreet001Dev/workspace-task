import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import MyTasks from "../pages/MyTasks";
import AllTasks from "../pages/AllTasks";
import Landing from "../pages/Landing";
import InviteAccept from "../pages/InviteAccept";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/invite/:token" element={<InviteAccept />} />

      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/landing" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/all-tasks" element={<AllTasks />} />
      </Route>

      {/* Unknown route */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
};

export default AppRoutes;